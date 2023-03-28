import { GameData } from "../GameData";

export default class Levels extends Phaser.Scene {

  private _gameWidth: number = 0
  private _gameHeight: number = 0;
  private _levelGroup: Phaser.GameObjects.Group;
  private _levelCompleted: number;
  private _bestLevel: number;

  constructor() {
    super({
      key: "Levels",
    });
  }

  init(data: any) {

    //recuperiamo il valore levelcompleted e controlliamo che questo valore non sia nulla 
    if (data.levelCompleted != null) this._levelCompleted = data.levelCompleted;

  }

  create() {
    let _nextLevel: number = 0;

  
    //se 
    if (this._levelCompleted != null) {
      _nextLevel = this._levelCompleted + 1;
    }
    //se il valore del livello completato + maggiore del livello migliore
    //aggiorniamo il valore nel registry in modo da poterlo usare in tutte le scene
    if (_nextLevel > this._bestLevel) {
      this._bestLevel = _nextLevel;
      this.registry.set("bestLevel", _nextLevel);
      localStorage.setItem("bestLevel", _nextLevel + "");
    }

    this.cameras.main.setBackgroundColor("#000000");

    this._gameWidth = this.game.canvas.width;
    this._gameHeight = this.game.canvas.height;
    this._levelGroup = this.add.group();
    this.addLevelThumbnails();
  }

  addLevelThumbnails(): void {

    let rowLength: number = GameData.levelsOptions.thumbWidth * GameData.levelsOptions.columns + GameData.levelsOptions.spacing * (GameData.levelsOptions.columns - 1);
    let leftMargin: number = (this._gameWidth - rowLength) / 2 + GameData.levelsOptions.thumbWidth / 2;
    let columnHeight: number = GameData.levelsOptions.thumbHeight * GameData.levelsOptions.rows + GameData.levelsOptions.spacing * (GameData.levelsOptions.rows - 1);
    let topMargin: number = (this._gameHeight - columnHeight) / 2 + GameData.levelsOptions.thumbHeight / 2;
    for (let k: number = 0; k < GameData.levelsOptions.pages; k++) {
      for (let i: number = 0; i < GameData.levelsOptions.columns; i++) {
        for (let j: number = 0; j < GameData.levelsOptions.rows; j++) {
          let posX: number = k * this._gameWidth + leftMargin + i * (GameData.levelsOptions.thumbWidth + GameData.levelsOptions.spacing);
          let posY: number = topMargin + j * (GameData.levelsOptions.thumbHeight + GameData.levelsOptions.spacing);
          let levelNumber: number = k * (GameData.levelsOptions.rows * GameData.levelsOptions.columns) + j * GameData.levelsOptions.columns + i;
          let locked: boolean = true;
          if (levelNumber <= this._bestLevel) locked = false;
          let thumb: LevelThumbnail = new LevelThumbnail(this, posX, posY, 'levelthumb', levelNumber, locked);

          thumb.setTint(GameData.levelsOptions.tintColors[k % GameData.levelsOptions.tintColors.length]);
          this._levelGroup.add(thumb);
          var levelText = this.add.text(thumb.x, thumb.y - 12, (thumb.levelNumber + 1).toString(), {
            font: '24px Arial',
            color: '#000000'
          });
          levelText.setOrigin(0.5);
          this._levelGroup.add(levelText);
        }
      }

    }
  }

  startLevel(level: number) {

    this.scene.stop("Levels");
    this.scene.start("GamePlay", { level: level });
    this.scene.start("Hud");
    this.scene.bringToTop("Hud");

    if(level >3){
      this.scene.start("GameOver");
    }
  }

  


}

export class LevelThumbnail extends Phaser.GameObjects.Sprite {

  levelNumber: number;
  locked: boolean;

  constructor(scene: Levels, x: number, y: number, key: string, level: number, locked: boolean) {
    super(scene, x, y, key);
    scene.add.existing(this);
    this.levelNumber = level;
    this.locked = locked;
    this.setFrame(locked ? 0 : 1);

    this.setInteractive().on("pointerdown", () => {

      if (!this.locked) {
        scene.startLevel(level);

      }


    })
  }
}
