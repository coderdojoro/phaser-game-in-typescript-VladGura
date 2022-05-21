import 'phaser';
import Grizzly from '../entities/grizzly';
import Hero from '../entities/hero';

export default class MainMenuScene extends Phaser.Scene {
    hero: Hero;
    worldLayer: Phaser.Tilemaps.TilemapLayer;
    map: Phaser.Tilemaps.Tilemap;
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.spritesheet('idle-e-spritesheet', 'assets/hero/idle_aggro_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('walk-e-spritesheet', 'assets/hero/walk_aggro_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('walk-s-spritesheet', 'assets/hero/walk_aggro_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('idle-s-spritesheet', 'assets/hero/idle_aggro_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('idle-n-spritesheet', 'assets/hero/idle_aggro_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('walk-n-spritesheet', 'assets/hero/walk_aggro_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('atk-n-spritesheet', 'assets/hero/atk_heavy_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('atk-e-spritesheet', 'assets/hero/atk_heavy_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('atk-s-spritesheet', 'assets/hero/atk_heavy_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-e-spritesheet', 'assets/hero/hitdead_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-n-spritesheet', 'assets/hero/hitdead_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-s-spritesheet', 'assets/hero/hitdead_S.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('grizzly-idle-spritesheet', 'assets/entities/grizzly-idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-n-spritesheet', 'assets/entities/grizzly-north.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-s-spritesheet', 'assets/entities/grizzly-south.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-e-spritesheet', 'assets/entities/grizzly-east.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-die-spritesheet', 'assets/entities/grizzly-die.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('tiles', 'assets/tilesets/ground-tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/town.json');
    }
    create() {
        // remove the loading screen
        let loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('transparent');
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    // @ts-ignore
                    loadingScreen.remove();
                }
            });
        }

        this.cameras.main.fadeIn(2000);
        this.cameras.main.setBackgroundColor('#008080');

        this.map = this.make.tilemap({ key: 'map' });
        let tileset = this.map.addTilesetImage('ground', 'tiles', 32, 32, 1, 2);

        let belowLayer = this.map.createLayer('Below hero', tileset, 0, 0);
        let objBelowLayer = this.map.createLayer('Objects below hero', tileset, 0, 0);
        this.worldLayer = this.map.createLayer('World', tileset, 0, 0);
        let abovelayer = this.map.createLayer('Above hero', tileset, 0, 0);
        this.worldLayer.setCollisionBetween(tileset.firstgid, tileset.firstgid + tileset.total, true);

        let spawnPoint = this.map.findObject('Objects', (obj) => obj.name == 'Spawn Point');

        this.hero = new Hero(this, spawnPoint.x, spawnPoint.y);

        let grizzlyObjects = this.map.getObjectLayer('Objects').objects.filter((elem) => elem.name == 'grizzly');
        for (let grizzly of grizzlyObjects) {
            new Grizzly(this,grizzly.x, grizzly.y);            
        }

        abovelayer.setDepth(100);
        this.hero.setDepth(50);

        this.physics.add.collider(this.hero, this.worldLayer);
        this.cameras.main.startFollow(this.hero);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBoundsCollision(true, true, true, true);
    }

    update(time, delta) {}
}
