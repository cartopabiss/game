export default class Win extends Phaser.Scene {

  private _logo: Phaser.GameObjects.Image;
  private _Win: Phaser.GameObjects.BitmapText;
  private _intro: Phaser.GameObjects.BitmapText;
  private _restart: Phaser.GameObjects.BitmapText;
  private punti: Phaser.GameObjects.BitmapText;
  private bg: Phaser.GameObjects.Image;
  

  constructor() {
    super({
      key: "Win",
    });
  }

  create() {

    
    localStorage.removeItem("score");
    localStorage.removeItem("lives");
    localStorage.removeItem("bestLevel");
    this.cameras.main.setBackgroundColor("#000000");
    let particles = this.add.particles('flares');

   
    particles.createEmitter({
      frame: 'blue',
      y: 0,
      x: { min: 0, max: 1024 },
      lifespan: 10000,
      speedY: { min: 100, max: 300 },
      scale: { start: 0.1, end: 0.1 },
      quantity: 1,
    });

    this._Win = this.add
      .bitmapText(this.game.canvas.width / 2, 65, "arcade", "complimenti hai completato il gioco", 25)
      .setAlpha(1)
      .setOrigin(0)
      .setDepth(1001)
      .setOrigin(0.5).setTint(0xffffff).setPosition(this.game.canvas.width / 2, 370);

      this._logo = this.add.image(this.game.canvas.width / 2, 50, "logof").setAlpha(0).setScale(.5).setDepth(-1);
      this.add.tween({
        targets: this._logo, y: 205, alpha: 1, duration:1000, ease: "quad.easeInOut",
        onComplete: () => {
          this.add.tween({
            targets: this._logo, 
            y: 195, repeat: -1, 
            yoyo: true, 
            duration: 1000, 
            ease: "quad.easeInOut",
          });
        }
      });

      

      this.bg = this.add.image(140, -140, "bg-black").setAlpha(0).setScale(1).setDepth(10);
    this._intro = this.add
      .bitmapText(this.game.canvas.width / 2 , 550, "arcade", "Torna al menu iniziale", 30)
      .setAlpha(1)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100)
      .setTint(0xff8200)

      .on("pointerup", () => {
        this._intro.removeInteractive();
      
        this.intro();
      })
      .on("pointerover", () => {
        this._intro.setTint(0xff0000);
      })
      .on("pointerout", () => {
        this._intro.setTint(0xff8200);
      });



  }

  intro() {

    this.scene.stop("GameOver");
    this.scene.start("Intro");



  }





}
