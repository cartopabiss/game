import GamePlay from "../../scenes/GamePlay";
import IMissile from "./IMissile";

export default class Missile extends Phaser.GameObjects.Sprite implements IMissile {
  protected _config: missileConfig;
  protected _scene: GamePlay;
  private _body: Phaser.Physics.Arcade.Body;
  private _runAnimation: Array<number> = [0, 1, 2, 3, 4, 5];

  constructor(params: missileConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <GamePlay>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;
    this.create();
  }

  create() {

    let _animation = {
      key: "rotate",
      frames: this.anims.generateFrameNumbers("bomb", {
        frames: this._runAnimation
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1
    };

    this.setScale(1)
    this._body.setCircle(14, 3, 2);
    this.anims.create(_animation);
    this.play("rotate").setAlpha(0).setScale(0.5).setDepth(10);
    this._scene.tweens.add({ targets: this, alpha: 1, scale: 1, duration: 200 });
    this._scene.addMissile(this);
    this._scene.add.existing(this);
    this._body.allowGravity = false;

    if (this._config.direction == "left") { this._body.setVelocityX(-400) }
    else if (this._config.direction == "right") { this._body.setVelocityX(400) }
    else if (this._config.direction == "none") { this._body.setVelocityY(-400) }


  }

  update(time: number, delta: number) {

    if (this.y < 0) { this._scene.removeMissile(this); }
  }

  removeItem() { }
}
