/**
 * 
 * Copyright (c) Chong-U Lim
 * http://github.com/chongdashu
 */
this.chongdashu = this.chongdashu||{};

(function() {
    "use strict";

/**
 * MenuState
 * @class MenuState
 * @constructor
 **/
var MenuState = function(game) {
};
var p = MenuState.prototype;
    

    // @phaser
    p.preload = function() {
        console.log("[MenuState], preload()");
    };

    // @phaser
    p.create = function() {
        console.log("[MenuState], create()");
        
        var style = {
            font: "bold 24px Helvetica",
            fill: "white",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            stroke: "black",
            strokeThickness: 4
        };
        this.scoreText = this.game.add.text(0, 0, "Click Anywhere To Begin", style);
        this.scoreText.anchor.setTo(0.5, 0.5);
    };

    // @phaser
    p.update = function() {
        // this.loadingText.text = "Loading: " + this.load.progress + "%";
        if (this.game.input.activePointer.isDown) {
            this.game.state.start("GameState");
        };
    };
    

// Link
// ----
chongdashu.MenuState = MenuState;

}());


