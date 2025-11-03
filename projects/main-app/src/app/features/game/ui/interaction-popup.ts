import Phaser from 'phaser';

/**
 * Configuration for the interaction popup
 */
interface PopupConfig {
  message?: string;
  acceptKey?: string;
  declineKey?: string;
}

/**
 * Interaction popup UI that displays above interactive objects
 */
export class InteractionPopup {
  private scene: Phaser.Scene;
  private container?: Phaser.GameObjects.Container;
  private background?: Phaser.GameObjects.Rectangle;
  private messageText?: Phaser.GameObjects.Text;
  private instructionText?: Phaser.GameObjects.Text;
  private visible: boolean = false;
  
  private readonly acceptKey: string;
  private readonly declineKey: string;
  
  constructor(scene: Phaser.Scene, config: PopupConfig = {}) {
    this.scene = scene;
    this.acceptKey = config.acceptKey ?? 'E';
    this.declineKey = config.declineKey ?? 'ESC';
    
    this.createPopup(config.message ?? 'Press E to interact');
  }
  
  /**
   * Creates the popup UI elements
   */
  private createPopup(message: string): void {
    // Create container for all popup elements
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(1000); // Ensure it's on top
    this.container.setScrollFactor(0); // Fix to camera, don't scroll with world
    
    // Background
    this.background = this.scene.add.rectangle(0, 0, 300, 80, 0x000000, 0.85);
    this.background.setStrokeStyle(2, 0xFFFFFF, 1);
    
    // Main message
    this.messageText = this.scene.add.text(0, -15, message, {
      fontSize: '16px',
      color: '#FFFFFF',
      align: 'center',
      fontFamily: 'Arial'
    });
    this.messageText.setOrigin(0.5);
    
    // Instructions
    const instructionMsg = `[${this.acceptKey}] Open | [${this.declineKey}] Cancel`;
    this.instructionText = this.scene.add.text(0, 15, instructionMsg, {
      fontSize: '12px',
      color: '#AAAAAA',
      align: 'center',
      fontFamily: 'Arial'
    });
    this.instructionText.setOrigin(0.5);
    
    // Add all to container
    this.container.add([this.background, this.messageText, this.instructionText]);
    
    // Hide by default
    this.container.setVisible(false);
  }
  
  /**
   * Shows the popup at specified world position (converts to screen position)
   */
  show(worldX: number, worldY: number): void {
    if (!this.container) return;
    
    // Convert world coordinates to camera/screen coordinates
    const camera = this.scene.cameras.main;
    const screenX = (worldX - camera.scrollX) * camera.zoom;
    const screenY = (worldY - camera.scrollY) * camera.zoom - 60; // Show above the object
    
    this.container.setPosition(screenX, screenY);
    this.container.setVisible(true);
    this.visible = true;
    
    // Add bounce-in animation
    this.container.setScale(0);
    this.scene.tweens.add({
      targets: this.container,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }
  
  /**
   * Hides the popup
   */
  hide(): void {
    if (!this.container || !this.visible) return;
    
    this.scene.tweens.add({
      targets: this.container,
      scale: 0,
      duration: 150,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.container?.setVisible(false);
        this.visible = false;
      }
    });
  }
  
  /**
   * Updates the popup message
   */
  setMessage(message: string): void {
    if (this.messageText) {
      this.messageText.setText(message);
    }
  }
  
  /**
   * Checks if popup is currently visible
   */
  isVisible(): boolean {
    return this.visible;
  }
  
  /**
   * Cleanup when destroying the popup
   */
  destroy(): void {
    if (this.container) {
      this.scene.tweens.killTweensOf(this.container);
      this.container.destroy();
    }
  }
}
