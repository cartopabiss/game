import GamePlay from "../../scenes/GamePlay";
import IBonus from "./IBonus";

export default class Bonus extends Phaser.GameObjects.Sprite implements IBonus {
  protected _config: genericConfig;
  protected _scene: GamePlay;
  protected _body: Phaser.Physics.Arcade.Body;
  protected _isActive: boolean = false;

  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <GamePlay>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;
    this._scene.addBonus(this);
    this._scene.add.existing(this);
    this._body
      .setGravity(0, 1200)
      .setVelocityY(
        Phaser.Math.RND.integerInRange(-500, -600)
      ).setBounce(.3, .3).setImmovable(true);

    //attivo il bonus per essere collezionato dal player dopo 1 secondo
    this._scene.time.addEvent({
      delay: 1000, callback: () => {
        this._isActive = true;
      }
    });

  }
  create() { }
  update(time: number, delta: number) { }
  getBody(): Phaser.Physics.Arcade.Body { return this._body; }
  isActive() {
    return this._isActive;
  }
  getBonus() {

    this._scene.removeBonus(this);

  }
}
