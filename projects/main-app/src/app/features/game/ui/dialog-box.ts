import Phaser from 'phaser';

/**
 * DialogBox - Final Fantasy 6/7 style dialog box rendered in Phaser canvas
 */
export class DialogBox extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private avatar: Phaser.GameObjects.Rectangle;
  private npcNameText: Phaser.GameObjects.Text;
  private messageText: Phaser.GameObjects.Text;
  private closeHint: Phaser.GameObjects.Text;
  private currentNpcColor: number;

  // Dynamic dimensions based on scene
  private readonly boxWidth: number;
  private readonly boxHeight: number;
  private readonly padding: number = 20;

  constructor(scene: Phaser.Scene) {
    // Get scene dimensions
    const sceneWidth = scene.scale.width;
    const sceneHeight = scene.scale.height;

    // Calculate box dimensions (90% of scene width, max 800px)
    const maxWidth = Math.min(sceneWidth * 0.9, 800);
    const boxHeight = 140;

    // Center horizontally, positioned at bottom with margin
    const centerX = sceneWidth / 2;
    const posY = sceneHeight - boxHeight / 2 - 50; // 50px from bottom

    super(scene, centerX, posY);

    this.boxWidth = maxWidth;
    this.boxHeight = boxHeight;
    this.currentNpcColor = 0xff8c00; // Default orange

    // Background with border
    this.background = scene.add.graphics();
    this.drawBackground();

    // Avatar (dynamic color based on NPC)
    const avatarX = -this.boxWidth / 2 + this.padding + 32; // 32 = half avatar size
    this.avatar = scene.add.rectangle(avatarX, 0, 64, 64, this.currentNpcColor);

    // NPC name
    const textStartX = -this.boxWidth / 2 + this.padding + 80; // Avatar width + padding
    this.npcNameText = scene.add.text(textStartX, -this.boxHeight / 2 + this.padding, '', {
      fontFamily: 'Courier New',
      fontSize: '20px',
      color: '#ff8c00',
      fontStyle: 'bold'
    });

    // Message text (with dynamic word wrap based on box width)
    const messageWidth = this.boxWidth - 120 - this.padding * 2; // Minus avatar area and padding
    this.messageText = scene.add.text(textStartX, -this.boxHeight / 2 + this.padding + 30, '', {
      fontFamily: 'Courier New',
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: messageWidth },
      lineSpacing: 4
    });

    // Close hint (aligned to right)
    const hintX = this.boxWidth / 2 - this.padding - 80; // Aligned right with padding
    this.closeHint = scene.add.text(hintX, this.boxHeight / 2 - this.padding - 20, '[E] Fermer', {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: '#888888'
    });

    // Add all to container
    this.add([
      this.background,
      this.avatar,
      this.npcNameText,
      this.messageText,
      this.closeHint
    ]);

    this.setDepth(1000);
    this.setScrollFactor(0); // Fixed to screen, not affected by camera
    this.setVisible(false);

    scene.add.existing(this);
  }

  private drawBackground(): void {
    this.background.clear();
    this.background.fillStyle(0x1a1a2e, 0.95);
    this.background.lineStyle(3, this.currentNpcColor);
    // Draw centered box
    const x = -this.boxWidth / 2;
    const y = -this.boxHeight / 2;
    this.background.fillRoundedRect(x, y, this.boxWidth, this.boxHeight, 8);
    this.background.strokeRoundedRect(x, y, this.boxWidth, this.boxHeight, 8);
  }

  /**
   * Show dialog with NPC information
   */
  show(npcName: string, message: string, npcColor: number = 0xff8c00): void {
    this.currentNpcColor = npcColor;
    this.npcNameText.setText(npcName);
    const colorHex = npcColor.toString(16);
    const paddedColor = ('000000' + colorHex).slice(-6);
    this.npcNameText.setColor(`#${paddedColor}`);
    this.messageText.setText(message);
    this.avatar.setFillStyle(npcColor);
    this.drawBackground();

    this.setVisible(true);

    // Calculate positions for animation (stays at bottom with margin)
    const sceneHeight = this.scene.scale.height;
    const visibleY = sceneHeight - this.boxHeight / 2 - 50;
    const hiddenY = sceneHeight + this.boxHeight / 2 + 10;

    // Slide up animation from below
    this.y = hiddenY;
    this.scene.tweens.add({
      targets: this,
      y: visibleY,
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  /**
   * Hide dialog with animation
   */
  hide(): void {
    const sceneHeight = this.scene.scale.height;
    const hiddenY = sceneHeight + this.boxHeight / 2 + 10;

    this.scene.tweens.add({
      targets: this,
      y: hiddenY,
      duration: 200,
      ease: 'Power2.easeIn',
      onComplete: () => this.setVisible(false)
    });
  }
}
