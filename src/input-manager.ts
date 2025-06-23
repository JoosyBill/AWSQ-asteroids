export class InputManager {
  private keys: Set<string> = new Set();
  private keyDownHandlers: Map<string, () => void> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      
      // Handle single key press events
      const handler = this.keyDownHandlers.get(e.code);
      if (handler) {
        handler();
      }
      
      // Prevent default browser behavior for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    // Prevent context menu on right click
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key);
  }

  onKeyDown(key: string, handler: () => void) {
    this.keyDownHandlers.set(key, handler);
  }

  // Game-specific input methods
  isThrustPressed(): boolean {
    return this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW');
  }

  isLeftPressed(): boolean {
    return this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA');
  }

  isRightPressed(): boolean {
    return this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD');
  }

  isFirePressed(): boolean {
    return this.isKeyPressed('Space');
  }
}
