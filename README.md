# Retro Vector Arcade Game

A classic vector graphics arcade game built with TypeScript, Vite, and HTML5 Canvas. Experience the nostalgic feel of 80s arcade games like Asteroids with authentic vector graphics rendering and retro aesthetics.

## 🎮 Game Features

- **Authentic vector graphics** with glowing green lines and CRT-style effects
- **Physics-based ship movement** with thrust, rotation, and momentum
- **Progressive difficulty** with increasing asteroid counts per level
- **Collision detection** and asteroid fragmentation system
- **Score system** with different points for asteroid sizes
- **Full-window gameplay** with dedicated status bar
- **Responsive design** that adapts to window resizing

## 🎯 Controls

- **Arrow Keys** or **WASD** - Move ship (thrust and rotate)
- **Space Bar** - Fire bullets / Start game / Restart after game over
- **P Key** - Pause/Resume game

## 🏗️ Code Structure

### `index.html`
The main HTML file that sets up the game interface:
- **Status Bar**: Fixed header displaying score, lives, level, and game status
- **Game Canvas**: Full-window canvas element for vector graphics rendering
- **Styling**: Retro green-on-black theme with glowing text effects
- **Module Loading**: Imports the main TypeScript entry point

### `src/main.ts`
Application entry point and initialization:
- **DOM Ready Handler**: Waits for page load before starting
- **Game Instantiation**: Creates and starts the main game instance
- **Error Handling**: Validates canvas element existence
- **Console Logging**: Provides startup confirmation and control instructions

### `src/vector-renderer.ts`
Custom vector graphics rendering engine:
- **VectorRenderer Class**: Core rendering system for vector graphics
- **Canvas Management**: Handles canvas sizing and context configuration
- **Shape Rendering**: Draws vector shapes with position, rotation, and scale
- **Visual Effects**: Implements glow effects and line styling for retro aesthetics
- **Text Rendering**: Renders game text with appropriate styling
- **Utility Methods**: Canvas clearing, resizing, and coordinate helpers

**Key Interfaces:**
- `Vector2D`: 2D coordinate representation
- `VectorShape`: Vector shape definition with points, styling, and properties

### `src/game-objects.ts`
Game entity system with physics and behavior:

#### `GameObject` (Abstract Base Class)
- **Position & Velocity**: 2D physics properties
- **Screen Wrapping**: Handles edge-to-edge teleportation
- **Collision Detection**: Distance-based collision system
- **Lifecycle Management**: Active state and update patterns

#### `Ship` Class
- **Movement Physics**: Thrust-based propulsion with momentum and friction
- **Rotation System**: Smooth turning mechanics
- **Speed Limiting**: Maximum velocity constraints
- **Vector Shape**: Triangular ship design with multiple points

#### `Asteroid` Class
- **Size Variants**: Large, medium, and small asteroid types
- **Random Generation**: Procedural velocity and rotation
- **Irregular Shape**: Multi-point vector design for realistic appearance
- **Scaling System**: Size-based visual and collision scaling

#### `Bullet` Class
- **Linear Movement**: High-speed projectile physics
- **Lifetime Management**: Auto-destruction after time limit
- **Minimal Shape**: Simple line-based visual representation

### `src/input-manager.ts`
Centralized input handling system:
- **Keyboard State**: Tracks pressed keys using Set data structure
- **Event Handlers**: Manages keydown/keyup events
- **Game-Specific Methods**: Abstracts common game controls
- **Browser Integration**: Prevents default behaviors for game keys
- **Callback System**: Supports single-press event handlers

### `src/game.ts`
Main game logic and state management:

#### Core Systems
- **Game Loop**: RequestAnimationFrame-based update cycle
- **State Management**: Ready, Playing, Paused, Game Over states
- **Physics Integration**: Coordinates all game object updates
- **Collision Processing**: Handles all collision detection and responses

#### Game Mechanics
- **Asteroid Spawning**: Level-based asteroid generation
- **Bullet System**: Firing rate limiting and projectile management
- **Scoring System**: Points based on asteroid size and difficulty
- **Life System**: Player lives with respawn mechanics
- **Level Progression**: Automatic advancement when asteroids cleared

#### UI Management
- **Status Updates**: Real-time score, lives, and level display
- **Game Messages**: State-appropriate text rendering
- **Input Processing**: Translates input to game actions

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## 🛠️ Technical Details

- **TypeScript**: Provides type safety and modern JavaScript features
- **Vite**: Fast development server with hot module replacement
- **ES Modules**: Modern module system for clean code organization
- **Canvas API**: Hardware-accelerated 2D graphics rendering
- **Vector Mathematics**: Custom 2D vector operations for physics
- **Object-Oriented Design**: Clean class hierarchy for game entities

## 📁 Project Structure

```
retro-arcade/
├── index.html              # Main HTML file with game interface
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── src/
    ├── main.ts            # Application entry point
    ├── vector-renderer.ts # Vector graphics rendering engine
    ├── game-objects.ts    # Game entity classes and physics
    ├── input-manager.ts   # Keyboard input handling
    └── game.ts           # Main game logic and state management
```

## 📋 TODO - Extension Ideas

### 🎵 Audio & Effects
- [ ] **Sound Effects**: Laser firing, explosions, thrust sounds
- [ ] **Background Music**: Retro synthesizer soundtrack
- [ ] **Audio Manager**: Centralized sound system with volume control
- [ ] **Spatial Audio**: Position-based sound effects

### 🎮 Gameplay Enhancements
- [ ] **Power-ups**: Shield, rapid fire, multi-shot, extra life
- [ ] **Different Enemy Types**: UFOs, mines, seeking missiles
- [ ] **Boss Battles**: Large enemies with multiple hit points
- [ ] **Weapon Upgrades**: Spread shot, piercing bullets, homing missiles

### 🎨 Visual Improvements
- [ ] **Particle Effects**: Explosion animations, thrust trails
- [ ] **Screen Shake**: Impact feedback for collisions
- [ ] **Color Variations**: Different colors for enemy types
- [ ] **Background Elements**: Starfield, nebulae, grid patterns

### 🏆 Game Features
- [ ] **High Score System**: Local storage persistence
- [ ] **Multiple Lives Display**: Visual life indicators
- [ ] **Combo System**: Score multipliers for consecutive hits
- [ ] **Time Challenges**: Speed run modes

### 🎯 Advanced Mechanics
- [ ] **Gravity Wells**: Environmental hazards that affect movement
- [ ] **Teleporters**: Warp zones for strategic gameplay
- [ ] **Destructible Environment**: Breakable barriers and obstacles
- [ ] **Co-op Mode**: Two-player simultaneous gameplay

### 🔧 Technical Improvements
- [ ] **Mobile Support**: Touch controls for mobile devices
- [ ] **Gamepad Support**: Controller input handling
- [ ] **Settings Menu**: Configurable controls and audio
- [ ] **Performance Optimization**: Object pooling, efficient rendering

### 🌐 Modern Features
- [ ] **WebGL Renderer**: Hardware-accelerated graphics
- [ ] **Multiplayer**: Real-time online gameplay
- [ ] **Leaderboards**: Global high score tracking
- [ ] **Achievements**: Unlock system with challenges

---

*Built with ❤️ for retro gaming enthusiasts*
