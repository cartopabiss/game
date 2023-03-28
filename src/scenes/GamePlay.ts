import Player from "../gameComponents/player/Player";
import Missile from "../gameComponents/missile/Missile";
import Enemy from "../gameComponents/enemy/Enemy";
import EnemyAsteroid from "../gameComponents/enemy/EnemyAsteroid";
import EnemyPlatform from "../gameComponents/enemy/EnemyPlatform";
import Bonus from "../gameComponents/bonus/Bonus";
import { GameData } from "../GameData";
import BonusCoin from "../gameComponents/bonus/BonusCoin";
import BonusHeart from "../gameComponents/bonus/BonusHeart";
import BonusKey from "../gameComponents/bonus/BonusKey";


export default class GamePlay extends Phaser.Scene {

  

  //creo tutte le variabile che utilizzerò nel gamplay
  //questa conterrà l'istanza della classe player
  private _player: Player;
  private cielo: Phaser.GameObjects.TileSprite;
  //_bg: istanza di tilesprite per lo sfondo
  private _bg: Phaser.GameObjects.TileSprite;
  //_parallax1: istanza di tilesprite per lo sfondo in parallasse
  private _parallax1: Phaser.GameObjects.TileSprite;
  //_parallax2: istanza di tilesprite per lo sfondo in parallasse
  private _parallax2: Phaser.GameObjects.TileSprite;
  //_parallax3: istanza di tilesprite per lo sfondo in parallasse
  private _parallax3: Phaser.GameObjects.TileSprite;

  //i gruppi che ospiteranno i diversi tipi di gameobjects
  private _missileGroup: Phaser.GameObjects.Group;
  private _enemyGroup: Phaser.GameObjects.Group;
  private _bonusGroup: Phaser.GameObjects.Group;

  //questa variabile contiene l'indice del livello corrente
  private _level: number = 0;

  //i due emitter manager per la gestione delle esplosioni (asteroide e nemico)
  private _asteroidParticle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private _robotParticle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private _playerParticle: Phaser.GameObjects.Particles.ParticleEmitterManager;

  //i game objects relativi alla mappa di tile gestita con TILED
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  //in layer viene istanziato il livello di tile visibili
  private layer: Phaser.Tilemaps.TilemapLayer;
  //in layer 2 il livello per la gestione delle collisioni pavimento e piattaforme
  private layer2: Phaser.Tilemaps.TilemapLayer;
  //in layer3 le collisioni solo per i nemici
  private layer3: Phaser.Tilemaps.TilemapLayer;
  //in layer4 le collisioni solo per il player
  private layer4: Phaser.Tilemaps.TilemapLayer;

  //in questa variabile memorizzo le opzioni del livello
  private _levelValues: any;
  //game object bitmaptext per la scritta del livello
  private _levelTitle: Phaser.GameObjects.BitmapText;

  //variabile per stabilire se la chiave è stata presa o meno
  private _haveKey: boolean = false;
  //variabile per stabilire se la chiave è rilasciata come bonus
  private _keySpawned: boolean = false;

  constructor() {
    // richiamiamo l'istanza padre passandogli il nome della scena
    // tutte le scene che noi creiamo ereditano ed estendono la classe Phaser.Scene
    super({ key: "GamePlay" });
  }

  //questo metodo viene richiamato in automatico quando viene creata una scena e viene chiamato prima del CREATE
  // i metodi richiamati in automatico in una scena sono INIT, PRELOAD, CREATE, UPDATE
  // non devono essere per forza presenti tutti
  init(data: {level:number}) {
    

    //recuperiamo il valore levelcompleted e controlliamo che questo valore non sia nulla   
    if (data.level != null || this._level == 3 ) {
      this._level = data.level;
    } else {
      //se è null settiamo il livello = 0 (primo livello)
      this._level = 0;
    }
    //recuperiamo dalle options eventuali valori del livello Esempio: titolo 
    this._levelValues = GameData.levelsOptions.levels[this._level];

  }

