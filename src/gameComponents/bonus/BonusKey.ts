import GamePlay from "../../scenes/GamePlay";
import Bonus from "./Bonus";

export default class BonusKey extends Bonus {


  constructor(params: genericConfig) {
    super(params);
    this.setName("key")
    this.create();
  }
  create() {

    let _animationConfig = {
      key: "bonus-key-anim",
      frames: this._config.scene.anims.generateFrameNumbers(this._config.key, {
        frames: [0, 1],
      }),
      frameRate: 4,
      yoyo: false,
      repeat: -1,
    };

    this._config.scene.anims.create(_animationConfig);
    this.play("bonus-key-anim")

  }

  getBonus() {
    super.getBonus();

  }
  update(time: number, delta: number) { }
}
