import { Player } from "./Player.js";

export class TestScene extends Phaser.Scene {
    delayTime: number = 30;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    baseMap: Phaser.Tilemaps.TilemapLayer;

    player: Player;

    tileMap: Phaser.Tilemaps.Tilemap;

    constructor() {
        super({
            key: "Testscene"
        })
    }

    preload() {
        this.load.atlas('spritesheet', 'assets/spritesheet.png', 'assets/spritesheet.json');

        // Load tileset-image:
        this.load.image('tiles', 'assets/tilemap/gridtiles.png');
        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map', 'assets/tilemap/map1.json');

    }

    create() {

        

        this.cursors = this.input.keyboard.createCursorKeys();

        this.tileMap = this.make.tilemap({ key: 'map' });
        const tileset = this.tileMap.addTilesetImage('default', 'tiles');
        

        this.baseMap = this.tileMap.createLayer('baseLayer', tileset, 0, 0);
        this.physics.world.bounds.width = this.baseMap.width;
        this.physics.world.bounds.height = this.baseMap.height;
        
        let objectlayer = this.tileMap.getObjectLayer('objectLayer');
        let spawnPoint = objectlayer.objects.find((object) => object.name == "SpawnPoint");
        console.log(objectlayer);
        let target1 = objectlayer.objects.find((object) => object.name == "Ziel1")
        let target2 = objectlayer.objects.find((object) => object.name == "Ziel2")
        let target3 = objectlayer.objects.find((object) => object.name == "Ziel3")

        this.tileMap.putTileAtWorldXY(76, spawnPoint.x, spawnPoint.y)
        this.tileMap.putTileAtWorldXY(104, target1.x, target1.y, undefined, undefined, "baseLayer")
        this.tileMap.putTileAtWorldXY(104, target3.x, target3.y, undefined, undefined, "baseLayer")
        this.tileMap.putTileAtWorldXY(104, target2.x, target2.y, undefined, undefined, "baseLayer")


        //this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        
        this.baseMap.setCollisionByExclusion([16]);
      
        
        this.physics.add.collider(this.baseMap, this.player);

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
        // make the camera follow the player
        //this.cameras.main.startFollow(this.player, false);
        this.cameras.main.setBackgroundColor(0x7090ff);


    }

    update() {
        let objectlayer = this.tileMap.getObjectLayer('objectLayer');
        let spawnPoint = objectlayer.objects.find((object) => object.name == "SpawnPoint");
        let target1 = objectlayer.objects.find((object) => object.name == "Ziel1")
        let target2 = objectlayer.objects.find((object) => object.name == "Ziel2")
        let target3 = objectlayer.objects.find((object) => object.name == "Ziel3")
        
        if(this.cursors.left.isDown){
            this.findPath(this.convertCoordinates(spawnPoint), this.convertCoordinates(target1))
        }
        if(this.cursors.down.isDown){
            this.findPath(this.convertCoordinates(spawnPoint), this.convertCoordinates(target2))
        }
        if(this.cursors.right.isDown){
            this.findPath(this.convertCoordinates(spawnPoint), this.convertCoordinates(target3))
        }
        if(this.cursors.up.isDown){
            this.create()
        }
      
        
    }

    findPath(start: Positions, end: Positions){
        var newGrid = [];
        for(var y = 0; y < this.tileMap.height; y++){
            var col = [];
            for(var x = 0; x < this.tileMap.width; x++){
                var index = this.baseMap.getTileAt(x, y).index;
                var marked = false;
                if(index == 20)marked = true;
                col.push([index, marked, -1]);
            }
        newGrid.push(col);
    }
    //create 2D Arry based on our Tilemap 
    //grid[y][x]


        // this.lee(start,end,newGrid) 
        var finalGrid = this.lee(start,end,newGrid) 

        if(!finalGrid){
            return [];
        }

        //tracking the path
        var path = this.findPathRekursiv(finalGrid, end);
        console.log(path);
        path.forEach(element => {
            this.tileMap.putTileAt(34, element.x, element.y)
        });
        return path;
        


    }

    findPathRekursiv(grid, pos: Positions): Array<Positions>{
        if(grid[pos.y][pos.x][2] == 0){
            return [pos];
        }
        else{
            if(grid[pos.y - 1][pos.x][2] == grid[pos.y][pos.x][2] - 1){
                var newPosition = this.findPathRekursiv(grid, new Positions(pos.x, pos.y - 1))
                newPosition.push(pos)
                return newPosition

            }
            if(grid[pos.y + 1][pos.x][2] == grid[pos.y][pos.x][2] - 1){
                var newPosition =  this.findPathRekursiv(grid, new Positions(pos.x, pos.y + 1))
                newPosition.push(pos)
                return newPosition

            }
            if(grid[pos.y][pos.x - 1][2] == grid[pos.y][pos.x][2] - 1){
                var newPosition = this.findPathRekursiv(grid, new Positions(pos.x - 1, pos.y))
                newPosition.push(pos)
                return newPosition

            }
            if(grid[pos.y][pos.x + 1][2] == grid[pos.y][pos.x][2] - 1){
                var newPosition =  this.findPathRekursiv(grid, new Positions(pos.x + 1, pos.y))
                newPosition.push(pos)
                return newPosition
            }
        }
    }
   

    aStar(){
        
    }

    lee(start:Positions, target: Positions, grid){
        var todo = [start];
        grid[start.y][start.x][1] = true;
        grid[start.y][start.x][2] = 0;

        while(todo.length != 0){
            
            var curr = todo.shift()    
            if(curr.isEqual(target)){
                console.log(grid)
                this.tileMap.putTileAt(62, curr.x, curr.y)
                return grid;
            }
            
            else{
                try{if(!grid[curr.y - 1][curr.x][1]){ //oben
                    grid[curr.y - 1][curr.x][1] = true;
                    grid[curr.y - 1][curr.x][2] = grid[curr.y][curr.x][2] + 1;
                    todo.push(new Positions(curr.x, curr.y - 1))
                }}catch{}
                try{if(!grid[curr.y + 1][curr.x][1]){ //unten
                    grid[curr.y + 1][curr.x][1] = true;
                    grid[curr.y + 1][curr.x][2] = grid[curr.y][curr.x][2] + 1;
                    todo.push(new Positions(curr.x, curr.y+1))
                }}catch{}
                try{if(!grid[curr.y][curr.x - 1][1]){ //links
                    grid[curr.y][curr.x - 1][1] = true;
                    grid[curr.y][curr.x - 1][2] = grid[curr.y][curr.x][2] + 1;
                    todo.push(new Positions(curr.x-1, curr.y))
                }}catch{}
                try{if(!grid[curr.y][curr.x + 1][1]){ //rechts
                    grid[curr.y][curr.x + 1][1] = true;
                    grid[curr.y][curr.x + 1][2] = grid[curr.y][curr.x][2] + 1;
                    todo.push(new Positions(curr.x+1, curr.y))
                }}catch{}
            }
            // grid[curr.y][curr.x][1] = true
            this.tileMap.putTileAt(132, curr.x, curr.y)
        }
        return false;

    }

    convertCoordinates(obj: Phaser.Types.Tilemaps.TiledObject){
        let curX = this.tileMap.getTileAtWorldXY(obj.x, obj.y).x 
        let curY = this.tileMap.getTileAtWorldXY(obj.x, obj.y).y 
        return new Positions(curX, curY)
    }
}

class Positions{
    constructor(public x:number, public y:number){

    }
    isEqual(pos2:Positions): boolean{   
        return(pos2.x == this.x && pos2.y == this.y);
    }
}