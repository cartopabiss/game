
export default class Boot extends Phaser.Scene {

  private iNutile: boolean;
  private _image: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "Boot",
    });
  }

  preload() {

    var graphics = this.make.graphics({ x: 0, y: 0, add: false });

    graphics.fillStyle(0x000000, .9);
    graphics.fillRect(0, 0, 1024, 600);
    graphics.generateTexture("bg-black", 1024, 600);

    this.load.image("logo", "assets/images/ziopera.png",);
    this.load.bitmapFont(
      "arcade",
      "assets/fonts/arcade.png",
      "assets/fonts/arcade.xml"
    );
  }
    

  init() { }

  create() {

    this.scene.start("Preloader");

  }


}
