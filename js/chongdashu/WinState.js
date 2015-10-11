/**
 * 
 * Copyright (c) Chong-U Lim
 * http://github.com/chongdashu
 */
this.chongdashu = this.chongdashu||{};

(function() {
    "use strict";

/**
 * WinState
 * @class WinState
 * @constructor
 **/
var WinState = function(game) {
};
var p = WinState.prototype;
    

    // @phaser
    p.preload = function() {
        console.log("[WinState], preload()");
    };

    // @phaser
    p.create = function() {
        console.log("[WinState], create()");
        
        var style = {
            font: "bold 48px Helvetica",
            fill: "#FFF100",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            stroke: "black",
            strokeThickness: 4
        };
        this.scoreText = this.game.add.text(0, 0, "You Win!", style);
        this.scoreText.anchor.setTo(0.5, 0.5);
    };

    // @phaser
    p.loadUpdate = function() {
        // this.loadingText.text = "Loading: " + this.load.progress + "%";
    };
    

// Link
// ----
chongdashu.WinState = WinState;

}());