  //questo metodo viene richiamato in automatico quando viene creata una scena
  create() {
    
    //la chiave non è stata presa
    this._haveKey = false;
    //la chiave non è stata rilasciata
    this._keySpawned = false;

    //creo il particle emitter manager per l'esplosione dell'asteroide usando la texture "asteroid-emitter"
    this._asteroidParticle = this.add
      .particles("asteroid-emitter")
      .setDepth(101);

    //creo tre diversi emitter
    //il primo per lo smoke effect
    this._asteroidParticle.createEmitter({
      frame: 0, //utilizza il primo frame della texture
      angle: { min: 0, max: 360 }, // setta l'angolo min e max
      speed: { min: 10, max: 30 }, // setta la velocità min e max
      quantity: { min: 6, max: 8 }, // il numero di min max di sprite
      lifespan: 2000, //la durata di vita del singolo sprite
      alpha: { start: 1, end: 0 }, //inizia con alpha a 1 ed effettua la dissolvenza
      scale: { start: 0.1, end: 0.4 }, //inizia con lo scale a 0.1 e termina con lo scale a 0.4
      on: false // non parte in automatico
    });

    //il secondo emitter per lo i frammenti di asteroide
    this._asteroidParticle.createEmitter({
      frame: [1, 2, 3, 4], //utilizza i seguenti frame della texture
      angle: { min: 0, max: 360 }, // setta l'angolo min e max
      speed: { min: 30, max: 60 }, // setta la velocità min e max
      quantity: { min: 6, max: 10 }, // il numero di min max di sprite
      lifespan: 3000, //la durata di vita del singolo sprite
      alpha: { start: 1, end: 0 }, //inizia con alpha a 1 ed effettua la dissolvenza
      scale: 0.5, //setta lo scale a 0.5
      rotate: { start: 0, end: 360 }, //ruota lo sprite da 0 a 360
      on: false  // non parte in automatico
    });

    //il terzo emitter per il flash dell'esplosione
    this._asteroidParticle.createEmitter({
      frame: 5, //usa il frame 5  della texture
      lifespan: 200, //la durata di vita del singolo sprite
      scale: { start: 2, end: 0 },  //inizia con lo scale a 2 e termina con lo scale a 0
      rotate: { start: 0, end: 180 }, //ruota lo sprite da 0 a 180
      alpha: { start: 0.8, end: 0 }, //inizia con alpha a .8 ed effettua la dissolvenza a 0
      on: false // non parte in automatico
    });

    //creo il particle emitter manager per l'esplosione del robot nemico usando la texture "robo-emitter"
    this._robotParticle = this.add
      .particles("robo-emitter")
      .setDepth(101);

    //creo tre diversi emitter nella stessa modalità dell'esplosione dell'asteroide
    this._robotParticle.createEmitter({
      frame: 0,
      angle: { min: 0, max: 360 },
      speed: { min: 10, max: 30 },
      quantity: { min: 6, max: 8 },
      lifespan: 2000,
      alpha: { start: 1, end: 0 },
      scale: { start: 0.1, end: 0.4 },
      on: false
    });

    this._robotParticle.createEmitter({
      frame: [1, 2],
      angle: 180,
      speed: { min: -200, max: -300 },
      quantity: 2,
      lifespan: 3000,
      alpha: { start: 1, end: 0 },
      scale: { start: 1, end: 1.5 },
      rotate: { start: 0, end: 360 },
      gravityY: 800,
      on: false
    });

    this._robotParticle.createEmitter({
      frame: 5,
      lifespan: 200,
      scale: { start: 2, end: 0 },
      rotate: { start: 0, end: 180 },
      alpha: { start: 0.8, end: 0 },
      on: false
    });

    //creo il particle emitter manager per l'esplosione del robot nemico usando la texture "robo-emitter"
    this._playerParticle = this.add
      .particles("robo-emitter")
      .setDepth(101);

    //creo tre diversi emitter nella stessa modalità dell'esplosione dell'asteroide
    this._playerParticle.createEmitter({
      frame: 0,
      angle: { min: 0, max: 360 },
      speed: { min: 10, max: 30 },
      quantity: { min: 6, max: 8 },
      lifespan: 2000,
      alpha: { start: 1, end: 0 },
      scale: { start: 0.1, end: 0.4 },
      on: false
    });

    this._playerParticle.createEmitter({
      frame: [3, 4],
      angle: { min: 0, max: 360 },
      speed: { min: -200, max: -300 },
      quantity: 2,
      lifespan: 3000,
      alpha: { start: 1, end: 0 },
      scale: { start: 1, end: 1.5 },
      rotate: { start: 0, end: 360 },
      gravityY: 800,
      on: false
    });

    this._playerParticle.createEmitter({
      frame: 5,
      lifespan: 200,
      scale: { start: 2, end: 0 },
      rotate: { start: 0, end: 180 },
      alpha: { start: 0.8, end: 0 },
      on: false
    });



    //creo le tre istanze dei gruppi che opsiteranno i diversi game objects (missile/enemy/bonus)
    this._missileGroup = this.add.group({ runChildUpdate: true });
    this._enemyGroup = this.add.group({ runChildUpdate: true });
    this._bonusGroup = this.add.group({ runChildUpdate: true });

    //creo le tileset di sfondo con scrollfactor=0 in modo che rimangano sempre fisse indipendentemente dallo spostamento della camera
    this._bg = this.add.tileSprite(0, 0, 2048, 600, "piramidi").setOrigin(.5,.5).setScrollFactor(.1).setPosition(this.game.canvas.width / 2 + 500 ,this.game.canvas.height / 2 - 45).setDepth(0);

    //modifico lo sfondo al cambiare del livello
    if ( this._level == 2){
      this._bg.setPosition(this.game.canvas.width / 2 -300 ,this.game.canvas.height / 2 - 45)
      this.cielo = this.add.tileSprite(0, 0, 2300, 600, "notte").setOrigin(.5,.5).setScrollFactor(.05).setPosition(this.game.canvas.width / 2 + 480 ,this.game.canvas.height / 2 -40).setDepth(-1).setScale(1.1);
      let _creditBg = this.add.image(0, 0, "bg-black").setScale(8).setOrigin(.5).setDepth(200).setAlpha(.5)    
    }else if(this._level == 1){
      this._bg.setPosition(this.game.canvas.width / 2 + 100 ,this.game.canvas.height / 2 - 45)
      this.cielo = this.add.tileSprite(0, 0, 2300, 600, "tram").setOrigin(.5,.5).setScrollFactor(.05).setPosition(this.game.canvas.width / 2 + 480 ,this.game.canvas.height / 2 + 115).setDepth(-1).setScale(1.7);
      let _creditBg = this.add.image(0, 0, "bg-black").setScale(10).setOrigin(.5).setDepth(200).setAlpha(.2) 
    }else if(this._level == 0){
      this._bg.setPosition(this.game.canvas.width / 2 + 500 ,this.game.canvas.height / 2 - 45)
      this.cielo = this.add.tileSprite(0, 0, 2300, 600, "cielo").setOrigin(.5,.5).setScrollFactor(.05).setPosition(this.game.canvas.width / 2 + 480 ,this.game.canvas.height / 2 -40).setDepth(-1).setScale(1.1);

    }else if (this._level == 3){
      
      console.log("ao ai ")
      
        this.scene.stop("GamePlay");
        this.scene.start("GameOver");
        
        //this.events.emit("game-completed");
     
      
    }console.log(this._level);

    
    //this.cielo = this.add.tileSprite(0, 0, 2048, 600, "cielo").setOrigin(.5,.5).setScrollFactor(.05).setPosition(this.game.canvas.width / 2 + 480 ,this.game.canvas.height / 2 - 140).setDepth(-1);
    this._parallax1 = this.add.tileSprite(0, 0, 1024, 600, "bg-1").setOrigin(0).setScrollFactor(0).setDepth(-2);
    this._parallax2 = this.add.tileSprite(0, 0, 1024, 600, "bg-2").setOrigin(0).setScrollFactor(0).setDepth(-2);
    this._parallax3 = this.add.tileSprite(0, 0, 1024, 600, "bg-3").setOrigin(0).setScrollFactor(0).setDepth(-2);


    //creo l'istanza del player posizionandolo in un punto arbitrario della mappa
    this._player = new Player({
      scene: this, x: 64, y:
        450, key: "robo"
    });
    this._player.setSize(.05, .5);




    //setto il punto di spawn dei nemici
    switch(this._level){
      case 0: {
        new EnemyPlatform({
          scene: this, x: 256, y: 450, key: "robo2"
        });

        new EnemyPlatform({
          scene: this, x: 512, y: 384, key: "robo2"
        });
    
        new EnemyPlatform({
          scene: this, x: 864, y: 450, key: "robo2"
        });
    
        new EnemyPlatform({
          scene: this, x: 1312, y: 100, key: "robo2"
        });
    
        new EnemyPlatform({
          scene: this, x: 2496, y: 100, key: "robo2"
        });
        break;
      }
      case 1:{
        new EnemyPlatform({
          scene: this, x: 448, y: 450, key: "robo2"
        });
    
        new EnemyPlatform({
          scene: this, x: 2080, y: 450, key: "robo2"
        });
    
        new EnemyPlatform({
          scene: this, x: 576, y: 160, key: "robo2"
        });
    
        new EnemyPlatform({
          scene: this, x: 1340, y: 448, key: "robo2"
        });
        break;
      }case 2:{
        new EnemyPlatform({
          scene: this, x: 572, y: 448, key: "robo2"
        });

        
        new EnemyPlatform({
          scene: this, x: 1184, y: 64, key: "robo2"
        });

        new EnemyPlatform({
          scene: this, x: 2048, y: 128, key: "robo2"
        });

        

        new EnemyPlatform({
          scene: this, x: 2304, y: 448, key: "robo2"
        });

        new EnemyPlatform({
          scene: this, x: 1920, y: 416, key: "robo2"
        });

      }
    }
   

    this
    //richiamo il metodo createMap che gestisce la visualizzazione della mappa
    this.createMap();
    //richiamo la funzione setupEnemies che posiziona i nemici sulla mapp
    this.setupEnemies();

    //creo un collider tra il gruppo _missileGroup e _enemyGroup.

    this.physics.add.collider(this._missileGroup, this._enemyGroup, this.hitEnemy, undefined, this);

    //creo un collider tra il _player e _enemyGroup.
  
    this.physics.add.collider(this._player, this._enemyGroup, this.hitPlayer, undefined, this);

    //creo un collider tra il _player e _bonusGroup.
  
    this.physics.add.collider(this._player, this._bonusGroup, this.hitBonus, undefined, this);

    //creo un istanza di gameobject di tipo bitmaptext
    //la posiziono al centro, con scrollfactor=0 e alpha = 0
    this._levelTitle = this.add.bitmapText(this.game.canvas.width / 2, this.game.canvas.height / 2, "arcade", this._levelValues.title)
      .setOrigin(.5)
      .setScrollFactor(0).setAlpha(0)

    //creo un tween this._levelTitle che si ripete una volta con dissolvenza e della durata di 1000ms
    this.add.tween({ targets: this._levelTitle, alpha: 1, repeat: 1, yoyo: true, duration: 1000 });
  }

  

