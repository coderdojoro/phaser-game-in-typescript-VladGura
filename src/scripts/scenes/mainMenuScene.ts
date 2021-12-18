import 'phaser';


export default class MainMenuScene extends Phaser.Scene {
    rightKey:Phaser.Input.Keyboard.Key;
    hero:

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.spritesheet('idle-e-spritesheet', 'assets/hero/idle_aggro_E.png', {frameWidth:128, frameHeight:128}) 
        this.load.spritesheet('walk-e-spritesheet', 'assets/hero/walk_aggro_E.png', {frameWidth:128, frameHeight:128}) 
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
        this.rightKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D));
        this.hero = this.physics.add.sprite(200,200, 'idle-e-spritesheet',0); 
        this.anims.create({
            key:'idle-e-anims',
            frames:this.anims.generateFrameNumbers('idle-e-spritesheet', {}) ,
            frameRate:10,
            repeat:-1
        });
        this.anims.create({
            key:'walk-e-anims',
            frames:this.anims.generateFrameNumbers('walk-e-spritesheet', {}) ,
            frameRate:10,
            repeat:-1
        });
        this.hero.anims.play('idle-e-anims')

    }

    update(time, delta) {
        this.hero.body.setVelocity(0);
        
        if(this.rightKey.isDown) {
            this.hero.body.setVelocityX(175);
            this.hero.anims.play('walk-e-anim',true);  
        } else {
            this.hero.anims.play('idle-e-anim',true)
        }

    }
}
