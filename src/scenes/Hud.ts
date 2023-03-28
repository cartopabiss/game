import GamePlay from "./GamePlay";

export default class Hud extends Phaser.Scene {

  
  //gameobject che visualizzera il punteggio
  private _scoreText: Phaser.GameObjects.BitmapText;
  //variabile per salvare il punteggio
  private _score: number;
  //gameobject che visualizzera le vite
  private _livesText: Phaser.GameObjects.BitmapText;
  //variabile per salvare le vite
  private _lives: number;
  //variabile che contiente un istanza della scena GAMEPLAY per creare un canale di comunicazione tra GAMEPLAY e HUD
  private _gamePlay: GamePlay;
  //in questa variabile inizializzeremo la musica 
  private _music: Phaser.Sound.BaseSound;

  //variabile per il bg della hud quando il livello è completato
  private _completedContainer: Phaser.GameObjects.Container;
  //variabile per il bg della hud quando il livello è completato
  private _completedBg: Phaser.GameObjects.Image;
  //variabile per il bg della hud quando il livello è completato
  private _completedLabel: Phaser.GameObjects.BitmapText;


  constructor() {

    // richiamiamo l'istanza padre passandogli il nome della scena
    // tutte le scene che noi creiamo ereditano ed estendono la classe Phaser.Scene
    super({
      key: "Hud",
    });
  }


  //questo metodo viene richiamato in automatico quando viene creata una scena e viene chiamato prima del CREATE
  // i metodi richiamati in automatico in una scena sono INIT, PRELOAD, CREATE, UPDATE
  create() {


    this._completedContainer = this.add.container(0, 0).setAlpha(0);
    this._completedBg = this.add.image(0, 0, "bg-black").setOrigin(0);
    this._completedLabel = this.add.bitmapText(this.game.canvas.width / 2, this.game.canvas.height / 2, "arcade", "Livello Completato").setOrigin(.5);
    this._completedContainer.add([this._completedBg, this._completedLabel]);



    //creiamo l'istaza sound per la nostra musica di sottofondo
    this._music = this.sound.add("game");

    //effettuiamo il play dell'stanza indicando la la musica quando termina deve ricominciare (loop:true) e settiamo anche il volume
    this._music.play(undefined, {
      loop: true,
      volume: 0.05,
    });

    //settiamo il numero di vite iniziali a 3
    this._lives = 3;
    //settiamo lo score a 0
    this._score = 0;


    //recuperiamo l'istanza di gameplay e la assegnamo alla nostra variabile locale.
    this._gamePlay = <GamePlay>this.scene.get("GamePlay");

    //nel blocco seguente rimuoviamo e ricreiamo tutti gli eventi in ascolto (listeners) che saranno inviati dalla scena GAMEPLAY verso la HUD (scena corrente) 

    //rimuoviamo il listener per l'aggiornamento del punteggio
    this._gamePlay.events.off("update-score", this.updateScore, this);
    //ricreiamo il listener per l'aggiornamento del punteggio
    this._gamePlay.events.on("update-score", this.updateScore, this);

    //rimuoviamo il listener per l'aggiornamento delle vite (decremento)
    this._gamePlay.events.off("decrease-live", this.decreaseLive, this);
    //ricreiamo il listener per l'aggiornamento  delle vite (decremento)
    this._gamePlay.events.on("decrease-live", this.decreaseLive, this);

    //rimuoviamo il listener per l'aggiornamento delle vite  (incremento)
    this._gamePlay.events.off("increase-live", this.increaseLive, this);
    //ricreiamo il listener per l'aggiornamento  delle vite (incremento)
    this._gamePlay.events.on("increase-live", this.increaseLive, this);

    //rimuoviamo il listener per il completamento del livello
    this._gamePlay.events.off("level-completed", this.levelCompleted, this);
    //ricreiamo il listener per il completamento del livello
    this._gamePlay.events.on("level-completed", this.levelCompleted, this);

    //rimuoviamo il listener per il completamento del gioco
    this._gamePlay.events.off("game-completed", this.gameCompleted, this);
    //ricreiamo il listener per il completamento del gioco
    this._gamePlay.events.on("game-completed", this.gameCompleted, this);

    //salviamo nel registry il valore del punteggio
    //il registry può essere utilizzato per salvare valori che devono essere utilizzati in scene diverse
    this.registry.set("score", this._score);

    //creiamo il gameobject per il punteggio
    this._scoreText = this.add
      .bitmapText(20, 20, "arcade", this._score + "")
      .setFontSize(30) //settiamo il font size a 30
      .setTint(0xffffff) //colore bianco
      .setOrigin(0);

    //creiamo il gameobject per le vire
    this._livesText = this.add
      .bitmapText(1024 - 40, 20, "arcade", "" + this._lives)
      .setFontSize(30) //settiamo il font size a 30
      .setTint(0xffffff) //colore bianco
      .setOrigin(0);

  }