  //metodo createMap
  //questo metodo crea la mappa 
  createMap(): void {

    //controllo che il livello sia maggiore di 2
    if(this._level >2){
      this.scene.stop("GamePlay");
      this.scene.start("Win");
    }

    //se un istanza di map è già attiva la distruggo
    if (this.map != null) this.map.destroy();

    

    //creo la tilemap usando come chiave "level-" + this._level che è il livello che viene passato alla scena nell'init.
    this.map = this.make.tilemap({ key: "level-" + this._level });

    //definisco i bounds della camera
    //sono posizionati a x:0,y:0 e come larghezza e altezza corrispondono all'altezza e larghezza della mappa
    this.cameras.main.setBounds(
      0, //x
      0, //y
      this.map.widthInPixels, //width
      this.map.heightInPixels //height
    );

    

    //definisco i bounds
    //sono posizionati a x:0,y:0 e come larghezza e altezza corrispondono all'altezza e larghezza della mappa
    this.physics.world.setBounds(
      0, //x
      0, //y
      this.map.widthInPixels, //width
      this.map.heightInPixels //height
    );

    //creo il tileset che sarà utilizzato nei singoli layer come texture per le tile
    this.tileset = this.map.addTilesetImage("tilemap", "tiles");

    //creo il primo layer che ospiterà le tile del pavimento e delle piattaforme
    //questo layer è solamente visuale e non c'è interazione con nessun game object
    this.layer = this.map
      .createLayer("world-" + this._level, this.tileset, 0, 0)
      .setDepth(200)
      .setAlpha(1);

    //il secondo layer contiene invece le tile con il collide:true per cui i game object potranno interagire con esso
    //questo layer viene settato con alpha a zero
    this.layer2 = this.map
      .createLayer("collision-" + this._level, this.tileset, 0, 0)
      .setDepth(0)
      .setAlpha(0);

    //definisco che tutte le TILE di queto layer con la property collide devono aver collisione con i gameobject
    this.layer2.setCollisionByProperty({
      collide: true,
    });

    //il terzo layer è relativo alle interazioni con gli ENEMY
    //in questo layer ci sono le TILE che bloccano il percorso dei nemici e gli danno un path specifico da seguire
    this.layer3 = this.map
      .createLayer("enemyBlocks-" + this._level, this.tileset, 0, 0)
      .setDepth(0)
      .setAlpha(0);

    //definisco che tutte le TILE di queto layer con la property collide devono aver collisione con i gameobject
    this.layer3.setCollisionByProperty({
      collide: true,
    });

    //il quarto layer è relativo alle interazioni con il PLAYER
    //in questo layer ci sono le TILE che possono uccidere il player e la tile per l'exit dal livello
    this.layer4 = this.map
      .createLayer("playerBlocks-" + this._level, this.tileset, 0, 0)
      .setDepth(0)
      .setAlpha(1);

    //definisco che tutte le TILE di queto layer con la property collide devono aver collisione con i gameobject
    this.layer4.setCollisionByProperty({
      collide: true,
    });

    //definisco che la camera deve seguire il player
    this.cameras.main.startFollow(
      this._player,
      true,
      1,
      0,
      0,
      0);

    //creo un collider tra PLAYER e Layer2
    //senza di questo la collisione non verrebbe eseguita
    this.physics.add.collider(
      this._player,
      this.layer2,
      () => {
        
      },
      undefined,
      this
    );

    //creo un collider tra il gruppo _enemyGroup e Layer2
    //senza di questo la collisione non verrebbe eseguita
    this.physics.add.collider(
      this._enemyGroup,
      this.layer2,
      () => {
        //qui è possibile eseguire del codice specifico
      },
      undefined,
      this
    );

    //creo un collider tra il gruppo _bonusGroup e Layer2
    //senza di questo la collisione non verrebbe eseguita
    this.physics.add.collider(
      this._bonusGroup,
      this.layer2,
      () => {
        //qui è possibile eseguire del codice specifico
      },
      undefined,
      this
    );

    //creo un collider tra il gruppo _enemyGroup e Layer3
    //senza di questo la collisione non verrebbe eseguita
    this.physics.add.collider(
      this._enemyGroup,
      this.layer3,
      (enemy: any) => {
        //quando ENEMY collide con una tile di questo layer viene richiamato per l'ENEMY il metodo changeDirection
        let _enemy: Enemy = <Enemy>enemy;
        _enemy.changeDirection();

      },
      undefined,
      this
    );

    //creo un collider tra il gruppo PLAYER e Layer4
    //senza di questo la collisione non verrebbe eseguita
    this.physics.add.collider(
      this._player,
      this.layer4,
      (_player: any, _tile: any) => {

        //se la TILE ha la proprietà di tipo "KILL"
        if (_tile.properties.kill == true) {
          //decremento le vite
          this.events.emit("decrease-live");
          //richiamiamo la funzione per la morte del player
          this.playerDeath()

        }
        //se la TILE ha la proprietà di tipo "EXIT"
        else if (_tile.properties.exit == true && this._haveKey) {
          // richiamo il metodo levelCompleted
          this.levelCompleted();

        }
        //se la TILE ha la proprietà di tipo "WIN"
        else if (_tile.properties.win == true && this._haveKey) {
          // richiamo il metodo gameCompleted
          this.gameCompleted();

        }
        
      },
      undefined,
      this
    );
  }

