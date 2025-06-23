import { VectorRenderer, Vector2D } from './vector-renderer';
import { GameObject, Ship, Asteroid, Bullet } from './game-objects';
import { InputManager } from './input-manager';
import { HighScoreManager } from './high-score-manager';

export enum GameState {
  READY,
  PLAYING,
  GAME_OVER,
  PAUSED
}

export class Game {
  private renderer: VectorRenderer;
  private input: InputManager;
  private ship: Ship;
  private asteroids: Asteroid[] = [];
  private bullets: Bullet[] = [];
  private state: GameState = GameState.READY;
  
  // Game stats
  private score: number = 0;
  private lives: number = 3;
  private level: number = 1;
  
  // Timing
  private lastTime: number = 0;
  private fireDelay: number = 0;
  private maxFireDelay: number = 0.15; // 150ms between shots
  
  // UI elements
  private scoreElement: HTMLElement;
  private highScoreElement: HTMLElement;
  private levelElement: HTMLElement;
  private statusElement: HTMLElement;
  private lifeIndicatorsElement: HTMLElement;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new VectorRenderer(canvas);
    this.input = new InputManager();
    
    // Get UI elements
    this.scoreElement = document.getElementById('score')!;
    this.highScoreElement = document.getElementById('high-score')!;
    this.levelElement = document.getElementById('level')!;
    this.statusElement = document.getElementById('game-status')!;
    this.lifeIndicatorsElement = document.getElementById('life-indicators')!;
    
