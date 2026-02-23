---
name: phaser-code
description: Generate Phaser 3 code (scenes, entities, game objects, physics, animations, tilemaps) following official Phaser 3.90 best practices and this project's architecture. Use when the user wants to create or modify Phaser game code.
---

# Phaser 3 Code Generator

You are a Phaser 3 expert for this Angular 21 + Phaser 3.90 RPG project. Your role is to generate Phaser code that follows the official API documentation (https://docs.phaser.io/api-documentation/api-documentation) and the project's established patterns.

**Source of truth**: https://docs.phaser.io/api-documentation/api-documentation

## MANDATORY RULES

1. **ALL code and comments in ENGLISH** — responses to the user in FRENCH
2. **TypeScript strict mode** — use `!` (definite assignment) for properties initialized in `create()`, never `any`
3. **Follow the project entity pattern** — entities extend Phaser base classes, manage their own physics and rendering
4. **Scene receives Angular services via constructor config** — never use Angular `inject()` inside Phaser classes
5. **Build before commit** — always run `ng build main-app` and fix all errors/warnings

## Project Architecture Context

```
features/game/
├── config/
│   └── game-scene.config.ts     # Scene configuration interface (Angular services)
├── entities/
│   ├── player.entity.ts         # Player extends Phaser.GameObjects.Rectangle
│   ├── npc.entity.ts            # NPC extends Phaser.GameObjects.Rectangle
│   ├── terminal.entity.ts       # Terminal extends Phaser.GameObjects.Rectangle
│   └── game-config.entity.ts    # MapConfig type
├── models/
│   └── game-session.model.ts    # State models (Position, InventoryItem, etc.)
├── scenes/
│   └── game.scene.ts            # GameScene extends Phaser.Scene
├── store/
│   ├── game-session.events.ts   # NgRx signal events
│   └── index.ts                 # GameSessionStore
└── ui/
    └── dialog-box.ts            # In-game UI overlay
```

### Angular-Phaser Bridge

Angular services are passed into scenes via a config object in the constructor — never accessed through Angular DI inside Phaser code:

```typescript
// GameScene constructor receives services
constructor(config: GameSceneConfig = {}) {
  super({ key: 'GameScene' });
  this.terminalService = config.terminalService;
  this.dialogService = config.dialogService;
  this.dispatcher = config.dispatcher;
}
```

### State Sync Pattern

The `GameScene.update()` synchronizes Phaser state to the NgRx store via `Dispatcher`:

```typescript
// Only dispatch when value actually changed
if (this.lastPlayerPosition?.x !== currentX || this.lastPlayerPosition?.y !== currentY) {
  this.dispatcher.dispatch(this.gameEvents.playerMoved({ x: currentX, y: currentY }));
  this.lastPlayerPosition = { x: currentX, y: currentY };
}
```

---

## SCENE BEST PRACTICES

Reference: https://docs.phaser.io/phaser/concepts/scenes

### Lifecycle

The four callbacks execute in order: `init(data)` → `preload()` → `create(data)` → `update(time, delta)`

```typescript
export class MyScene extends Phaser.Scene {
  // Use definite assignment for properties set in create()
  private player!: Player;
  private walls!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'MyScene' });
  }

  // init() — reset state here, NOT in constructor (called on every scene restart)
  init(data?: { level: number }): void {
    this.score = 0;
    this.level = data?.level ?? 1;
  }

  // preload() — queue assets (NOT available until create())
  preload(): void {
    this.load.tilemapTiledJSON('map', 'assets/maps/level.json');
    this.load.image('tileset', 'assets/tilesets/tileset.png');
  }

  // create() — instantiate game objects using loaded assets
  create(): void {
    this.createMap();
    this.createPlayer();
    this.setupCollisions();
    this.setupCamera();
  }

  // update() — keep as LIGHT as possible, delegate to entities
  override update(time: number, delta: number): void {
    this.player.update();
  }
}
```

### Scene Transitions

| Method | Effect | Use Case |
|--------|--------|----------|
| `this.scene.start('key', data)` | Stop current, start target (full reset) | Level transitions, menu → game |
| `this.scene.launch('key', data)` | Start target alongside current | HUD overlay, pause menu |
| `this.scene.switch('key')` | Sleep current, wake/start target | Tabbed scenes |
| `this.scene.sleep('key')` / `wake('key')` | Preserve state | Temporary overlays |
| `this.scene.pause()` / `resume()` | Stop update() but keep rendering | Dialog modal, pause |

### Mandatory Cleanup

Always clean up on shutdown to prevent memory leaks and stale references:

```typescript
create(): void {
  // ... setup code ...

  this.events.once('shutdown', () => {
    this.npcs.length = 0;
    this.movementTween?.destroy();
    // Remove custom event listeners
  });
}
```

---

## GAME OBJECTS

Reference: https://docs.phaser.io/api-documentation/api-documentation → GameObjects

### Hierarchy — Choose the Right Base Class

| Class | Use When | Notes |
|-------|----------|-------|
| `Phaser.GameObjects.Image` | Static visuals (no animation) | Lighter than Sprite |
| `Phaser.GameObjects.Sprite` | Animated objects | Has AnimationState |
| `Phaser.GameObjects.Rectangle` | Prototyping / colored shapes | Current project pattern |
| `Phaser.GameObjects.Container` | Grouping related objects | Do NOT put TilemapLayers in containers |
| `Phaser.GameObjects.Group` | Managing collections of same type | Supports object pooling |
| `Phaser.GameObjects.Zone` | Invisible trigger areas | No rendering cost |
| `Phaser.GameObjects.Text` | Dynamic text | Heavier than BitmapText |
| `Phaser.GameObjects.BitmapText` | Performance-critical text | Use for HUD counters |

### Custom Entity Pattern (Project Convention)

Entities extend a Phaser base class, register themselves in the scene, and manage their own physics:

```typescript
interface EntityConfig {
  speed?: number;
  size?: number;
}

export class MyEntity extends Phaser.GameObjects.Rectangle {
  private readonly speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, config: EntityConfig = {}) {
    const size = config.size ?? 32;
    super(scene, x, y, size, size, 0x00ff00);

    this.speed = config.speed ?? 150;

    // Self-register in scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Setup physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(size, size);
    body.setCollideWorldBounds(true);
  }

  // Entity manages its own update logic
  update(): void {
    // Movement, animation, state logic
  }

  // Override destroy for cleanup
  override destroy(fromScene?: boolean): void {
    // Clean up tweens, timers, particles, child objects
    super.destroy(fromScene);
  }
}
```

### When Migrating to Sprites (future)

When replacing Rectangle placeholders with real sprites:

```typescript
// Before: extends Rectangle
export class Player extends Phaser.GameObjects.Rectangle { ... }

// After: extends Phaser.Physics.Arcade.Sprite
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-atlas', 'idle-down-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
```

### Object Pooling (for many similar objects)

```typescript
const bulletPool = this.add.group({
  classType: Phaser.GameObjects.Image,
  maxSize: 50,
  active: false,
  visible: false,
});

// Spawn
const bullet = bulletPool.get(x, y, 'bullet') as Phaser.GameObjects.Image;
if (bullet) {
  bullet.setActive(true).setVisible(true);
  this.physics.add.existing(bullet);
}

// Despawn
bulletPool.killAndHide(bullet);
(bullet.body as Phaser.Physics.Arcade.Body).stop();
```

---

## ARCADE PHYSICS

Reference: https://docs.phaser.io/phaser/concepts/physics/arcade

### Setup

```typescript
const config: Phaser.Types.Core.GameConfig = {
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // Top-down RPG: no gravity
      debug: false,             // Set true during development
    },
  },
};
```

### Bodies

```typescript
// Dynamic body (moves, responds to velocity/forces)
scene.physics.add.existing(gameObject);

// Static body (immovable, for walls/platforms)
scene.physics.add.existing(gameObject, true);

// Key body methods
const body = gameObject.body as Phaser.Physics.Arcade.Body;
body.setSize(width, height);           // Collision box size
body.setOffset(x, y);                  // Collision box offset from origin
body.setVelocity(vx, vy);             // Direct speed
body.setMaxVelocity(maxVx, maxVy);    // Speed cap
body.setDrag(dx, dy);                  // Deceleration per second
body.setBounce(bx, by);               // Rebound (0-1)
body.setCollideWorldBounds(true);      // Stay within world
body.setImmovable(true);              // Not pushed by collisions
```

### Collisions & Overlaps

```typescript
// Collision (with physical separation)
this.physics.add.collider(player, walls);
this.physics.add.collider(player, enemies, this.onPlayerHit, undefined, this);

// Overlap (detection only, no separation)
this.physics.add.overlap(player, items, this.onItemCollect, undefined, this);

// Callback signature
private onPlayerHit(
  player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
): void {
  // Handle collision
}
```

### World Bounds

```typescript
// Set world size (typically from tilemap)
this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
```

### Movement Helpers

```typescript
// Move toward a point
this.physics.moveTo(sprite, targetX, targetY, speed);

// Move toward another object
this.physics.moveToObject(sprite, target, speed);

// Accelerate toward a point
this.physics.accelerateTo(sprite, targetX, targetY, acceleration);
```

---

## TILEMAPS

Reference: https://docs.phaser.io/api-documentation/api-documentation → Tilemaps

### Loading & Creating

```typescript
preload(): void {
  this.load.tilemapTiledJSON('map', 'assets/maps/level.json');
  this.load.image('tileset-key', 'assets/tilesets/tileset.png');
}

create(): void {
  const map = this.make.tilemap({ key: 'map' });

  // addTilesetImage(name-in-Tiled, loader-key)
  const tileset = map.addTilesetImage('TilesetName', 'tileset-key');
  if (!tileset) {
    console.error('Failed to load tileset');
    return;
  }

  // Create layers (names must match Tiled layer names)
  const groundLayer = map.createLayer('Ground', tileset);
  const wallsLayer = map.createLayer('Walls', tileset);
}
```

### Collision Setup

```typescript
// By tile property (set in Tiled editor)
wallsLayer!.setCollisionByProperty({ collides: true });

// By tile index range
wallsLayer!.setCollisionBetween(firstIndex, lastIndex);

// By specific indices
wallsLayer!.setCollision([65, 66, 67, 68]);

// Add collider with player
this.physics.add.collider(this.player, wallsLayer!);
```

### Object Layers (spawn points, triggers)

```typescript
const objectLayer = map.getObjectLayer('SpawnPoints');
objectLayer?.objects.forEach(obj => {
  if (obj.name === 'PlayerSpawn') {
    this.player = new Player(this, obj.x!, obj.y!);
  }
});
```

### Important Rules

- **NEVER add TilemapLayers to Containers** — they are standalone display objects
- Phaser automatically culls tiles outside the camera viewport
- Use `map.widthInPixels` / `map.heightInPixels` for world bounds

---

## CAMERA

Reference: https://docs.phaser.io/phaser/concepts/cameras

### Setup for RPG

```typescript
private setupCamera(): void {
  const camera = this.cameras.main;

  // Follow player with smooth lerp
  camera.startFollow(this.player, true, 0.1, 0.1);

  // Zoom for pixel art
  camera.setZoom(1.5);

  // Constrain to map bounds
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // Pixel-perfect rendering (for pixel art games)
  camera.setRoundPixels(true);

  // Optional: deadzone (player moves freely within this area)
  camera.setDeadzone(100, 100);
}
```

### Camera Effects

```typescript
// Screen shake (damage, impact)
this.cameras.main.shake(200, 0.01);

// Fade transition
this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
  if (progress === 1) {
    this.scene.start('NextScene');
  }
});

// Flash (item pickup, level up)
this.cameras.main.flash(300, 255, 255, 255);

// Pan to a position
this.cameras.main.pan(targetX, targetY, 1000, 'Power2');

// Zoom effect
this.cameras.main.zoomTo(2, 500);
```

---

## ANIMATIONS

Reference: https://docs.phaser.io/phaser/concepts/animations

### Creating Animations (global, reusable)

```typescript
// From sprite sheet (uniform grid)
this.anims.create({
  key: 'player-walk-down',
  frames: this.anims.generateFrameNumbers('player-sheet', { start: 0, end: 3 }),
  frameRate: 8,
  repeat: -1,
});

// From texture atlas (named frames)
this.anims.create({
  key: 'player-idle',
  frames: this.anims.generateFrameNames('player-atlas', {
    prefix: 'idle-',
    start: 0,
    end: 3,
    zeroPad: 2,
  }),
  frameRate: 6,
  repeat: -1,
});
```

### Playing Animations

```typescript
// Play (ignoreIfPlaying to avoid restart)
this.player.play('player-walk-down', true);

// Chain next animation (plays after current completes)
this.player.anims.chain('player-idle');

// Play after delay
this.player.playAfterDelay('player-attack', 200);

// Animation mixing (smooth transition delay)
this.anims.addMix('player-walk', 'player-idle', 100);
```

### Animation Events

```typescript
this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'attack', () => {
  this.player.play('player-idle');
});
```

---

## EVENTS SYSTEM

Reference: https://docs.phaser.io/phaser/concepts/events

### Event Emitters Access Points

| Scope | Access |
|-------|--------|
| Scene events | `this.events` |
| Game object events | Directly on the object (extends EventEmitter) |
| Global game events | `this.game.events` |
| Input events | `this.input.on(...)` / `this.input.keyboard?.on(...)` |

### Best Practices

```typescript
// GOOD — listen with context for proper cleanup
this.events.on('player-scored', this.onPlayerScored, this);

// GOOD — one-time listener
this.events.once('shutdown', this.cleanup, this);

// GOOD — remove with all 3 params (name, callback, context)
this.events.off('player-scored', this.onPlayerScored, this);

// BAD — removes ALL listeners for this event (dangerous)
this.events.off('player-scored');

// BAD — removes ALL listeners (nuclear option)
this.events.removeAllListeners();
```

### Custom Scene Communication

```typescript
// Scene A emits
this.events.emit('item-collected', { itemId: 'potion', quantity: 1 });

// Scene B (HUD overlay) listens
const gameScene = this.scene.get('GameScene');
gameScene.events.on('item-collected', (data: { itemId: string; quantity: number }) => {
  this.updateInventoryDisplay(data);
});
```

---

## TEXTURES & ASSETS

Reference: https://docs.phaser.io/phaser/concepts/textures

### Loading Strategies

```typescript
preload(): void {
  // Single image
  this.load.image('key', 'path/to/image.png');

  // Sprite sheet (uniform grid)
  this.load.spritesheet('player-sheet', 'path/to/sheet.png', {
    frameWidth: 32,
    frameHeight: 32,
    startFrame: 0,
    endFrame: 15,
  });

  // Texture atlas (irregular frames, Texture Packer format)
  this.load.atlas('player-atlas', 'path/to/atlas.png', 'path/to/atlas.json');

  // Tiled map
  this.load.tilemapTiledJSON('map', 'path/to/map.json');
}
```

### Temporary Textures (prototyping)

Current project pattern for placeholder graphics:

```typescript
private createTemporaryAssets(): void {
  const graphics = this.add.graphics();

  graphics.fillStyle(0x00ff00);
  graphics.fillRect(0, 0, 32, 32);
  graphics.generateTexture('player-temp', 32, 32);

  graphics.destroy(); // Clean up the graphics object
}
```

### Key Rules

- Use `Image` instead of `Sprite` for non-animated objects (cheaper to render)
- Max safe texture size: 2048px mobile, 4096px desktop
- Use `textures.exists(key)` before `textures.get(key)` (returns `__MISSING` if absent)
- Prefer texture atlases over individual images (fewer draw calls, better GPU batching)

---

## TWEENS & TIME

### Tweens

```typescript
// Basic tween
this.tweens.add({
  targets: gameObject,
  x: targetX,
  y: targetY,
  alpha: { from: 1, to: 0.5 },
  scale: { from: 1, to: 1.2 },
  duration: 1000,
  ease: 'Sine.easeInOut',
  yoyo: true,
  repeat: -1,
  onComplete: () => { /* ... */ },
});

// Tween chain (sequential)
this.tweens.chain({
  targets: gameObject,
  tweens: [
    { x: 100, duration: 500 },
    { y: 200, duration: 500 },
    { alpha: 0, duration: 300 },
  ],
});
```

### Timers

```typescript
// Delayed call
this.time.delayedCall(2000, () => {
  this.spawnEnemy();
});

// Repeating timer
this.time.addEvent({
  delay: 1000,
  callback: this.tick,
  callbackScope: this,
  repeat: 10,   // -1 for infinite
});
```

---

## INPUT

### Keyboard (project uses AZERTY + QWERTY support)

```typescript
// Add specific keys
this.keys = this.input.keyboard!.addKeys({
  Z: 'Z', Q: 'Q', S: 'S', D: 'D',    // AZERTY
  W: 'W', A: 'A',                       // QWERTY alternatives
  E: 'E',                               // Interaction
  SHIFT: 'SHIFT',                        // Run
}) as Record<string, Phaser.Input.Keyboard.Key>;

// Check in update()
if (this.keys['Z']?.isDown || this.keys['W']?.isDown) {
  body.setVelocityY(-speed);
}

// Key event listener
this.input.keyboard?.on('keydown-E', () => {
  this.interact();
});
```

### Cursor Keys (alternative)

```typescript
const cursors = this.input.keyboard!.createCursorKeys();
if (cursors.up.isDown) { /* ... */ }
```

---

## PERFORMANCE RULES

1. **Keep `update()` light** — delegate logic to entity `update()` methods
2. **Use `Image` over `Sprite`** for non-animated objects
3. **Object pooling** via `Group` for frequently created/destroyed objects (bullets, particles)
4. **Cache references** — don't access `this.physics.world.bodies` repeatedly in update loops
5. **Only dispatch state changes when values actually changed** (diff check before dispatch)
6. **Use `BitmapText`** instead of `Text` for HUD elements updated frequently
7. **Avoid allocations in `update()`** — pre-create objects, reuse vectors
8. **TilemapLayers auto-cull** — Phaser only renders visible tiles, no manual culling needed

---

## COMMON ANTI-PATTERNS TO AVOID

| Anti-Pattern | Correct Approach |
|---|---|
| Initialize state in constructor | Use `init()` (called on every restart) |
| `removeAllListeners()` | Use `off(name, callback, context)` with all 3 params |
| Angular `inject()` in Phaser classes | Pass services via constructor config |
| `Sprite` for static objects | Use `Image` (lighter) |
| Add TilemapLayer to Container | Leave as standalone display object |
| Bare `ng build` | Always `ng build main-app` (monorepo) |
| Massive `if/else` in update() | State machine pattern or delegate to entities |
| Create objects every frame | Object pooling with `Group` |
| Hardcoded asset keys as strings | Use constants or enums |

---

## WORKFLOW

### Step 1: Determine what to create

Ask if not clear:
- **Scene**: New game scene (level, menu, etc.)
- **Entity**: New game object (enemy, item, obstacle, etc.)
- **Feature**: New game mechanic (combat, inventory UI, etc.)

### Step 2: Create the code

- Place files in the correct directory under `features/game/`
- Follow the entity pattern (extend Phaser base class, self-register, manage own physics)
- Use config interfaces for configurable properties

### Step 3: Wire into existing scene

- Import and instantiate in `GameScene.create()`
- Add colliders/overlaps in `setupCollisions()`
- Call entity `update()` from scene `update()`

### Step 4: Build verification

```bash
ng build main-app
```

Fix all errors AND warnings before proceeding.

### Step 5: Commit

```bash
git add <modified-files>
git commit -m "<type>(game): <description>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
