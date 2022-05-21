import 'phaser';
import * as EasyStar from 'easystarjs';
import MainMenuScene from '../scenes/mainMenuScene';
export enum State {
    IDLE,
    FOLLOW,
    DEAD
}
export default class Grizzly extends Phaser.GameObjects.Sprite {
    easystar: EasyStar.js;
    scene: MainMenuScene;
    enemyState: State = State.IDLE;
    target: Phaser.Math.Vector2 | null = null;

    heroCollider: Phaser.Physics.Arcade.Collider;

    constructor(scene, x, y) {
        super(scene, x, y, 'idle-e-spritesheet', 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setSize(20, 31);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(6, 1);

        this.anims.create({
            key: 'grizzly-idle-anim',
            frames: this.anims.generateFrameNumbers('grizzly-idle-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-n-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-n-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-s-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-s-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-e-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-e-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-die-anim',
            frames: this.anims.generateFrameNumbers('grizzly-die-spritesheet', {}),
            frameRate: 7,
            repeat: 0
        });

        this.anims.play('grizzly-idle-anim', true);

        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.scene.worldLayer.layer.data.map((arr) => arr.map((tile) => tile.index)));
        this.easystar.setAcceptableTiles(-1);
        this.easystar.enableDiagonals();
        this.easystar.enableCornerCutting();

        this.heroCollider=this.scene.physics.world.addOverlap(
            this.scene.hero,
            this,
            () => this.scene.hero.kill(),
            undefined,
            this
        );

    }

    kill(){
        this.enemyState=State.DEAD;
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        this.scene.physics.world.removeCollider(this.heroCollider);

    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if(this.enemyState == State.DEAD){
            return;
        }
        if (this.enemyState == State.IDLE) {
            let distance = Phaser.Math.Distance.Between(this.x, this.y, this.scene.hero.x, this.scene.hero.y);
            if (distance < 300) {
                this.comuteNextTarget();
                this.enemyState = State.FOLLOW;
            }
        }
        if (this.enemyState == State.FOLLOW) {
            if (this.target == null) {
                return;
            }
            let distanceFromTarget = Phaser.Math.Distance.Between(this.target.x, this.target.y, this.x, this.y);
            if (distanceFromTarget < 2) {
                this.comuteNextTarget();
            }
            this.scene.physics.moveTo(this, this.target.x, this.target.y);

            this.setWalkAnimation();
        }

        if (this.enemyState == State.IDLE) {
            this.anims.play('grizzly-idle-anim', true);
        }
    }

    setWalkAnimation() {
        let radiansAngle = (this.body as Phaser.Physics.Arcade.Body).velocity.angle();
        let degreeAngle = (radiansAngle * 180) / Math.PI;
        let direction: string = '';

        if (degreeAngle >= 315 || degreeAngle <= 45) {
            direction = 'E';
        }
        if (degreeAngle > 45 && degreeAngle < 135) {
            direction = 'N';
        }
        if (degreeAngle >= 135 && degreeAngle <= 225) {
            direction = 'W';
        }
        if (degreeAngle > 225 && degreeAngle < 315) {
            direction = 'S';
        }
        if (direction == 'E') {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }

        if (direction == 'E' || direction == 'W') {
            this.anims.play('grizzly-walk-e-anim', true);
        }

        if (direction == 'N') {
            this.anims.play('grizzly-walk-s-anim', true);
        }
        if (direction == 'S') {
            this.anims.play('grizzly-walk-n-anim', true);
        }

    }

    comuteNextTarget() {
        this.easystar.findPath(
            this.scene.map.worldToTileX(this.x),
            this.scene.map.worldToTileY(this.y),
            this.scene.map.worldToTileX(this.scene.hero.x),
            this.scene.map.worldToTileY(this.scene.hero.y),
            (path) => {
                if (path == null) {
                    this.enemyState == State.IDLE;
                }
                if (path.length <= 2) {
                    this.target = new Phaser.Math.Vector2(this.scene.hero.x, this.scene.hero.y);
                    return;
                }
                this.target = new Phaser.Math.Vector2(this.scene.map.tileToWorldX(path[1].x) + 16, this.scene.map.tileToWorldY(path[1].y) + 16);
            }
        );
        this.easystar.calculate();
    }
}
