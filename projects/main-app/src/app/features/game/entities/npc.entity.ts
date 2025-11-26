import Phaser from 'phaser';

/**
 * NPC Entity - Non-Player Character with autonomous movement
 */
export class Npc extends Phaser.GameObjects.Rectangle {
  readonly id: string;
  readonly npcName: string;
  readonly color: number;

  private waypoints: { x: number; y: number }[] = [];
  private currentWaypointIndex = 0;
  private movementTween?: Phaser.Tweens.Tween;
  private isPaused = false;
  private isMoving = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    name: string,
    color: number
  ) {
    super(scene, x, y, 32, 32, color);

    this.id = id;
    this.npcName = name;
    this.color = color;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1); // Bottom-center anchor (FF6 style)

    this.generateRandomPath();
    this.startMovement();
  }

  /**
   * Generate random waypoints for NPC movement
   */
  private generateRandomPath(): void {
    const count = Phaser.Math.Between(4, 6);
    this.waypoints = Array.from({ length: count }, () => ({
      x: Phaser.Math.Between(64, 736),
      y: Phaser.Math.Between(64, 576)
    }));
  }

  /**
   * Start autonomous movement along waypoints
   */
  private startMovement(): void {
    if (this.waypoints.length === 0) return;
    this.moveToNextWaypoint();
  }

  /**
   * Move to next waypoint in sequence
   */
  private moveToNextWaypoint(): void {
    if (this.isPaused) return;

    const waypoint = this.waypoints[this.currentWaypointIndex];
    this.isMoving = true;

    this.movementTween = this.scene.tweens.add({
      targets: this,
      x: waypoint.x,
      y: waypoint.y,
      duration: 2000,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false;
        this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.waypoints.length;

        // Random pause at waypoint
        this.scene.time.delayedCall(
          Phaser.Math.Between(1000, 3000),
          () => {
            if (!this.isPaused) {
              this.moveToNextWaypoint();
            }
          }
        );
      }
    });
  }

  /**
   * Check if player is near this NPC
   */
  checkPlayerProximity(playerX: number, playerY: number): boolean {
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      playerX, playerY
    );

    const shouldPause = distance <= 60;

    if (shouldPause && !this.isPaused) {
      this.pauseMovement();
    }

    return shouldPause;
  }

  /**
   * Pause NPC movement (when talking to player)
   */
  pauseMovement(): void {
    this.isPaused = true;
    if (this.movementTween && this.movementTween.isPlaying()) {
      this.movementTween.pause();
    }
  }

  /**
   * Resume NPC movement
   */
  resumeMovement(): void {
    this.isPaused = false;
    if (this.movementTween && this.movementTween.isPaused()) {
      this.movementTween.resume();
    } else if (!this.isMoving) {
      this.moveToNextWaypoint();
    }
  }
}
