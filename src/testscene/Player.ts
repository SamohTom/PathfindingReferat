export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceKey: Phaser.Input.Keyboard.Key;

    updateFunction: (time: number, delta: number) => void;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "spritesheet", "Characters_1#1");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.3 ,0.3 )
        this.setBounce(0.1, 0); // our player will bounce from items
        this.setCollideWorldBounds(true); // don't go out of the map

        this.cursors = this.scene.input.keyboard.createCursorKeys();


        let that = this;
        this.updateFunction = (time: number, delta: number) => {
            that.update(time, delta);
        }

        this.scene.events.on('update', this.updateFunction)
        
    }
    
    update(time: number, delta: number){
        if (this.cursors.left.isDown) // if the left arrow key is down
        {
            this.setPosition(this.x - 32, this.y)
            //this.setVelocityX(-100); // move left
        }
        else if (this.cursors.right.isDown) // if the right arrow key is down
        {
            this.setVelocityX(100); // move right
        }
        else if (this.cursors.up.isDown)
        {
            this.setVelocityY(-100); // move up
        }
        else if (this.cursors.down.isDown)
        {
            this.setVelocityY(100); // move down
        }
        else
        {
            this.setVelocityX(0);
            this.setVelocityY(0);
        }
        //this.setVelocityX(this.body.velocity.x * 0.97);
    }

    
    destroy(){
        this.scene.events.off('update', this.updateFunction)
        super.destroy();
    }

}