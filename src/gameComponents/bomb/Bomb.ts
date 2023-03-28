import GamePlay from "../../scenes/GamePlay";
import IBomb from "./IBomb";

export default class Bomb extends Phaser.GameObjects.Sprite implements IBomb {
  protected _config: genericConfig;
  protected _scene: GamePlay;
  private _body: Phaser.Physics.Arcade.Body;
  private _runAnimation: Array<number>=[0, 1, 2, 3, 4, 5];

  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <GamePlay>params.scene;
     this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;
    this.create();
  }

  create() {

console.log("create bomb")
    let _animation = {
    key: "rotate",
    frames: this.anims.generateFrameNumbers("bomb", {
    frames: this._runAnimation
    }),
    frameRate: 10,
    yoyo: false,
    repeat: -1
    };
   
    this.setScale(4)
    this._body.setCircle(14, 3, 2).setVelocity(Phaser.Math.RND.integerInRange(80,100), Phaser.Math.RND.integerInRange(180,200)).setCollideWorldBounds(true).setBounceX(Phaser.Math.RND.integerInRange(0.5,0.9)).setBounceY(Phaser.Math.RND.integerInRange(0.5,0.9))
    this.anims.create(_animation);
    this.play("rotate");
    this._scene.add.existing(this);


  }

  update(time: number, delta: number) {}

  removeItem() {}
}
