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

  constructor(scene: Phaser.Scene) {
    super(scene, 400, 520); // Centered at bottom

    this.currentNpcColor = 0xff8c00; // Default orange

    // Background with border
    this.background = scene.add.graphics();
    this.drawBackground();

    // Avatar (dynamic color based on NPC)
    this.avatar = scene.add.rectangle(-340, -40, 64, 64, this.currentNpcColor);

    // NPC name
    this.npcNameText = scene.add.text(-260, -80, '', {
      fontFamily: 'Courier New',
      fontSize: '20px',
      color: '#ff8c00',
      fontStyle: 'bold'
    });

    // Message text
    this.messageText = scene.add.text(-260, -50, '', {
      fontFamily: 'Courier New',
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: 630 },
      lineSpacing: 4
    });

    // Close hint
    this.closeHint = scene.add.text(300, 70, '[E] Fermer', {
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
    this.background.fillRoundedRect(-380, -100, 760, 140, 8);
    this.background.strokeRoundedRect(-380, -100, 760, 140, 8);
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

    // Slide up animation
    this.y = 650;
    this.scene.tweens.add({
      targets: this,
      y: 520,
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  /**
   * Hide dialog with animation
   */
  hide(): void {
    this.scene.tweens.add({
      targets: this,
      y: 650,
      duration: 200,
      ease: 'Power2.easeIn',
      onComplete: () => this.setVisible(false)
    });
  }
}
