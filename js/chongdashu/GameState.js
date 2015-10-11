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

    GameState.GAME_EVENT_INTROSHOUT_DELAY = 1000;
    GameState.GAME_EVENT_INTROSHOUT_TEXT = "\"Don't worry, professor!\"";
    GameState.GAME_EVENT_INTROSHOUT_2_DELAY = 3000;
    GameState.GAME_EVENT_INTROSHOUT_2_TEXT = "\"I'll find a way to get you out!\"";
    GameState.GAME_EVENT_INTROSHOUT_FINISH_DELAY = 3000;
    GameState.GAME_EVENT_INTROSHOUT_FINISH_TEXT = "";

    GameState.GAME_EVENT_INTRO_DELAY =  GameState.GAME_EVENT_INTROSHOUT_DELAY +
                                        GameState.GAME_EVENT_INTROSHOUT_2_DELAY +
                                        GameState.GAME_EVENT_INTROSHOUT_FINISH_DELAY;

    GameState.PLAYER_SPEED_X = 100;
    GameState.PLAYER_SPEED_Y = 100;
    GameState.ENEMY_SPEED_DEFAULT = 50;

    GameState.PLAYER_PUNCH_STRENGTH = 25;

    GameState.BANANAS_TO_WIN = 20;

    p.prototypes = null;
    p.dataIndex = 0;

    p.backgroundGroup = null;
    p.agentGroup = null;

    p.maxEnemies = 1;
    p.enemySpawnCooldown = 5000;
    p.totalEnemiesCount = 0;

    p.jellySpawnCooldown = 5000;
    p.jellyCount = 0;
    p.jellyOpenedCount = 0;

    p.bananaEatenCount = 0;

    p.isDebugEnabled = true;
    p.gameEventTimer = null;
    
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
        this.createJellySpawnTimer();
        this.createPlayer();
        this.createShoutText();
        this.createScoreText();
        this.createGameEvents();
    };

    p.createPhysics = function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    };

    p.createDebug = function() {
        this.game.debug.font = "8px Verdana";
        this.game.debug.columnWidth = 50;
        console.log(this.game.debug.columnWidth);

        this.game.stage.disableVisibilityChange = this.isDebugEnabled;
    };

    p.createGroups = function() {
        this.backgroundGroup = this.game.add.group();
        this.agentGroup = this.game.add.group();
        this.jellyGroup = this.game.add.group();
        this.bananaGroup = this.game.add.group();
        this.enemyGroup = this.game.add.group();
        this.textGroup = this.game.add.group();
    };

    p.createBackground = function() {
        this.background = this.backgroundGroup.create(0,0, "background");
        this.background.anchor.set(0.5, 0.5);
    };

    p.createPlayer = function() {
        var self = this;
        this.player = this.agentGroup.create(0,0, "player_base");
        this.player.anchor.set(0.5,0.5);
        this.game.physics.arcade.enable(this.player);

        // hand
        this.player_hand = this.game.add.sprite(0,0, "player_hand");
        this.player_hand.anchor.set(0.25, 0.5);
        this.player.addChild(this.player_hand);
        
        this.player_hand.animations.add("idle", [0]);
        var animation_punch = this.player_hand.animations.add("punch", [1,2,1,0], 20, false);
        animation_punch.onComplete.add(function() {
            self.player_hand.animations.stop("idle", true);
        },this);
        this.player_hand.animations.stop("idle");

        // head
        this.player_head = this.game.add.sprite(0, 0, "player_head");
        this.player_head.anchor.set(0.5, 0.5);
        this.player.addChild(this.player_head);

        // attack hitbox
        this.player_attack_hitbox = this.game.add.sprite(0,0, "player_base");
        this.player_attack_hitbox.anchor.set(0, 0.5);
        this.player_attack_hitbox.alpha = 0;
        this.player.addChild(this.player_attack_hitbox);

    };

    p.createEnemySpawnTimer = function() {
        var self = this;

        this.enemySpawnTimer = this.game.time.create(false);
        this.enemySpawnTimer.add(GameState.GAME_EVENT_INTRO_DELAY, function() {
            self.enemySpawnTimer.loop(self.enemySpawnCooldown, function() {
                if (self.enemyGroup.length < self.maxEnemies) {
                    self.createEnemy();
                }
            }, self);
            self.enemySpawnTimer.start();

        }, this);
        // this.enemySpawnTimer.start();
    };

    p.createJellySpawnTimer = function() {
        var self = this;

        this.jellySpawnTimer = this.game.time.create(false);

        this.jellySpawnTimer.loop(self.jellySpawnCooldown, function() {
                self.createJelly();
                self.jellySpawnTimer.pause();
        }, this);

    };

    p.createGameEvents = function() {
        var self = this;
        this.gameEventTimer = this.game.time.create(false);

        self.gameEventTimer.add(GameState.GAME_EVENT_INTROSHOUT_DELAY, function() {
                self.shoutText.setText(GameState.GAME_EVENT_INTROSHOUT_TEXT);

                self.gameEventTimer.add(GameState.GAME_EVENT_INTROSHOUT_2_DELAY, function() {
                    self.shoutText.setText(GameState.GAME_EVENT_INTROSHOUT_2_TEXT);

                    self.gameEventTimer.add(GameState.GAME_EVENT_INTROSHOUT_FINISH_DELAY, function() {
                        self.shoutText.setText(GameState.GAME_EVENT_INTROSHOUT_FINISH_TEXT);

                    }, this);
                    self.gameEventTimer.start();

                }, this);
                self.gameEventTimer.start();
        
        }, this);
        self.gameEventTimer.start();

        this.doShoutEvent(12000, "\"I found something!\"", 1500, function() {
            self.doShoutEvent(0, "\"I can drop agar jellies in.\"", 3000, function() {
                self.doShoutEvent(0, "\"Here you go. Try hitting it.\"", 3000);
                self.createJelly();
            });
        });
    };

    p.createEnemy = function(x, y) {
        if (typeof(x)=="undefined" || x === null) {
            x = this.game.rnd.pick([-124, 124]);
        }
        if (typeof(y)=="undefined" || y === null) {
            y = this.game.rnd.pick([108, -108]);
        }
        var enemy = this.enemyGroup.create(
            x,
            y,
            "enemy-green");
        enemy.anchor.set(0.5, 0.5);
        this.game.physics.arcade.enable(enemy);
        this.totalEnemiesCount++;

        enemy.animations.add("idle", [0]);
        enemy.animations.add("stunned", [1,2,3,2], 10, true);

        var self = this;
        if (this.totalEnemiesCount == 1) {
            // New event
            this.doShoutEvent(1000, "\"Oops.\"", 1500, function() {
                self.doShoutEvent(1000, "\"That doesn't look friendly.\"", 2000, function() {
                    
                });
            });
            
        }
    };

    p.createShoutText = function() {
        var style = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            stroke: "black",
            strokeThickness: 4
        };
        this.shoutText = this.game.add.text(0,-GLOBAL_GAME_HEIGHT/2+32, "", style);
        this.shoutText.anchor.setTo(0.5, 0.5);
        this.textGroup.add(this.shoutText);
        // this.shoutText.setTextBounds(-GLOBAL_GAME_WIDTH/2, -GLOBAL_GAME_HEIGHT+32, GLOBAL_GAME_WIDTH, GLOBAL_GAME_HEIGHT);
    };

    p.createScoreText = function() {
        var style = {
            font: "bold 48px Helvetica",
            fill: "#FFF100",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            stroke: "black",
            strokeThickness: 4
        };
        this.scoreText = this.game.add.text(0,-GLOBAL_GAME_HEIGHT/2+32*3, "", style);
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.textGroup.add(this.scoreText);
    };

    p.createJelly = function() {
        var jelly = this.jellyGroup.create(0, 0, "jelly");
        jelly.anchor.set(0.5, 0.5);
        this.game.physics.arcade.enable(jelly);
        jelly.body.immovable = true;

        jelly.animations.add("idle", [0,1,0,2], 15, true);
        jelly.animations.play("idle");

        if (this.jellyOpenedCount > 0) {
            // We've already done the intro, can speak random stuff here now.
            var text = this.game.rnd.pick([
                "\"Here comes one!\"",
                "\"Another one!\"",
                "\"...\""
            ]);

            this.doShoutEvent(0, text, 1500);
        }

    };

    p.createBanana = function(x, y) {
        if (typeof(x)=="undefined" || x === null) {
            x = 0;
        }
        if (typeof(y)=="undefined" || y === null) {
            y = 0;
        }

        var jelly = this.bananaGroup.create(x, y, "banana");
        jelly.anchor.set(0.5, 0.5);
        this.game.physics.arcade.enable(jelly);
        jelly.body.immovable = true;

        return jelly;
    };

    // do
    // --------------------------------------------------------------

    p.doBananaDrop = function(x, y) {
        var self = this;
        var banana = self.createBanana(x, y);
        var opposingVelocity = new Phaser.Point();
        self.game.physics.arcade.velocityFromRotation(
            // self.game.math.reverseAngle(enemy.body.rotation), // get reflected angle
            self.player.rotation,
            GameState.PLAYER_PUNCH_STRENGTH, // force/speed
            opposingVelocity // resultant velocity
        );

        banana.x += opposingVelocity.x;
        banana.y += opposingVelocity.y;
    };
    p.doEnemyStun = function(enemy) {
        var self = this;
        // kickback
        enemy.isStunned = true;
        enemy.animations.play("stunned");

        var opposingVelocity = enemy.body.velocity;
        self.game.physics.arcade.velocityFromRotation(
            // self.game.math.reverseAngle(enemy.body.rotation), // get reflected angle
            self.player.rotation,
            GameState.PLAYER_PUNCH_STRENGTH, // force/speed
            opposingVelocity // resultant velocity
        );

        enemy.x += opposingVelocity.x;
        enemy.y += opposingVelocity.y;

        enemy.body.velocity.set(0,0);

        enemy.stunnedTimer = self.game.time.create(true);
        enemy.stunnedTimer.add(1000, function() {

            enemy.isStunned = false;
            enemy.animations.play("idle");

        }, self);
        enemy.stunnedTimer.start();
    };

    p.doShoutEvent = function(delay, text, duration, callback) {
        var self = this;
        
        this.gameEventTimer.add(delay, function() {
            // After the delay, set the shout text
            self.shoutText.setText(text);
            if (duration) {
                // If duration is specified, set a new timer to turn off the text.
                self.doShoutEvent(duration, "", null, callback);
            }
            else {
                if (callback) {
                    callback();
                }
            }
        });
    };

    // update
    // --------------------------------------------------------------

    // @phaser
    p.update = function() {
        this.updateGameEvents();
        this.updatePlayer();
        this.updateEnemies();
        this.updatePhysics();
        this.updateText();
    };

    p.updateText = function() {
        if (this.scoreText) {
            this.scoreText.setText(this.bananaEatenCount);
        }
    };

    p.updatePhysics = function() {
        this.updateOverlaps();
        this.game.physics.arcade.collide(this.agentGroup, this.enemyGroup);
        this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);
        this.game.physics.arcade.collide(this.agentGroup, this.jellyGroup);
        this.game.physics.arcade.collide(this.enemyGroup, this.jellyGroup);
        this.game.physics.arcade.collide(this.agentGroup, this.bananaGroup, this.onAgentBananaCollide, null, this);
    };

    p.updateOverlaps = function() {
        var self = this;

        var handBounds = this.player_attack_hitbox.getBounds();

        // hand touch enemy
        if (this.player_hand) {

            this.enemyGroup.forEach(function(enemy) {
                var enemyBounds = enemy.getBounds();
                if (Phaser.Rectangle.intersects(handBounds, enemyBounds)) {
                    
                    if (self.player_hand.animations.currentAnim.name === "punch" &&
                        self.player_hand.animations.currentAnim.isPlaying) {
                        
                        self.doEnemyStun(enemy);

                    }
                }
            }, this, true);
        }

        // hand touch jelly
        if (this.player_hand) {

            this.jellyGroup.forEach(function(jelly) {
                var jellyBounds = jelly.getBounds();
                
                if (Phaser.Rectangle.intersects(handBounds, jellyBounds)) {
                    
                    if (self.player_hand.animations.currentAnim.name === "punch" &&
                        self.player_hand.animations.currentAnim.isPlaying) {
                        
                        jelly.destroy();
                        self.jellyOpenedCount++;

                        console.log("self.jellyOpenedCount=%s", self.jellyOpenedCount);

                        if (self.jellyOpenedCount == 1) {
                            self.doBananaDrop();

                            self.doShoutEvent(0, "\"Bananas contain Potassium\"", 3500, function() {
                                self.doShoutEvent(0, "\"Just touch it to eat it.", 3000);
                            });
                        }
                        else {
                            if (self.jellyOpenedCount < 4) {
                                self.doBananaDrop();
                            }

                            if (self.jellyOpenedCount == 4) {
                                self.createEnemy(jelly.x, jelly.y);
                            }

                            self.jellySpawnTimer.resume();
                            
                        }

                        



                    }
                }
            }, this, true);
        }
       
    };

    p.updateGameEvents = function() {
        var elapsed = this.game.time.totalElapsedSeconds();
    };

    p.updatePlayer = function() {
        if (this.player) {
            this.updatePlayerRotation();
            this.updatePlayerMovement();
            this.updatePlayerActions();
        }
    };

    p.updateEnemies = function() {
        var self = this;
        // if (this.enemyGroup) {
        //      this.enemyGroup.forEach(
        //         this.game.physics.arcade.moveToObject, // method to call on each object
        //         this.game.physics.arcade, // the context (object method belongs to)
        //         false, // check exists
        //         self.player,
        //         GameState.ENEMY_SPEED_DEFAULT);   // parameter
        // }
        if (this.enemyGroup) {
            this.enemyGroup.forEach(function(enemy) {
                if (!enemy.isStunned) {
                    self.game.physics.arcade.moveToObject(enemy, self.player, GameState.ENEMY_SPEED_DEFAULT);
                }
            }, this, true);
        }

        if (this.enemyGroup) {
            this.enemyGroup.forEach(function(enemy) {
                enemy.rotation = self.game.physics.arcade.angleBetween(enemy, self.player);
            }, this, true);
        }
    };

    p.updatePlayerActions = function() {
        if (this.game.input.activePointer.isDown) {
            if (this.player_hand.animations.currentAnim.name === "idle") {
                this.player_hand.animations.play("punch");
            }
        }
    };

    p.updatePlayerRotation = function() {

        var mouseX = this.game.input.activePointer.worldX;
        var mouseY = this.game.input.activePointer.worldY;
        var playerX = this.player.x;
        var playerY = this.player.y;

        var radians =  this.game.math.angleBetween(playerX, playerY, mouseX, mouseY);
        this.player.rotation = radians;
        // this.player_hand.rotation = radians;
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

    // on
    // --------------------------------------------------------------

    p.onAgentBananaCollide = function(agent, banana) {
        var self = this;
        banana.destroy();
        this.bananaEatenCount++;
        if (this.bananaEatenCount == 1) {
            self.doShoutEvent(0, "\"Eat " + GameState.BANANAS_TO_WIN + " of them!", 2000, function() {
                self.doShoutEvent(0, "\"You will grow back to normal.\"", 2000, function() {
                    self.doShoutEvent(0, "\"Good luck!\"", 2000);
                    self.jellySpawnTimer.start();
                });
            });
        }
        
    };

    // render
    // --------------------------------------------------------------

    p.render = function() {
        if (this.isDebugEnabled) {
            this.game.debug.spriteInfo(this.player, 16, 32);
            this.game.debug.body(this.player);
            // this.game.debug.spriteBounds(this.player_attack_hitbox);
            // this.game.debug.body(this.player_hand);
            this.game.debug.inputInfo(16, 128);
            this.game.debug.pointer( this.game.input.activePointer );
            this.game.debug.timer(this.enemySpawnTimer, 16, 256);
            this.game.debug.timer(this.jellySpawnTimer, 256, 256);
        }
    };
    

// Link
// ----
chongdashu.GameState = GameState;

}());