  // il seguete metodo serve per posizionare gli ENEMY secondo la posizione stabilita in TILED
  setupEnemies(): void {

    //recuperiamo il layer object dalla mappa di TILED
    let _objLayer: Phaser.Tilemaps.ObjectLayer = this.map.getObjectLayer("enemies");

    // controlliamo che _objLayer non sia null
    if (_objLayer != null) {

      // recuperiamo gli objects all'interno del layer
      let _enemies: any = _objLayer.objects as any[];

      // cicliamo l'array 
      _enemies.forEach((tile: Phaser.Tilemaps.Tile) => {

        //aggungiamo un nuovo nemico nella positione indicata dalla TILE
        new EnemyPlatform({
          scene: this, x: tile.x, y: tile.y, key: "robo2"
        });

      });
    }

  }

  //aggiunge un missile al gruppo _missileGroup
  addMissile(missile: Missile) {
    this._missileGroup.add(missile);
  }

  //rimuove un missile dal gruppo _missileGroup
  removeMissile(missile: Missile) {
    this._missileGroup.remove(missile, true, true);
  }

  //aggiunge un ENEMY al gruppo _enemyGroup
  addEnemy(enemy: Enemy) {
    this._enemyGroup.add(enemy);
  }

  //rimuove un ENEMY dal gruppo _enemyGroup
  removeEnemy(enemy: Enemy) {
    this._enemyGroup.remove(enemy, true, true);
  }

