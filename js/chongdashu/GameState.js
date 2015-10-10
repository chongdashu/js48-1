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

    GameState.PLAYER_SPEED_X = 100;
    GameState.PLAYER_SPEED_Y = 100;
    GameState.ENEMY_SPEED_DEFAULT = 80;

    p.prototypes = null;
    p.dataIndex = 0;

    p.backgroundGroup = null;
    p.agentGroup = null;

    p.maxEnemies = 5;
    p.enemySpawnCooldown = 5000;

    p.isDebugEnabled = false;
    
    // @phaser
    p.preload = function() {
       
    };

    // create
    // --------------------------------------------------------------

    // @phaser
    p.create = function() {
        this.createPhysics();
        this.createDebug();
        this.createGroups();
        this.createBackground();
        this.createEnemySpawnTimer();
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
        this.enemyGroup = this.game.add.group();
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

    p.createEnemySpawnTimer = function() {
        var self = this;

        this.enemySpawnTimer = this.game.time.create(false);
        this.enemySpawnTimer.loop(this.enemySpawnCooldown, function() {
            if (self.enemyGroup.length < self.maxEnemies) {
                self.createEnemy();
            }
        }, this);
        this.enemySpawnTimer.start();
    };

    p.createEnemy = function() {
        var enemy = this.enemyGroup.create(
            this.game.rnd.pick([-124, 124]),
            this.game.rnd.pick([108, -108]),
            "enemy-green");
        enemy.anchor.set(0.5, 0.5);
        this.game.physics.arcade.enable(enemy);
    };

    // update
    // --------------------------------------------------------------

    // @phaser
    p.update = function() {
        this.updatePlayer();
        this.updateEnemies();
    };

    p.updatePlayer = function() {
        if (this.player) {
            this.updatePlayerRotation();
            this.updatePlayerMovement();
        }
    };

    p.updateEnemies = function() {
        var self = this;
        if (this.enemyGroup) {
             this.enemyGroup.forEach(
                this.game.physics.arcade.moveToObject, // method to call on each object
                this.game.physics.arcade, // the context (object method belongs to)
                false, // check exists
                self.player,
                GameState.ENEMY_SPEED_DEFAULT);   // parameter 
        }
    };

    p.updatePlayerRotation = function() {

        var mouseX = this.game.input.activePointer.worldX;
        var mouseY = this.game.input.activePointer.worldY;
        var playerX = this.player.x;
        var playerY = this.player.y;

        var radians =  this.game.math.angleBetween(playerX, playerY, mouseX, mouseY);
        this.player.rotation = radians;
    };

    p.updatePlayerMovement = function() {

        if (!this.isPlayerMoveHorizontalDown()) {
            this.player.body.velocity.x = 0;
        }

        if (!this.isPlayerMoveVerticalDown()) {
            this.player.body.velocity.y = 0;
        }

        if (this.isPlayerMoveAnyDown()) {
            if (this.isPlayerMoveLeftDown()) {
                this.player.body.velocity.x  = -GameState.PLAYER_SPEED_X;
            }
            if (this.isPlayerMoveRightDown()) {
                this.player.body.velocity.x  = +GameState.PLAYER_SPEED_X;
            }
            if (this.isPlayerMoveUpDown()) {
                this.player.body.velocity.y  = -GameState.PLAYER_SPEED_Y;
            }
            if (this.isPlayerMoveDownDown()) {
                this.player.body.velocity.y  = +GameState.PLAYER_SPEED_Y;
            }
        }
    };

    // is
    // --------------------------------------------------------------
    p.isPlayerMoveLeftDown = function() {
        return  this.game.input.keyboard.isDown(Phaser.Keyboard.Left) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.A);
    };

    p.isPlayerMoveRightDown = function() {
        return  this.game.input.keyboard.isDown(Phaser.Keyboard.Right) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.D);
    };

    p.isPlayerMoveUpDown = function() {
        return  this.game.input.keyboard.isDown(Phaser.Keyboard.Up) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.W);
    };

    p.isPlayerMoveDownDown = function() {
        return  this.game.input.keyboard.isDown(Phaser.Keyboard.Down) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.S);
    };

    p.isPlayerMoveHorizontalDown = function() {
        return this.isPlayerMoveLeftDown() ||
                this.isPlayerMoveRightDown();
    };

    p.isPlayerMoveVerticalDown = function() {
        return this.isPlayerMoveUpDown() ||
                this.isPlayerMoveDownDown();
    };

    p.isPlayerMoveAnyDown = function() {
        return  this.isPlayerMoveVerticalDown() ||
                this.isPlayerMoveHorizontalDown();
    };

    // render
    // --------------------------------------------------------------

    p.render = function() {
        if (this.isDebugEnabled) {
            this.game.debug.spriteInfo(this.player, 16, 32);
            this.game.debug.body(this.player);
            this.game.debug.inputInfo(16, 128);
            this.game.debug.pointer( this.game.input.activePointer );
        }
    };
    

// Link
// ----
chongdashu.GameState = GameState;

}());


