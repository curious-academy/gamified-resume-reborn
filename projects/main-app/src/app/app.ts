import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Phaser, { Scene } from 'phaser';
import { Button } from 'shared-ui';

class Player extends Phaser.GameObjects.Rectangle {
  constructor(scene: Scene, x: number, y:number) {
    super(scene, x, y, 32, 32, 0x00ff00);
    this.setOrigin(0.5);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    //this.body.collideWorldBounds = true;
    this.setScale(1);
    // this.jumping = false;
    // this.invincible = false;
    // this.health = 10;
    if(this.body) {
      this.body.mass = 10;
    //this.body.setDragY = 10;
    }
  }
}
export default Player;



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('main-app');

  ngOnInit(): void {
    var config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      scene: {
          preload: function(this: Phaser.Scene) {
            this.load.image('sky', 'assets/sky.jpg');
          },
          create: function(this: Phaser.Scene) {
              this.add.image(400, 300, 'sky');
          },
          update: function(this: Phaser.Scene) {

          }
      }
   };
    var game = new Phaser.Game(config);

  }
}
