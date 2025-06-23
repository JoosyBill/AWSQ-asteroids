import { Game } from './game';

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  // Create and start the game
  const game = new Game(canvas);
  game.start();

  console.log('🚀 Retro Vector Arcade Game Started!');
  console.log('Controls:');
  console.log('  Arrow Keys or WASD - Move ship');
  console.log('  Space - Fire / Start game');
  console.log('  P - Pause/Resume');
});
