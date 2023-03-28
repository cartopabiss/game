export let GameData: any = {
  globals: {
    leaderboard: false,
    gameWidth: 1024,
    gameHeight: 600,
    bgColor: "#ffffff",
    debug: true,
  },

  preloader: {
    bgColor: "",
    image: "logo",
    imageX: 512,
    imageY: 300,
    loadingText: "",
  },

  //inseriamo un oggetto con le impostazioni dei nostri livelli
  levelsOptions: {

    pages: 1,
    tintColors: [0xff0000, 0x00ff00, 0x0000ff],
    columns: 3,
    rows: 1,
    thumbWidth: 60,
    thumbHeight: 60,
    spacing: 20,
    levels: [{ title: "Level 1" }, { title: "Level 2" }, { title: "Level 3" }, { title: "Level 4" }]

  },


  tilemaps: [
    {
      key: "level-0",
      path: "assets/map/level-0.json",
    },
    {
      key: "level-1",
      path: "assets/map/level-1.json",
    },
    {
      key: "level-2",
      path: "assets/map/level-2.json",
    },
    {
      key: "level-3",
      path: "assets/map/level-3.json",
    },
  ],

  spritesheets: [
    {
      name: "tiles",
      path: "assets/map/tilemap.png",
      width: 32,
      height: 32,
      spacing: 1,
      margin: 1,
    },
    {
      name: "bomb",
      path: "assets/images/bombnew.png",
      width: 32.6666667,
      height: 26,
      frames: 6
    },
    {
      name: "explosion-2",
      path: "assets/images/explosion2.png",
      width: 64,
      height: 64,
      spacing: 25
    },

    {
      name: "asteroid-0",
      path: "assets/images/asteroid-0.png",
      width: 80,
      height: 80,
      frames: 12
    },
    {
      name: "asteroid-1",
      path: "assets/images/asteroid-1.png",
      width: 80,
      height: 80,
      frames: 12
    },
    {
      name: "asteroid-2",
      path: "assets/images/asteroid-2.png",
      width: 100,
      height: 100,
      frames: 15
    },
    {
      name: "asteroid-3",
      path: "assets/images/asteroid-3.png",
      width: 70,
      height: 70,
      frames: 13
    },

    {
      name: "asteroid-emitter",
      path: "assets/images/asteroids-emitter.png",
      width: 128,
      height: 128,
      frames: 6
    },
    {
      name: "robo-emitter",
      path: "assets/images/robo-emitter.png",
      width: 128,
      height: 128,
      frames: 6
    },

    {
      name: "robo",
      path: "assets/images/robo.png",
      width: 30,
      height: 50,
      frames: 8
    },
    {
      name: "robo2",
      path: "assets/images/robo2.png",
      width: 30,
      height: 50,
      frames: 8
    },
    {
      name: "levelthumb",
      path: "assets/images/levelthumb.png",
      width: 60,
      height: 60,
      frames: 2
    },
    {
      name: "bonus-heart",
      path: "assets/images/bonus-heart.png",
      width: 40,
      height: 40,
      frames: 2
    },
    {
      name: "bonus-key",
      path: "assets/images/bonus-key.png",
      width: 30,
      height: 41,
      frames: 2
    },
    {
      name: "bonus-coin",
      path: "assets/images/bonus-coin.png",
      width: 64,
      height: 64,
      frames: 8
    },
  ],

  images: [

    { name: "notte", path: "assets/images/notte.png" },
    { name: "tram", path: "assets/images/tram.jpg" },
    { name: "bg", path: "assets/images/bg.jpg" },
    { name: "greenbots", path: "assets/images/greenbots.png" },
    { name: "cubes", path: "assets/images/cubes.png" },
    { name: "trasparenza", path: "assets/images/trasparenza.png" },
    { name: "bg-0", path: "assets/images/bg-0.png" },
    { name: "bg-1", path: "assets/images/bg-1.png" },
    { name: "bg-2", path: "assets/images/bg-2.png" },
    { name: "bg-3", path: "assets/images/bg-3.png" },
    { name: "cielo", path: "assets/images/cielo.jpg" },
    { name: "logof", path: "assets/images/lofog.png" },
    { name: "piramidi", path: "assets/images/piramidi.png" },



  ],


  atlas: [
    { key: "flares", imagepath: "assets/images/flares.png", jsonpath: "assets/images/flares.json" },
  ],



  sounds: [
    {
      name: "game",
      paths: ["assets/sounds/game.ogg", "assets/sounds/game.m4a"],
      volume: 1,
      loop: false,
      frame: 1,
    },
    {
      name: "intro",
      paths: ["assets/sounds/intro.ogg", "assets/sounds/intro.m4a"],
      volume: .6,
      loop: false,
      frame: 1,
    },/*
    {
      name: "win",
      paths: ["assets/sounds/win.ogg", "assets/sounds/win.m4a"],
      volume: .6,
      loop: false,
      frame: 1,
    },
    {
      name: "gameover",
      paths: ["assets/sounds/gameover.ogg", "assets/sounds/gameover.m4a"],
      volume: .6,
      loop: false,
      frame: 1,
    },*/
  ],

  audio: [
    {
      name: "sfx",
      jsonpath: "assets/sounds/sfx.json",
      paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.m4a"],
      instances: 10,
    },
  ],


  bitmapfont: [
    {
      name: "arcade",
      imgpath: "assets/fonts/arcade.png",
      xmlpath: "assets/fonts/arcade.xml",
    }
  ],
};
