import GamePlay from "../../scenes/GamePlay";
import IEnemy from "./IEnemy";

export default class Enemy extends Phaser.GameObjects.Sprite implements IEnemy {
  protected _config: genericConfig;
  protected _scene: GamePlay;
  protected _body: Phaser.Physics.Arcade.Body;

  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <GamePlay>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;
    this._scene.addEnemy(this);
    this._scene.add.existing(this);

  }
  create() { }
  update(time: number, delta: number) { }
  changeDirection(): void { }
  getBody(): Phaser.Physics.Arcade.Body { return this._body; }
}
