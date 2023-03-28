import GamePlay from "../../scenes/GamePlay";
import Enemy from "./Enemy";

export default class EnemyPlatform extends Enemy {

  private _vel: number = 50;
  constructor(params: genericConfig) {
    super(params);
    this.setName("robot")
    this.create();
  }
  create() {


    this._body
      .setCollideWorldBounds(true, 0.5)
      .setImmovable(true)
      .setGravity(0, 1200)
      .setMaxVelocity(250, 550);

    this._body.setVelocityX(50);

    let _animation = {
      key: "move",
      frames: this.anims.generateFrameNumbers(this._config.key, {
        frames: [4, 5, 6, 7]
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1
    };
    this.setFlipX(true);
    this.anims.create(_animation);
    this.play("move");

  }


  changeDirection(): void {

    if (this._vel == 50) {
      this._vel = -50;
      this.setFlipX(false);
    } else {
      this._vel = 50;
      this.setFlipX(true);
    }
    this._body.setVelocityX(this._vel);
  }


  update(time: number, delta: number) { }
}
