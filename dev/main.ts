/// <reference path="duck.ts"/>
/// <reference path="crosshair.ts"/>

class Game {

    private engine : Matter.Engine;
    private static instance: Game;
    private crosshair: Crosshair;
    private ducks: Array<Duck> = [];
    private gamerunning: boolean = false;
    public score: number = 0;
    public bullets: number = 2;
    public lifes: number = 3;
    private theyaregone: boolean = false;
    public level: number = 0;
    private mainthemesound = new Audio('http://raymondvandervelden.nl/school/Duckhunt/docs/sound/maintheme.mp3');
    private constructor() {

    }
    public static getInstance() { // create singleton
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    initializeGame() {

       
        this.mainthemesound.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        this.mainthemesound.volume = 0.1;
        this.mainthemesound.play();
        document.getElementsByTagName("sound")[0].addEventListener("click", () => this.toggleMusic());

        // create crosshair to aim.
        this.crosshair = new Crosshair(368, 268);
        // create duck array.
        for (var i = 0; i < 3; i++) {
            this.ducks.push(new Duck(100, 100));
        }
        this.resetGame(); //Reset game to start first time
        requestAnimationFrame(() => this.gameLoop()); // call loop.
         
              //
        // SETUP MATTER WORLD
        //
        this.engine = Matter.Engine.create();

        var render = Matter.Render.create({
            element: document.body,
            engine: this.engine,
           options: {
           height: 100,
           width: 100
       }
        });

        Matter.Engine.run(this.engine);
        Matter.Render.run(render);
    
        //
        // ADD PHYSICS OBJECTS TO THE WORLD
        //
       
        let circ:Matter.Body = Matter.Bodies.circle(10,6,10);
        let ground:Matter.Body = Matter.Bodies.rectangle(1, 100, 30, 45, { isStatic: true });

        Matter.World.add(this.engine.world, [ circ, ground]);
    
    }

    private gameLoop() {
        //check if ducks are not dead or gone.
        if (this.areDucksGone()) {
            //if no lives. end game.
            if (this.lifes < 1) {
                this.endGame(); // stop loop. displays end. 
            }
            else { // if lives left. next level.
                this.resetGame();
                this.UpdateUI();
                requestAnimationFrame(() => this.gameLoop());
            }
        }
        else // ducks not gone? continue game.
        {
            for (let duck of this.ducks) {
                duck.update();
            }
            this.UpdateUI();
            requestAnimationFrame(() => this.gameLoop()); // repeat itself.
        }

    }
    public toggleMusic() {
        if (!this.mainthemesound.paused) {
            this.mainthemesound.pause();
        }
        else {
            this.mainthemesound.play();
        }
    }
    private areDucksGone() {
        this.theyaregone = true; // default is true
        for (let duck of this.ducks) {
            if (duck.gone == false) {
                this.theyaregone = false; // if duck is alive. duck gone will be set to false
            }
        }
        return this.theyaregone; // return if they are alive
    }

    public UpdateUI() { // display information about game
        document.getElementById("score").innerHTML = "Score:" + this.score
            + "</br> Level:" + this.level;
        document.getElementById("stats").innerHTML = "Bullets:" + this.bullets
            + "</br> Lifes:" + this.lifes;
    }

    private resetGame() {
        // increase level
        this.level += 1;

        Tools.util.playAudio("levelup.mp3");

        // restarting game by resetting ducks
        for (let duck of this.ducks) {
            duck.reset();
        }
        //new bullets
        this.bullets += 3;
    }
    private endGame() {
        //no more lives. end game.
        Tools.util.playAudio("gameover.wav");//play gameover sound
        document.getElementById("container").removeChild(document.getElementById("crosshair")); // remove crosshair DOM
        document.getElementById("container").removeChild(document.getElementById("score"));
        document.getElementById("container").removeChild(document.getElementById("stats"));
        let endmessage = document.createElement("endmessage");// create message html
        endmessage.setAttribute("id", "endmessage"); // add message id to html
        let container = document.getElementById("container").appendChild(endmessage); // find container and add endmessage
        endmessage.innerHTML = "GAME OVER <br> Score:" + this.score + "<br> Level:" + this.level; // make and show end message

    }


    checkShot() {
        if (this.bullets > 0) {
            Tools.util.playAudio("gunshot.wav");
            for (let duck of this.ducks) {
                if (Tools.util.collision(duck.getLocation(), this.crosshair.getLocation())) {
                    duck.Behavior.onShot();
                }
            }
        }
        else {
            Tools.util.playAudio("empty.mp3");
        }
        if (this.bullets > 0) { // dont remove bullet when 0
            this.bullets -= 1; // remove bullet because of shot
        }

    }
}


// load
window.addEventListener("load", function () {
    let g: Game = Game.getInstance();
    g.initializeGame();
});