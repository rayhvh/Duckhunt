var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gameobject = (function () {
    function gameobject(targetElement, htmlString, x, y) {
        this.div = document.createElement(htmlString);
        this.div.setAttribute("id", htmlString);
        targetElement.appendChild(this.div);
        this.x = x;
        this.y = y;
        this.div.style.transform = "translate(" + this.x + "px," + this.y + "px)";
    }
    return gameobject;
}());
var Crosshair = (function (_super) {
    __extends(Crosshair, _super);
    function Crosshair(x, y) {
        var _this = _super.call(this, document.getElementById("container"), "crosshair", x, y) || this;
        _this.height = 64;
        _this.width = 64;
        _this.keymap = { 37: false, 38: false, 39: false, 40: false, 32: false };
        _this.speed = 6;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        return _this;
    }
    Crosshair.prototype.onKeyDown = function (event) {
        if (event.keyCode in this.keymap) {
            this.keymap[event.keyCode] = true;
        }
        this.move();
    };
    Crosshair.prototype.onKeyUp = function (event) {
        if (this.keymap[32]) {
            var g = Game.getInstance();
            g.checkShot();
            this.keymap[32] = false;
        }
        if (event.keyCode in this.keymap) {
            this.keymap[event.keyCode] = false;
        }
    };
    Crosshair.prototype.move = function () {
        if (this.keymap[37] && this.keymap[38]) {
            this.x -= this.speed;
            this.y -= this.speed;
        }
        else if (this.keymap[38] && this.keymap[39]) {
            this.x += this.speed;
            this.y -= this.speed;
        }
        else if (this.keymap[39] && this.keymap[40]) {
            this.x += this.speed;
            this.y += this.speed;
        }
        else if (this.keymap[40] && this.keymap[37]) {
            this.x -= this.speed;
            this.y += this.speed;
        }
        else if (this.keymap[37]) {
            this.x -= this.speed * 2;
        }
        else if (this.keymap[38]) {
            this.y -= this.speed * 2;
        }
        else if (this.keymap[39]) {
            this.x += this.speed * 2;
        }
        else if (this.keymap[40]) {
            this.y += this.speed * 2;
        }
        this.div.style.transform = "translate(" + this.x + "px," + this.y + "px)";
    };
    Crosshair.prototype.getLocation = function () {
        var location = { x: this.x, y: this.y, height: this.height, width: this.width };
        return location;
    };
    return Crosshair;
}(gameobject));
var Duck = (function (_super) {
    __extends(Duck, _super);
    function Duck(x, y) {
        var _this = _super.call(this, document.getElementById("container"), "duck", x, y) || this;
        _this.height = 64;
        _this.width = 64;
        _this.upspeed = 0.5;
        _this.sidespeed = 1.0;
        _this.gone = false;
        return _this;
    }
    Duck.prototype.update = function () {
        this.Behavior.performBehavior();
    };
    Duck.prototype.reset = function () {
        this.Behavior = new Flying(this);
        var g = Game.getInstance();
        var multiplier = g.level / 10;
        this.sidespeed = util.randomIntFromInterval(-0.5, 0.5) + multiplier;
        this.upspeed = util.randomIntFromInterval(30, 50) / 100 + multiplier;
        this.gone = false;
        this.x = util.randomIntFromInterval(64, 738);
        this.y = util.randomIntFromInterval(550, 750);
        console.log("Verticaal:" + this.sidespeed + " Horizontaal" + this.upspeed);
    };
    Duck.prototype.getLocation = function () {
        var location = { x: this.x, y: this.y, height: this.height, width: this.width };
        return location;
    };
    return Duck;
}(gameobject));
var Falling = (function () {
    function Falling(duck) {
        this.duck = duck;
    }
    Falling.prototype.performBehavior = function () {
        this.duck.y += 2;
        this.duck.div.style.backgroundImage = "url('images/deadduck.gif')";
        this.duck.div.style.transform = " translate(" + this.duck.x + "px," + this.duck.y + "px)";
        if (this.duck.y > 600) {
            this.duck.gone = true;
        }
    };
    Falling.prototype.onShot = function () {
    };
    return Falling;
}());
var Flying = (function () {
    function Flying(duck) {
        this.duck = duck;
        this.g = Game.getInstance();
    }
    Flying.prototype.performBehavior = function () {
        this.duck.x += this.duck.sidespeed;
        this.duck.y -= this.duck.upspeed;
        if (this.duck.x > 738 || this.duck.x < 0) {
            this.duck.sidespeed -= (this.duck.sidespeed * 2);
        }
        if (this.duck.sidespeed < 0) {
            this.duck.div.style.backgroundImage = "url('images/duckleft.gif')";
        }
        else {
            this.duck.div.style.backgroundImage = "url('images/duck.gif')";
        }
        if (this.duck.y < -64 && this.duck.gone == false) {
            this.duck.gone = true;
            if (this.g.lifes > 0) {
                this.g.lifes -= 1;
            }
        }
        this.duck.div.style.transform = " translate(" + this.duck.x + "px," + this.duck.y + "px)";
    };
    Flying.prototype.onShot = function () {
        this.g.score += 1000;
        this.duck.Behavior = new Falling(this.duck);
        util.playAudio("hit.mp3");
    };
    return Flying;
}());
var Game = (function () {
    function Game() {
        this.ducks = [];
        this.gamerunning = false;
        this.score = 0;
        this.bullets = 2;
        this.lifes = 3;
        this.theyaregone = false;
        this.level = 0;
        this.mainthemesound = new Audio('../docs/sound/maintheme.mp3');
    }
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.prototype.initializeGame = function () {
        var _this = this;
        this.mainthemesound.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        this.mainthemesound.volume = 0.2;
        this.mainthemesound.play();
        document.getElementsByTagName("sound")[0].addEventListener("click", function () { return _this.toggleMusic(); });
        this.crosshair = new Crosshair(368, 268);
        for (var i = 0; i < 3; i++) {
            this.ducks.push(new Duck(100, 100));
        }
        this.resetGame();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        if (this.areDucksGone()) {
            if (this.lifes < 1) {
                this.endGame();
            }
            else {
                this.resetGame();
                this.UpdateUI();
                requestAnimationFrame(function () { return _this.gameLoop(); });
            }
        }
        else {
            for (var _i = 0, _a = this.ducks; _i < _a.length; _i++) {
                var duck = _a[_i];
                duck.update();
            }
            this.UpdateUI();
            requestAnimationFrame(function () { return _this.gameLoop(); });
        }
    };
    Game.prototype.toggleMusic = function () {
        if (!this.mainthemesound.paused) {
            this.mainthemesound.pause();
        }
        else {
            this.mainthemesound.play();
        }
    };
    Game.prototype.areDucksGone = function () {
        this.theyaregone = true;
        for (var _i = 0, _a = this.ducks; _i < _a.length; _i++) {
            var duck = _a[_i];
            if (duck.gone == false) {
                this.theyaregone = false;
            }
        }
        return this.theyaregone;
    };
    Game.prototype.UpdateUI = function () {
        document.getElementById("score").innerHTML = "Score:" + this.score
            + "</br> Level:" + this.level;
        document.getElementById("stats").innerHTML = "Bullets:" + this.bullets
            + "</br> Lifes:" + this.lifes;
    };
    Game.prototype.resetGame = function () {
        this.level += 1;
        util.playAudio("levelup.mp3");
        for (var _i = 0, _a = this.ducks; _i < _a.length; _i++) {
            var duck = _a[_i];
            duck.reset();
        }
        this.bullets += 3;
    };
    Game.prototype.endGame = function () {
        util.playAudio("gameover.wav");
        document.getElementById("container").removeChild(document.getElementById("crosshair"));
        document.getElementById("container").removeChild(document.getElementById("score"));
        document.getElementById("container").removeChild(document.getElementById("stats"));
        var endmessage = document.createElement("endmessage");
        endmessage.setAttribute("id", "endmessage");
        var container = document.getElementById("container").appendChild(endmessage);
        endmessage.innerHTML = "GAME OVER <br> Score:" + this.score + "<br> Level:" + this.level;
    };
    Game.prototype.checkShot = function () {
        if (this.bullets > 0) {
            util.playAudio("gunshot.wav");
            for (var _i = 0, _a = this.ducks; _i < _a.length; _i++) {
                var duck = _a[_i];
                if (util.collision(duck.getLocation(), this.crosshair.getLocation())) {
                    duck.Behavior.onShot();
                }
            }
        }
        else {
            util.playAudio("empty.mp3");
        }
        if (this.bullets > 0) {
            this.bullets -= 1;
        }
    };
    return Game;
}());
window.addEventListener("load", function () {
    var g = Game.getInstance();
    g.initializeGame();
});
var util = (function () {
    function util() {
    }
    util.collision = function (instance1, instance2) {
        if (instance1.x < instance2.x + instance2.width &&
            instance1.x + instance1.width > instance2.x &&
            instance1.y < instance2.y + instance2.height &&
            instance1.height + instance1.y > instance2.y) {
            return true;
        }
    };
    util.playAudio = function (file) {
        var audio = new Audio();
        audio.src = "../docs/sound/" + file;
        audio.load();
        audio.play();
    };
    util.randomIntFromInterval = function (min, max) {
        return Math.random() * (max - min + 1) + min;
    };
    return util;
}());
//# sourceMappingURL=main.js.map