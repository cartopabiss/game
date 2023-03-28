export default class Intro extends Phaser.Scene {

  private _logo: Phaser.GameObjects.Image;
  private _play: Phaser.GameObjects.BitmapText;
  //variabile per il tasto "come giocare"
  private _howToPlay: Phaser.GameObjects.BitmapText;
  //variabile per il container dei credits
  private _howToPlayContainer: Phaser.GameObjects.Container;
  //variabile per il tasto "crediti"
  private _credits: Phaser.GameObjects.BitmapText;
  //variabile per il container dei credits
  private _creditsContainer: Phaser.GameObjects.Container;
  //variabile per gestire l'animazione dello sfondo

  constructor() {
    super({
      key: "Intro",
    });
  }
  create() {

    this.cameras.main.setBackgroundColor("#000000");
    //mostro il logo e lo inserisco nella scena di intro
    this._logo = this.add.image(this.game.canvas.width / 2, 50, "logof").setAlpha(0).setScale(.5).setDepth(-1);
    this.add.tween({
      targets: this._logo, y: 213, alpha: 1, duration:1000, ease: "quad.easeInOut",
      onComplete: () => {
        this.add.tween({
          targets: this._logo, 
          y: 207, repeat: -1, 
          yoyo: true, 
          duration: 1000, 
          ease: "quad.easeInOut",
        });
      }
    });

    //creo l'istanza del pulsante per il testo "come giocare" del gioco
    this._howToPlay = this.add
      .bitmapText(this.game.canvas.width / 2, 500, "arcade", "How to Play", 20)
      .setAlpha(0) //setto l'alpha a 0
      .setOrigin(0.5) //setto l'origin centrale
      .setInteractive() //abilito l'interazione 
      .setDepth(100) //setto la profondità
      .setTint(0xffffff) //setto il colore di partenza a bianco
      //sul "click" rimuovo la possibilità di interagire per evitare click multipli e richiamo il metodo howToPlay per visualizzare le info del gioco
      .on("pointerup", () => {
        //rimuovo interazione dal pulsante play
        this._howToPlay.removeInteractive();
        //richiamo il metodo per visualizzare il container delle info del gioco
        this.showHowToPlay();
        //setto il colore a bianco
        this._howToPlay.setTint(0xffffff);
      })
      //sul pointer over della scritta setto il colore a rosso
      .on("pointerover", () => {
        this._howToPlay.setTint(0xff8200);
      })
      // sul pointer out della scritta lo riporto a bianco
      .on("pointerout", () => {
        this._howToPlay.setTint(0xffffff);
      });

    //creo l'istanza del container e la posiziono a 0,0 con alpha a 0
    this._howToPlayContainer = this.add.container(0, 0).setAlpha(0).setDepth(1000);
    //creo un immagine per creare opacità 
    let _howToPlayBg = this.add.image(0, 0, "bg-black").setScale(6).setOrigin(0).setDepth(10).setAlpha(.5).setInteractive().on("pointerdown", () => {
      this.hideHowToPlay();
    });
    // creo un testo "come giocare" da visualizzare nel container
    let _howToPlayLabel = this.add.bitmapText(this.game.canvas.width / 2, 50, "arcade", "Come giocare").setOrigin(.5);
    // creo un testo descrittivo da visualizzare nel container
    let _howToPlayText = this.add.text(23, 80, "Lo scopo del gioco è quello di recuperare la clessidra per superare \nil livello. Per trovarla dovrai uccidere i nemici saltandoci sopra.").setOrigin(0).setFontSize(23);
    //aggiungo tutti i gameobj al container
    _howToPlayText.setY(this.game.canvas.width/2 - 165 );
    this._howToPlayContainer.add([_howToPlayBg, _howToPlayLabel, _howToPlayText]);

    //creo l'istanza del pulsante per il testo "crediti" del gioco
    this._credits = this.add
      .bitmapText(this.game.canvas.width / 2, 550, "arcade", "Credits", 20)
      .setAlpha(0) //setto l'alpha a 1
      .setOrigin(0.5) //setto l'origin centrale
      .setInteractive() //abilito l'interazione 
      .setDepth(100) //setto la profondità
      .setTint(0xffffff) //setto il colore di partenza a bianco
      //sul "click" rimuovo la possibilità di interagire per evitare click multipli e richiamo il metodo credits per visualizzare le info del gioco
      .on("pointerup", () => {
        //rimuovo interazione dal pulsante play
        this._credits.removeInteractive();
        //richiamo il metodo per visualizzare il container dei CREDITI
        this.showCredits();
        //setto il colore a bianco
        this._credits.setTint(0xffffff);
      })
      //sul pointer over della scritta setto il colore a rosso
      .on("pointerover", () => {
        this._credits.setTint(0xff8200);
      })
      // sul pointer out della scritta lo riporto a bianco
      .on("pointerout", () => {
        this._credits.setTint(0xffffff);
      });

    //creo l'istanza del container e la posiziono a 0,0 con alpha a 0
    this._creditsContainer = this.add.container(0, 0).setAlpha(0).setDepth(1000);
    //creo un immagine per creare opacità 
    let _creditBg = this.add.image(0, 0, "bg-black").setScale(6).setOrigin(0).setDepth(10).setAlpha(.6).setInteractive().on("pointerdown", () => {
      this.hideCredits();
    });
    // creo un testo "crediti" da visualizzare nel container
    let _creditsLabel = this.add.bitmapText(this.game.canvas.width / 2, 50, "arcade", "CREDITS").setOrigin(.5);
    // creo un testo descrittivo da visualizzare nel container
    let _creditsText = this.add.text(20, 110, "Back To The Past è stato realizzato dalla squadra Rossi-JAM dell' Istituto \nSuperiore Statale 'Manlio Rossi Doria' – Marigliano (NA)").setOrigin(0).setFontSize(20);
    _creditsText.setY(this.game.canvas.width/2 - 165 )
    //aggiungo tutti i gameobj al container
    this._creditsContainer.add([_creditBg, _creditsLabel, _creditsText]);

    this._play = this.add 
      .bitmapText(this.game.canvas.width / 2, 450, "arcade", "PLAY", 20)
      .setAlpha(0)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100)
      .setTint(0xffffff)
      .on("pointerup", () => {
        this._play.removeInteractive();
        this.startGame();
      })
      .on("pointerover", () => {
        this._play.setTint(0xff8200);
      })
      .on("pointerout", () => {
        this._play.setTint(0xffffff);
      });

    //applichiamo un tween ai 3 pulsanti (play crediti e come giocare)
    //il tween viene appilcato in maniera sequenziale dal primo elemento dell'array targets con un delay di 250 ms gestito dalla funzione this.tweens.stagger
    this.tweens.add({
      targets: [this._credits,   this._howToPlay,  this._play],
      y: "-=30",
      alpha: 1,
      duration: 2000,
      ease: 'Sine.easeInOut',
      delay: this.tweens.stagger(250, {})
    });

      
  }


  //metodo per visualizzare "come giocare"
  showHowToPlay() {
    //setto l'opacità del container a 1
    this._howToPlayContainer.setAlpha(1).setDepth(1);
  }

  //metodo per nascondere "come giocare"
  hideHowToPlay() {
    //setto l'opacità del container a 0
    this._howToPlayContainer.setAlpha(0);
    //riattivo l'interatttività del pulsante
    this._howToPlay.setInteractive();

  }


  //metodo per visualizzare i "crediti"
  showCredits() {
    //setto l'opacità del container a 1
    this._creditsContainer.setAlpha(1);

  }

  //metodo per nascondere i "crediti"
  hideCredits() {
    //setto l'opacità del container a 0
    this._creditsContainer.setAlpha(0);
    //riattivo l'interatttività del pulsante
    this._credits.setInteractive();

  }
  startGame() {

    this.scene.stop("Intro");
    this.scene.start("GamePlay");
    this.scene.start("Hud");
    this.scene.bringToTop("Hud");

  }

  update(time: number, delta: number): void { }

}



