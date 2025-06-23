import { Vector2D, VectorShape } from './vector-renderer';

export abstract class GameObject {
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  scale: number;
  active: boolean;

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.scale = 1;
    this.active = true;
  }

  abstract getShape(): VectorShape;
  abstract update(deltaTime: number, canvasSize: Vector2D): void;
  abstract getCollisionRadius(): number;

  // Wrap around screen edges
  protected wrapPosition(canvasSize: Vector2D) {
    if (this.position.x < 0) this.position.x = canvasSize.x;
    if (this.position.x > canvasSize.x) this.position.x = 0;
    if (this.position.y < 0) this.position.y = canvasSize.y;
    if (this.position.y > canvasSize.y) this.position.y = 0;
  }

  // Check collision with another object
  collidesWith(other: GameObject): boolean {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.getCollisionRadius() + other.getCollisionRadius());
  }
}

export class Ship extends GameObject {
  private thrust: number = 0;
  private maxSpeed: number = 300;
  private thrustPower: number = 400;
  private rotationSpeed: number = 5;
  private friction: number = 0.98;

  constructor(x: number, y: number) {
    super(x, y);
  }

  getShape(): VectorShape {
    return {
      points: [
        { x: 0, y: -15 },    // nose
        { x: -8, y: 10 },    // left wing
        { x: -4, y: 6 },     // left inner
        { x: 4, y: 6 },      // right inner
        { x: 8, y: 10 }      // right wing
      ],
      closed: true,
      color: '#00ff00',
      lineWidth: 2
    };
  }

  update(deltaTime: number, canvasSize: Vector2D) {
    // Apply thrust
    if (this.thrust > 0) {
      const thrustX = Math.sin(this.rotation) * this.thrustPower * deltaTime;
      const thrustY = -Math.cos(this.rotation) * this.thrustPower * deltaTime;
      this.velocity.x += thrustX;
      this.velocity.y += thrustY;
    }

    // Limit speed
    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
    }

    // Apply friction
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    // Update position
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Wrap around screen
    this.wrapPosition(canvasSize);
  }

  setThrust(thrust: number) {
    this.thrust = Math.max(0, Math.min(1, thrust));
  }

  rotate(direction: number) {
    this.rotation += direction * this.rotationSpeed * (1/60); // Assuming 60fps
  }

  getCollisionRadius(): number {
    return 12;
  }
}

export class Asteroid extends GameObject {
  private rotationSpeed: number;
  private size: 'large' | 'medium' | 'small';

  constructor(x: number, y: number, size: 'large' | 'medium' | 'small' = 'large') {
    super(x, y);
    this.size = size;
    this.rotationSpeed = (Math.random() - 0.5) * 2;
    
    // Random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 100;
    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;

    // Set scale based on size
    switch (size) {
      case 'large': this.scale = 1; break;
      case 'medium': this.scale = 0.6; break;
      case 'small': this.scale = 0.3; break;
    }
  }

  getShape(): VectorShape {
    // Irregular asteroid shape
    return {
      points: [
        { x: 20, y: -5 },
        { x: 15, y: -15 },
        { x: 5, y: -20 },
        { x: -10, y: -18 },
        { x: -20, y: -8 },
        { x: -18, y: 5 },
        { x: -12, y: 15 },
        { x: 0, y: 20 },
        { x: 12, y: 18 },
        { x: 18, y: 8 }
      ],
      closed: true,
      color: '#00ff00',
      lineWidth: 1.5
    };
  }

  update(deltaTime: number, canvasSize: Vector2D) {
    this.rotation += this.rotationSpeed * deltaTime;
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.wrapPosition(canvasSize);
  }

  getCollisionRadius(): number {
    return 20 * this.scale;
  }

  getSize(): 'large' | 'medium' | 'small' {
    return this.size;
  }
}

export class Bullet extends GameObject {
  private lifeTime: number = 0;
  private maxLifeTime: number = 2; // 2 seconds

  constructor(x: number, y: number, angle: number) {
    super(x, y);
    const speed = 400;
    this.velocity.x = Math.sin(angle) * speed;
    this.velocity.y = -Math.cos(angle) * speed;
  }

  getShape(): VectorShape {
    return {
      points: [
        { x: 0, y: -2 },
        { x: 0, y: 2 }
      ],
      closed: false,
      color: '#ffffff',
      lineWidth: 2
    };
  }

  update(deltaTime: number, canvasSize: Vector2D) {
    this.lifeTime += deltaTime;
    if (this.lifeTime > this.maxLifeTime) {
      this.active = false;
      return;
    }

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.wrapPosition(canvasSize);
  }

  getCollisionRadius(): number {
    return 2;
  }
}