  //aggiunge un BONUS al gruppo _bonusGroup
  addBonus(bonus: Bonus) {
    this._bonusGroup.add(bonus);
  }

  //rimuove un BONUS dal gruppo _bonusGroup
  removeBonus(bonus: Bonus) {
    this._bonusGroup.remove(bonus, true, true);
  }


  //questo metodo viene richiamato quando un missile sparato dal PLAYER collide con un ENEMY
  hitEnemy(missile: any, enemy: any) {

    //effettuiamo una conversione dal tipo any al tipo corretto
    const _missile: Missile = <Missile>missile;
    const _enemy: Enemy = <Enemy>enemy;

    //se l'enemy ha il name == asteroid 
    if (_enemy.name == "asteroid") {
      //emette una particella dal manager _asteroidParticle nella posizione dell'ENEMY
      this._asteroidParticle.emitParticleAt(_enemy.x, _enemy.y);
    } else {
      //emette una particella dal manager _robotParticle nella posizione dell'ENEMY
      this._robotParticle.emitParticleAt(_enemy.x, _enemy.y);
      this.bonusLogic(_enemy.x, _enemy.y)
    }

    //rimuove ENEMY dal gruppo _enemyGroup
    this.removeEnemy(_enemy);
    //rimuove MISSILE dal gruppo _missileGroup
    this.removeMissile(_missile);
    //emetto l'evento "update-score" che verrà captato dalla scena HUD ed incrementerà lo score
    this.events.emit("update-score", [100]);
    //questo metodo generico riproduce il suono dell'esplosione
    this.playExplosion();

  }

