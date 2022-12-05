import { TestScene1 } from "./testscene/TestScene1.js";
var config = {
    width: 640,
    height: 640,
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    parent: 'game',
    scene: [
        new TestScene1()
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        }
    },
    input: {
        gamepad: true
    }
};
new Phaser.Game(config);
//# sourceMappingURL=App.js.map