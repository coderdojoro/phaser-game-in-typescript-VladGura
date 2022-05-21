import 'phaser';
import Grizzly from './grizzly';
enum HeroPosition {
    WEST,
    EAST,
    NORTH,
    SOUTH
}
enum HeroState {
    IDLE,
    WALK,
    ATTACK,
    DEAD
}
export default class Hero extends Phaser.GameObjects.Sprite {
    rightKey: Phaser.Input.Keyboard.Key;
    leftKey: Phaser.Input.Keyboard.Key;
    downKey: Phaser.Input.Keyboard.Key;
    upKey: Phaser.Input.Keyboard.Key;
    atkKey: Phaser.Input.Keyboard.Key;

    heroState: HeroState = HeroState.IDLE;
    heroPosition: HeroPosition = HeroPosition.EAST;

    constructor(scene, x, y) {
        super(scene, x, y, 'idle-e-spritesheet', 0);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        (this.body as Phaser.Physics.Arcade.Body).setSize(15, 35);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(57, 49);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.anims.create({
            key: 'idle-e-anim',
            frames: this.anims.generateFrameNumbers('idle-e-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-s-anim',
            frames: this.anims.generateFrameNumbers('idle-s-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-n-anim',
            frames: this.anims.generateFrameNumbers('idle-n-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-e-anim',
            frames: this.anims.generateFrameNumbers('walk-e-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-s-anim',
            frames: this.anims.generateFrameNumbers('walk-s-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-n-anim',
            frames: this.anims.generateFrameNumbers('walk-n-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'atk-n-anim',
            frames: this.anims.generateFrameNumbers('atk-n-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'atk-e-anim',
            frames: this.anims.generateFrameNumbers('atk-e-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'atk-s-anim',
            frames: this.anims.generateFrameNumbers('atk-s-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'hero-hitdead-e-anim',
            frames: this.anims.generateFrameNumbers('hero-hitdead-e-spritesheet', {}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-hitdead-n-anim',
            frames: this.anims.generateFrameNumbers('hero-hitdead-n-spritesheet', {}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-hitdead-s-anim',
            frames: this.anims.generateFrameNumbers('hero-hitdead-s-spritesheet', {}),
            frameRate: 5,
            repeat: 0
        });
        this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.downKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.upKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.atkKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

        this.anims.play('idle-e-anim', true);
        //this.setScale(2.5);
    }

    kill() {
        if (this.heroState == HeroState.DEAD) {
            return;
        }
        let cardinalPosition = HeroPosition[this.heroPosition].charAt(0).toLowerCase();
        if (cardinalPosition == 'w') {
            cardinalPosition = 'e';
        }
        this.anims.play('hero-hitdead-' + cardinalPosition + '-anim', true);
        this.heroState = HeroState.DEAD;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        if (this.heroState == HeroState.DEAD) {
            return;
        }
        console.log('atk: ' + this.atkKey.isDown);

        

        if (this.atkKey.isDown) {
            let cardinalPosition = HeroPosition[this.heroPosition].charAt(0).toLowerCase();
            if (cardinalPosition == 'w') {
                cardinalPosition = 'e';
            }
            this.anims.play('atk-' + cardinalPosition + '-anim');
            this.heroState = HeroState.ATTACK;
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = HeroState.IDLE;
                this.anims.play('idle-' + cardinalPosition + '-anim');
            });
            return;
        }

        if(this.heroState==HeroState.ATTACK) {
            let enemies;
            if (this.heroPosition == HeroPosition.NORTH) {
                enemies = this.scene.physics.overlapRect((this.body as Phaser.Physics.Arcade.Body).left - 11, (this.body as Phaser.Physics.Arcade.Body).top - 45, 35, 45);
            }
            if (this.heroPosition == HeroPosition.SOUTH) {
                enemies = this.scene.physics.overlapRect(
                    (this.body as Phaser.Physics.Arcade.Body).left - 11, (this.body as Phaser.Physics.Arcade.Body).bottom, 35, 45);
            }
            if (this.heroPosition == HeroPosition.WEST) {
                enemies = this.scene.physics.overlapRect((this.body as Phaser.Physics.Arcade.Body).right, (this.body as Phaser.Physics.Arcade.Body).top, 45, 35);
            }
            if (this.heroPosition == HeroPosition.EAST) {
                enemies = this.scene.physics.overlapRect((this.body as Phaser.Physics.Arcade.Body).left - 45, (this.body as Phaser.Physics.Arcade.Body).top, 45, 35);
            }
            for(let enemy of enemies) {
                if(enemy.gameObject instanceof Grizzly) {
                    enemy.gameObject.kill();
                    
                }
            }
            return;
        }


        if (this.rightKey.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(175);
            this.setFlipX(false);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.WEST;
        }

        if (this.leftKey.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-175);
            this.setFlipX(true);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.EAST;
        }

        if (this.downKey.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(175);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.SOUTH;
        }
        if (this.upKey.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-175);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.NORTH;
        }
        if (this.rightKey.isUp && this.leftKey.isUp && this.downKey.isUp && this.upKey.isUp) {
            this.heroState = HeroState.IDLE;
        }
        if (this.heroState == HeroState.IDLE) {
            if (this.heroPosition == HeroPosition.WEST || this.heroPosition == HeroPosition.EAST) {
                this.anims.play('idle-e-anim', true);
            }
            if (this.heroPosition == HeroPosition.SOUTH) {
                this.anims.play('idle-s-anim', true);
            }
            if (this.heroPosition == HeroPosition.NORTH) {
                this.anims.play('idle-n-anim', true);
            }
        }
        if (this.heroState == HeroState.WALK) {
            if (this.heroPosition == HeroPosition.WEST || this.heroPosition == HeroPosition.EAST) {
                this.anims.play('walk-e-anim', true);
            }
            if (this.heroPosition == HeroPosition.SOUTH) {
                this.anims.play('walk-s-anim', true);
            }
            if (this.heroPosition == HeroPosition.NORTH) {
                this.anims.play('walk-n-anim', true);
            }
        }
    }
}