  //questo metodo viene richiamato quando il PLAYER collide con un ENEMY
  hitPlayer(player: any, enemy: any) {

    //effettuiamo una conversione dal tipo any al tipo corretto
    const _enemy: Enemy = <Enemy>enemy;
    const _player: Player = <Player>player;

    //se l'ENEMY è di tipo asteroid
    if (_enemy.name == "asteroid") {
      //emettiamo la particella di esplosione dell'asteroid
      this._asteroidParticle.emitParticleAt(_enemy.x, _enemy.y);
      //rimuoviamo l'ENEMY dal gruppo _enemyGroup
      this.removeEnemy(_enemy);
      //emettiamo l'evento "decrease-live" che verrà intercettato dal listener nella HUD
      this.events.emit("decrease-live");
      //riproduciamo il suono dell'esplosione
      this.playExplosion();
      this.bonusLogic(_enemy.x, _enemy.y)

    }
    // se l'ENEMY è di tipo robot
    else if (_enemy.name == "robot") {

      //controlliamo il tipo di collisione tra PLAYER e ENEMY
      //se il margine inferiore del PLAYER collide con il margine superiore dell'ENEMY 
      if (_player.getBody().touching.down && _enemy.getBody().touching.up) {
        //emettiamo la particella per la distruzione dell'ENEMY
        this._robotParticle.emitParticleAt(_enemy.x, _enemy.y);
        //rimuoviamo l'ENEMY dal gruppo _enemyGroup
        this.removeEnemy(_enemy);
        //riproduciamo il suono dell'esplosione
        this.playExplosion();
        // richiamo il metodo per la creazione del bonus
        this.bonusLogic(_enemy.x, _enemy.y)

      }
      //se il PLAYER collide in altro modo dal precedente
      else {
        //richiamiamo la funzione per la morte del player
        this.playerDeath()
        //riproduciamo il suono dell'esplosione
        this.playExplosion();
        //emettiamo l'evento "decrease-live" che verrà intercettato dal listener nella HUD
        this.events.emit("decrease-live");
      }

    }

  }

