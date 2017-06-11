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
        _this.speed = 6;
        _this.keyObservers = new Array();
        _this.releases = new Array();
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        return _this;
    }
    Crosshair.prototype.subscribe = function (o) {
        this.keyObservers.push(o);
    };
    Crosshair.prototype.unsubscribe = function (o) {
        var i = this.keyObservers.indexOf(o);
        if (i != -1) {
            this.keyObservers.splice(i, 1);
        }
    };
    Crosshair.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            case Keynumbers.LEFT:
                new Keys.left(this);
                break;
            case Keynumbers.UP:
                new Keys.up(this);
                break;
            case Keynumbers.RIGHT:
                new Keys.right(this);
                break;
            case Keynumbers.DOWN:
                new Keys.down(this);
                break;
            case Keynumbers.SPACE:
                new Keys.space(this);
                break;
        }
        for (var i = this.keyObservers.length - 1; i > -1; i--) {
            this.keyObservers[i].notify();
        }
        this.y = this.y + Crosshair.yspeed;
        this.x = this.x + Crosshair.xspeed;
        this.div.style.transform = "translate(" + this.x + "px," + this.y + "px)";
    };
    Crosshair.prototype.onKeyUp = function (event) {
        switch (event.keyCode) {
            case Keynumbers.LEFT:
                this.releases = this.keyObservers.filter(function (l) { return l instanceof Keys.left; });
                break;
            case Keynumbers.UP:
                this.releases = this.keyObservers.filter(function (l) { return l instanceof Keys.up; });
                break;
            case Keynumbers.RIGHT:
                this.releases = this.keyObservers.filter(function (l) { return l instanceof Keys.right; });
                break;
            case Keynumbers.DOWN:
                this.releases = this.keyObservers.filter(function (l) { return l instanceof Keys.down; });
                break;
            case Keynumbers.SPACE:
                var g = Game.getInstance();
                g.checkShot();
                this.releases = this.keyObservers.filter(function (l) { return l instanceof Keys.space; });
                break;
        }
        for (var _i = 0, _a = this.releases; _i < _a.length; _i++) {
            var keyobserver = _a[_i];
            keyobserver.unsubscribe();
            Crosshair.xspeed = 0;
            Crosshair.yspeed = 0;
        }
    };
    Crosshair.prototype.getLocation = function () {
        var location = { x: this.x, y: this.y, height: this.height, width: this.width };
        return location;
    };
    return Crosshair;
}(gameobject));
Crosshair.xspeed = 0;
Crosshair.yspeed = 0;
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
        this.sidespeed = Tools.util.randomIntFromInterval(-0.5, 0.5) + multiplier;
        this.upspeed = Tools.util.randomIntFromInterval(30, 50) / 100 + multiplier;
        this.gone = false;
        this.x = Tools.util.randomIntFromInterval(64, 738);
        this.y = Tools.util.randomIntFromInterval(550, 750);
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
        Tools.util.playAudio("hit.mp3");
    };
    return Flying;
}());
var Keys;
(function (Keys) {
    var down = (function () {
        function down(s) {
            this.subject = s;
            this.subject.subscribe(this);
        }
        down.prototype.notify = function () {
            Crosshair.yspeed = 5;
        };
        down.prototype.unsubscribe = function () {
            this.subject.unsubscribe(this);
        };
        return down;
    }());
    Keys.down = down;
})(Keys || (Keys = {}));
var Keynumbers;
(function (Keynumbers) {
    Keynumbers[Keynumbers["LEFT"] = 37] = "LEFT";
    Keynumbers[Keynumbers["UP"] = 38] = "UP";
    Keynumbers[Keynumbers["RIGHT"] = 39] = "RIGHT";
    Keynumbers[Keynumbers["DOWN"] = 40] = "DOWN";
    Keynumbers[Keynumbers["SPACE"] = 32] = "SPACE";
})(Keynumbers || (Keynumbers = {}));
var Keys;
(function (Keys) {
    var left = (function () {
        function left(s) {
            this.subject = s;
            this.subject.subscribe(this);
        }
        left.prototype.notify = function () {
            Crosshair.xspeed = -5;
        };
        left.prototype.unsubscribe = function () {
            this.subject.unsubscribe(this);
        };
        return left;
    }());
    Keys.left = left;
})(Keys || (Keys = {}));
var Keys;
(function (Keys) {
    var right = (function () {
        function right(s) {
            this.subject = s;
            this.subject.subscribe(this);
        }
        right.prototype.notify = function () {
            Crosshair.xspeed = 5;
        };
        right.prototype.unsubscribe = function () {
            this.subject.unsubscribe(this);
        };
        return right;
    }());
    Keys.right = right;
})(Keys || (Keys = {}));
var Keys;
(function (Keys) {
    var space = (function () {
        function space(s) {
            this.subject = s;
            this.subject.subscribe(this);
        }
        space.prototype.notify = function () {
        };
        space.prototype.unsubscribe = function () {
            this.subject.unsubscribe(this);
        };
        return space;
    }());
    Keys.space = space;
})(Keys || (Keys = {}));
var Keys;
(function (Keys) {
    var up = (function () {
        function up(s) {
            this.subject = s;
            this.subject.subscribe(this);
        }
        up.prototype.notify = function () {
            Crosshair.yspeed = -5;
        };
        up.prototype.unsubscribe = function () {
            this.subject.unsubscribe(this);
        };
        return up;
    }());
    Keys.up = up;
})(Keys || (Keys = {}));
var Game = (function () {
    function Game() {
        this.ducks = [];
        this.gamerunning = false;
        this.score = 0;
        this.bullets = 2;
        this.lifes = 3;
        this.theyaregone = false;
        this.level = 0;
        this.mainthemesound = new Audio('http://raymondvandervelden.nl/school/Duckhunt/docs/sound/maintheme.mp3');
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
        Tools.util.playAudio("levelup.mp3");
        for (var _i = 0, _a = this.ducks; _i < _a.length; _i++) {
            var duck = _a[_i];
            duck.reset();
        }
        this.bullets += 3;
    };
    Game.prototype.endGame = function () {
        Tools.util.playAudio("gameover.wav");
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
            Tools.util.playAudio("gunshot.wav");
            for (var _i = 0, _a = this.ducks; _i < _a.length; _i++) {
                var duck = _a[_i];
                if (Tools.util.collision(duck.getLocation(), this.crosshair.getLocation())) {
                    duck.Behavior.onShot();
                }
            }
        }
        else {
            Tools.util.playAudio("empty.mp3");
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
var Tools;
(function (Tools) {
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
            audio.src = "http://raymondvandervelden.nl/school/Duckhunt/docs/sound/" + file;
            audio.load();
            audio.play();
        };
        util.randomIntFromInterval = function (min, max) {
            return Math.random() * (max - min + 1) + min;
        };
        return util;
    }());
    Tools.util = util;
})(Tools || (Tools = {}));
//# sourceMappingURL=main.js.map