    this.setupGame();
    this.setupInputHandlers();
    this.setupWindowResize();
  }

  private setupGame() {
    const canvasSize = this.renderer.getCanvasSize();
    this.ship = new Ship(canvasSize.x / 2, canvasSize.y / 2);
    this.createAsteroids();
    this.updateUI();
  }

  private setupInputHandlers() {
    this.input.onKeyDown('Space', () => {
      if (this.state === GameState.READY) {
        this.startGame();
      } else if (this.state === GameState.GAME_OVER) {
        this.resetGame();
      }
    });

    this.input.onKeyDown('KeyP', () => {
      if (this.state === GameState.PLAYING) {
        this.pauseGame();
      } else if (this.state === GameState.PAUSED) {
        this.resumeGame();
      }
    });
  }

  private setupWindowResize() {
    window.addEventListener('resize', () => {
      this.renderer.resize();
    });
  }

  private createAsteroids() {
    this.asteroids = [];
    const canvasSize = this.renderer.getCanvasSize();
    const numAsteroids = 4 + this.level;

    for (let i = 0; i < numAsteroids; i++) {
      let x, y;
      // Ensure asteroids don't spawn too close to the ship
      do {
        x = Math.random() * canvasSize.x;
        y = Math.random() * canvasSize.y;
      } while (
        Math.abs(x - this.ship.position.x) < 100 &&
        Math.abs(y - this.ship.position.y) < 100
      );

      this.asteroids.push(new Asteroid(x, y, 'large'));
    }
  }

  private startGame() {
    this.state = GameState.PLAYING;
    this.statusElement.textContent = 'PLAYING';
  }

  private pauseGame() {
    this.state = GameState.PAUSED;
    this.statusElement.textContent = 'PAUSED';
  }

  private resumeGame() {
    this.state = GameState.PLAYING;
    this.statusElement.textContent = 'PLAYING';
  }

  private resetGame() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.state = GameState.READY;
    this.statusElement.textContent = 'READY';
    
    this.bullets = [];
    this.setupGame();
  }

  private handleInput(deltaTime: number) {
    if (this.state !== GameState.PLAYING) return;

    // Ship controls
    if (this.input.isThrustPressed()) {
      this.ship.setThrust(1);
    } else {
      this.ship.setThrust(0);
    }

    if (this.input.isLeftPressed()) {
      this.ship.rotate(-1);
    }

    if (this.input.isRightPressed()) {
      this.ship.rotate(1);
    }

    // Firing
    this.fireDelay -= deltaTime;
    if (this.input.isFirePressed() && this.fireDelay <= 0) {
      this.fireBullet();
      this.fireDelay = this.maxFireDelay;
    }
  }

  private fireBullet() {
    const bullet = new Bullet(
      this.ship.position.x,
      this.ship.position.y,
      this.ship.rotation
    );
    this.bullets.push(bullet);
  }

  private updateGameObjects(deltaTime: number) {
    if (this.state !== GameState.PLAYING) return;

    const canvasSize = this.renderer.getCanvasSize();

    // Update ship
    this.ship.update(deltaTime, canvasSize);

    // Update asteroids
    this.asteroids.forEach(asteroid => {
      asteroid.update(deltaTime, canvasSize);
    });

    // Update bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(deltaTime, canvasSize);
      return bullet.active;
    });
  }

  private checkCollisions() {
    if (this.state !== GameState.PLAYING) return;

    // Bullet-asteroid collisions
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      for (let j = this.asteroids.length - 1; j >= 0; j--) {
        const asteroid = this.asteroids[j];
        
        if (bullet.collidesWith(asteroid)) {
          // Remove bullet and asteroid
          this.bullets.splice(i, 1);
          this.asteroids.splice(j, 1);
          
          // Add score
          this.addScore(asteroid.getSize());
          
          // Break asteroid into smaller pieces
          this.breakAsteroid(asteroid);
          break;
        }
      }
    }

    // Ship-asteroid collisions
    for (const asteroid of this.asteroids) {
      if (this.ship.collidesWith(asteroid)) {
        this.loseLife();
        break;
      }
    }

    // Check for level completion
    if (this.asteroids.length === 0) {
      this.nextLevel();
    }
  }

  private addScore(asteroidSize: 'large' | 'medium' | 'small') {
    switch (asteroidSize) {
      case 'large': this.score += 20; break;
      case 'medium': this.score += 50; break;
      case 'small': this.score += 100; break;
    }
    this.updateUI();
  }

  private breakAsteroid(asteroid: Asteroid) {
    const size = asteroid.getSize();
    let newSize: 'medium' | 'small' | null = null;
    let numPieces = 0;

    if (size === 'large') {
      newSize = 'medium';
      numPieces = 2;
    } else if (size === 'medium') {
      newSize = 'small';
      numPieces = 2;
    }

    if (newSize) {
      for (let i = 0; i < numPieces; i++) {
        const newAsteroid = new Asteroid(
          asteroid.position.x,
          asteroid.position.y,
          newSize
        );
        this.asteroids.push(newAsteroid);
      }
    }
  }

  private loseLife() {
    this.lives--;
    this.updateUI();
    
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Reset ship position
      const canvasSize = this.renderer.getCanvasSize();
      this.ship.position.x = canvasSize.x / 2;
      this.ship.position.y = canvasSize.y / 2;
      this.ship.velocity.x = 0;
      this.ship.velocity.y = 0;
      this.ship.rotation = 0;
    }
  }

  private nextLevel() {
    this.level++;
    this.createAsteroids();
    this.updateUI();
  }

  private gameOver() {
    this.state = GameState.GAME_OVER;
    this.statusElement.textContent = 'GAME OVER';
    
    // Check and save high score
    const isNewHighScore = HighScoreManager.addScore(this.score, this.level);
    if (isNewHighScore) {
      this.statusElement.textContent = 'NEW HIGH SCORE!';
    }
  }

  private createLifeIndicators() {
    this.lifeIndicatorsElement.innerHTML = '';
    
    for (let i = 0; i < this.lives; i++) {
      const lifeShip = document.createElement('div');
      lifeShip.className = 'life-ship';
      lifeShip.innerHTML = `
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10,2 6,14 8,11 12,11 14,14" 
                   fill="none" 
                   stroke="#00ff00" 
                   stroke-width="1.5" 
                   stroke-linejoin="round"/>
        </svg>
      `;
      this.lifeIndicatorsElement.appendChild(lifeShip);
    }
  }

  private updateUI() {
    this.scoreElement.textContent = this.score.toString();
    this.highScoreElement.textContent = HighScoreManager.getHighScore().toString();
    this.levelElement.textContent = this.level.toString();
    this.createLifeIndicators();
  }

  private render() {
    this.renderer.clear(1/60); // Pass delta time for starfield animation

    // Render game objects
    if (this.ship.active) {
      this.renderer.drawShape(this.ship.getShape(), this.ship.position, this.ship.rotation);
    }

    this.asteroids.forEach(asteroid => {
      this.renderer.drawShape(
        asteroid.getShape(),
        asteroid.position,
        asteroid.rotation,
        asteroid.scale
      );
    });

    this.bullets.forEach(bullet => {
      this.renderer.drawShape(bullet.getShape(), bullet.position, bullet.rotation);
    });

    // Render UI messages
    const canvasSize = this.renderer.getCanvasSize();
    
    if (this.state === GameState.READY) {
      this.renderer.drawText(
        'PRESS SPACE TO START',
        { x: canvasSize.x / 2, y: canvasSize.y / 2 },
        '#00ff00',
        24
      );
      this.renderer.drawText(
        'ARROW KEYS OR WASD TO MOVE • SPACE TO FIRE • P TO PAUSE',
        { x: canvasSize.x / 2, y: canvasSize.y / 2 + 40 },
        '#00ff00',
        14
      );
    } else if (this.state === GameState.PAUSED) {
      this.renderer.drawText(
        'PAUSED',
        { x: canvasSize.x / 2, y: canvasSize.y / 2 },
        '#ffff00',
        32
      );
    } else if (this.state === GameState.GAME_OVER) {
      const isHighScore = HighScoreManager.isHighScore(this.score);
      this.renderer.drawText(
        isHighScore ? 'NEW HIGH SCORE!' : 'GAME OVER',
        { x: canvasSize.x / 2, y: canvasSize.y / 2 },
        isHighScore ? '#ffff00' : '#ff0000',
        32
      );
      this.renderer.drawText(
        'PRESS SPACE TO RESTART',
        { x: canvasSize.x / 2, y: canvasSize.y / 2 + 40 },
        '#ff0000',
        18
      );
    }
  }

  // Main game loop
  update(currentTime: number) {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.handleInput(deltaTime);
    this.updateGameObjects(deltaTime);
    this.checkCollisions();
    this.render();

    requestAnimationFrame((time) => this.update(time));
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame((time) => this.update(time));
  }
}
