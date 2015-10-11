/**
 * 
 * Copyright (c) Chong-U Lim
 * http://github.com/chongdashu
 */
this.chongdashu = this.chongdashu||{};

(function() {
    "use strict";

/**
 * PreloadState
 * @class PreloadState
 * @constructor
 **/
var PreloadState = function(game) {
};
var p = PreloadState.prototype;
    
    p.logo = null;
    p.loadingFrame = null;
    p.loadingBar = null;
    p.loadingText = null;

    // @phaser
    p.preload = function() {
        console.log("[PreloadState], preload()");

        // Preloader specific stuff.
        // -------------------------
        this.game.world.setBounds(
            -GLOBAL_GAME_WIDTH/2,
            -GLOBAL_GAME_HEIGHT/2,
            GLOBAL_GAME_WIDTH, GLOBAL_GAME_HEIGHT);

        this.loadingFrame = this.game.add.sprite(0,0, "preloader-frame");
        this.loadingBar = this.game.add.sprite(0,0, "preloader-bar");
        this.loadingText = this.game.add.text(0,0, "Loading: 0%", { font: "16pt Garamond", align: "center", fill : "#FFFFFF", stroke : "black", strokeThickness: 1});

        this.loadingFrame.anchor.set(0.5);
        this.loadingBar.anchor.set(0.5);
        this.loadingText.anchor.set(0.5);

        this.load.setPreloadSprite(this.loadingBar);

        // Loading begins here.
        // --------------------
        this.load.image('background', 'res/background.png');
        this.load.image("player", "res/player.png");
        this.load.image("player_base", "res/player_base.png");
        this.load.image("player_head", "res/player_head.png");
        this.load.image("banana", "res/banana.png");
        this.load.image("salt", "res/salt.png");
        this.load.image("shooter", "res/shooter.png");
        this.load.spritesheet("enemy-green", "res/enemy-green.png", 32, 32);
        this.load.spritesheet("player_hand", "res/player_hand.png", 48, 32);
        this.load.spritesheet("jelly", "res/jelly.png", 32, 32);

       
    };

    // @phaser
    p.create = function() {
        console.log("[PreloadState], create()");
        this.loadingBar.cropEnabled = false;
        this.state.start("MenuState");
        
    };

    // @phaser
    p.loadUpdate = function() {
        this.loadingText.text = "Loading: " + this.load.progress + "%";
    };
    

// Link
// ----
chongdashu.PreloadState = PreloadState;

}());


