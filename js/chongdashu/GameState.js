/**
 * 
 * Copyright (c) Chong-U Lim
 * http://github.com/chongdashu
 */
this.chongdashu = this.chongdashu||{};

(function() {
    "use strict";

/**
 * GameState
 * @class GameState
 * @constructor
 **/
var GameState = function(game) {
};
var p = GameState.prototype;

    p.prototypes = null;
    p.dataIndex = 0;

    p.backgroundGroup = null;
    p.agentGroup = null;

    // Images
    // ------
    
    // @phaser
    p.preload = function() {
       
    };

    // @phaser
    p.create = function() {
        this.createPhysics();
        this.createDebug();
        this.createGroups();
        this.createBackground();
        this.createPlayer();
    };

    p.createPhysics = function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    };

    p.createDebug = function() {
        this.game.debug.font = "8px Verdana";
        this.game.debug.columnWidth = 50;
        console.log(this.game.debug.columnWidth);
        
    };

    p.createGroups = function() {
        this.backgroundGroup = this.game.add.group();
        this.agentGroup = this.game.add.group();
    };

    p.createBackground = function() {
        this.background = this.backgroundGroup.create(0,0, "background");
        this.background.anchor.set(0.5, 0.5);
    };

    p.createPlayer = function() {
        this.player = this.agentGroup.create(0,0, "player");
        this.player.anchor.set(0.5,0.5);
        this.game.physics.arcade.enable(this.player);
    };

    // @phaser
    p.update = function() {
        this.updatePlayer();
    };

    p.updatePlayer = function() {
        if (this.player) {
            
            // TODO: Update player rotation based on mouse position
            // 
            //                    M (Mx, My)
            //                  /  |
            //                /    |
            //              /      |    
            //            /        |
            //   -      /          |
            //         P - - - - - - 
            //   +   (Px, Py)
            // P: Player | M: Mouse
            // Angle = tan-1 (My-Py) / (Mx-Py)
            var mouseX = this.game.input.activePointer.worldX;
            var mouseY = this.game.input.activePointer.worldY;
            var playerX = this.player.x;
            var playerY = this.player.y;

            var radians =  this.game.math.angleBetween(playerX, playerY, mouseX, mouseY);
            this.player.rotation = radians;



        }
    };

    p.render = function() {
        this.game.debug.spriteInfo(this.player, 16, 32);
        this.game.debug.body(this.player);
        this.game.debug.inputInfo(16, 128);
        this.game.debug.pointer( this.game.input.activePointer );
    };
    

// Link
// ----
chongdashu.GameState = GameState;

}());


