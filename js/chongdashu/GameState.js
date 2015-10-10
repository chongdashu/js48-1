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
        this.createGroups();
        this.createBackground();
        this.createPlayer();
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
    };

    // @phaser
    p.update = function() {
       
    };

    

// Link
// ----
chongdashu.GameState = GameState;

}());