  //funzione che si occupa della morte
  playerDeath() {

    this.cameras.main.stopFollow();
    this._player.death();
    this._playerParticle.emitParticleAt(this._player.x, this._player.y);

    this.time.addEvent({
      delay: 1000, callback: () => {
        this._player.relive();
        this.cameras.main.startFollow(
          this._player,
          true,
          1,
          0,
          0,
          0);
      }
    });

  }

  //metodo per la gestione della logica di rilascio dei bonus
  bonusLogic(x: number, y: number) {

    // produco un valore random tra 0 e 100
    const _rnd: number = Phaser.Math.RND.integerInRange(0, 100);

    //controllo se il numero di nemici è maggiore di zero
    if (this._enemyGroup.countActive() > 0) {

      // se il valore è minore di 65 creo un bonus di tipo coin
      if (_rnd < 65) {
        //creo un bonus di tipo coin
        new BonusCoin({ scene: this, x: x, y: y, key: "bonus-coin" });

      }
      // se il valore è tra 65 e 95 e non ho la chiave genero un bonus di tipo chiave
      else if (_rnd >= 65 && _rnd < 95 && !this._haveKey && !this._keySpawned) {
        //creo un bonus di tipo chiave
        new BonusKey({ scene: this, x: x, y: y, key: "bonus-key" });
        this._keySpawned = true;

      }
      // se il valore è tra 65 e 95 e ho la chiave genero un bonus di coin
      else if (_rnd >= 65 && _rnd < 95 && this._keySpawned) {
        //creo un bonus di tipo chiave
        new BonusCoin({ scene: this, x: x, y: y, key: "bonus-coin" });

      }
      // se il valore è maggiore di 95 genero un bonus di tipo heart
      else if (_rnd >= 95) {
        //creo un bonus di tipo cuore
        new BonusHeart({ scene: this, x: x, y: y, key: "bonus-heart" });
      }
      //se nessuna delle precedenti opzioni è valida genero un bonus di tipo coin
      else {
        //creo un bonus di tipo coin
        new BonusCoin({ scene: this, x: x, y: y, key: "bonus-coin" });

      }

    }
    //se il numero di nemici è uguale a zero, quindi ho eliminato l'ultimo nemico, e la chiave ancora non è stata presa, genero in maniera forzata il bonus di titpo chiave   
    else if (this._enemyGroup.countActive() == 0 && !this._keySpawned && !this._haveKey) {
      //creo un bonus di tipo chiave
      new BonusKey({ scene: this, x: x, y: y, key: "bonus-key" });

    }
    //se nessuna delle precedenti opzioni è valida genero un bonus di tipo coin
    else {
      //creo un bonus di tipo coin
      new BonusCoin({ scene: this, x: x, y: y, key: "bonus-coin" });

    }

  }


