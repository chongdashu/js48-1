var game = null;

var GLOBAL_GAME_WIDTH = 640;
var GLOBAL_GAME_HEIGHT = 480;

var data = {};


$(document).ready(function() {
    
    // Create the phaser context.
    // --------------------------
    game = new Phaser.Game(GLOBAL_GAME_WIDTH, GLOBAL_GAME_HEIGHT, Phaser.AUTO, "game-container");

    // Add all states.
    // ---------------
    game.state.add("BootState", chongdashu.BootState);
    game.state.add("PreloadState", chongdashu.PreloadState);
    game.state.add("GameState", chongdashu.GameState);

    // Start with boot sequence.
    // -------------------------
    game.state.start("BootState");

});