  //metodo richiamato quando si deve aggiornare il punteggio
  private updateScore(parameters: Array<any>): void {
    // i metodi si aspettano un array di parametri
    // in questo caso il primo valore passato è lo score che aggiungiamo allo score corrente
    this._score += parameters[0];
    // settiamo il valore del gameobject
    this._scoreText.setText(this._score + "");
    // salviamo il valore nel registry
    this.registry.set("score", this._score);
    // salviamo il valore anche nel local storage
    //localStorage.setItem("score", this._score + "");

  }

  //metodo richiamato quando si deve decrementare una vita
  private decreaseLive(): void {
    //decrementiamo la vita di 1
    this._lives--;
    //aggiorniamo il valore nel gameogjict delle vite
    this._livesText.setText(this._lives + "")
    // salviamo il valore nel registry
    this.registry.set("lives", this._lives);
    // salviamo il valore anche nel local storage
    //localStorage.setItem("lives", this._lives + "");
    // se le vite sono zero viene richiamato il metodo gameOver
    if (this._lives == 0) {
      // facciamo partire il game over dopo quasi un secondo
      this.time.addEvent({
        delay: 950, callback: () => {
          this.gameOver();
        }
      })

    }

  }

  //metodo richiamato quando si deve incrementare una vita
  private increaseLive(): void {
    //incrementiamo la vita di 1
    this._lives++;
    //aggiorniamo il valore nel gameogjict delle vite
    this._livesText.setText(this._lives + "");
    // salviamo il valore nel registry
    this.registry.set("lives", this._lives);
    // salviamo il valore anche nel local storage
    //localStorage.setItem("lives", this._lives + "");
  }


  //richiamato quando le vite arrivano a zero
  private gameOver() {

    // fermiamo la riproduzione della musica
    this._music.stop();
    // fermiamo la scena corrente
    this.scene.stop("Hud");
    //fermiamo la scena di gameplay
    this.scene.stop("GamePlay");
    // richiamiamo la scena di gameover
    this.scene.start("GameOver");

  }


  private levelCompleted(parameters: Array<any>) {

    // fermiamo la riproduzione della musica
    this._music.stop();

    // eseguiamo l'effetto sonoro di completamento livello.
    this.sound.playAudioSprite(
      "sfx",
      "completed",
      {
        loop: false,
        volume: 0.1,
      }
    );
    //recupero il livello dai parametri inviati dalla chiamata dal gameplay
    let _level: number = parameters[0];
    //incrementiamo il livello
    _level++;
    //rendo visibile il container del livello completato
    this._completedContainer.setAlpha(1);
    //metto in pausa la scena del gamplay
    this.scene.pause("GamePlay");
    //dopo 2 secondi chiamo la funzione nextlevel per passare al livello successivo
    this.time.addEvent({
      delay: 2000, callback: () => {
        this.nextLevel(_level);
      }
    })
  }

  //richiamato quando il livello è completato
  private nextLevel(level: number) {


    // fermiamo la scena corrente
    this.scene.stop("Hud");
    //fermiamo la scena di gameplay
    this.scene.stop("GamePlay");
    //richiamiamo la scena di gameplay passandogli il livello
    this.scene.start("GamePlay", { level: level });
    //faccio partire la scena HUD
    this.scene.start("Hud");
    //porto la scena HUD in primo piano
    this.scene.bringToTop("Hud");

    // richiamiamo la scena di selezione dei livelli
    //this.scene.start("Levels", { levelCompleted: _level });

  }

  private gameCompleted() {

    // fermiamo la riproduzione della musica
    this._music.stop();
    // fermiamo la scena corrente
    this.scene.stop("Hud");
    //fermiamo la scena di gameplay
    this.scene.stop("GamePlay");
    // richiamiamo la scena di selezione di vittoria
    this.scene.start("Win");


  }
}