  //metodo richiamato quando il PLAYER collide con un BONUS
  hitBonus(player: any, bonus: any) {

    //effettuiamo una conversione dal tipo any al tipo corretto
    const _bonus: Bonus = <Bonus>bonus;

    //se il BONUS è attivo per essere collezionato
    if (_bonus.isActive()) {
      //viene esguito il metodo getBonus
      _bonus.getBonus();

      //se il bonus è di tipo COIN
      if (_bonus.name == "coin") {

        //emettiamo l'evento "update-score" che verrà intercettato dal listener nella HUD
        this.events.emit("update-score", [50]);
        //riproduciamo un suono
        this.sound.playAudioSprite("sfx", "coin", { loop: false, volume: 0.2, });
      }
      //se il bonus è di tipo KEY
      else if (_bonus.name == "key") {
        //settiamo la variabile a true così da sapere se una chiave è già stata presa
        this._haveKey = true;
        //riproduciamo un suono
        this.sound.playAudioSprite("sfx", "key", { loop: false, volume: 0.2, });

      }
      //se il bonus è di tipo HEART
      else if (_bonus.name == "heart") {
        //emettiamo l'evento "increase-live" che verrà intercettato dal listener nella HUD
        this.events.emit("increase-live");
        //riproduciamo un suono
        this.sound.playAudioSprite("sfx", "heart", { loop: false, volume: 0.2, });


      }



    }
  }

  //metodo che viene richiamato quando il livello è completato
  levelCompleted(): void {
    //emettiamo l'evento "level-completed" che verrà intercettato dal listener nella HUD
    this.events.emit("level-completed", [this._level]);

  }

  //metodo che viene richiamato quando il gioco è completato
  gameCompleted(): void {
    //emettiamo l'evento "game-completed" che verrà intercettato dal listener nella HUD
    this.events.emit("game-completed");

  }

  //metodo che riproduce il suono dell'esplosione
  playExplosion() {
    this.sound.playAudioSprite(
      "sfx",
      "explosion",
      {
        loop: false,
        volume: 0.05,
      }
    );
  }

  //questo metodo viene richiamato in automatico ogni sessantesimo di secondo
  update(time: number, delta: number) {

    // muoviamo la positione X delle tile in base alla posizione della camera moltiplicando per un fattore che ne rallenta il movimento
    // movimento lento
    this._parallax1.tilePositionX = this.cameras.main.scrollX * .25;
    // movimento medio
    this._parallax2.tilePositionX = this.cameras.main.scrollX * .5;
    // movimento veloce = a quello della camera
    this._parallax3.tilePositionX = this.cameras.main.scrollX;

    //richiamiamo in modo programmatico l'update del player
    this._player.update(time, delta);

  }

}
