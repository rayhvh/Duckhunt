/// <reference path="gameobject.ts" />

class Crosshair extends gameobject {

    private height: number = 64;
    private width: number = 64;
    private keymap = { 37: false, 38: false, 39: false, 40: false, 32: false }
    private speed: number = 6;

    constructor(x: number, y: number) {
        super(document.getElementById("container"), "crosshair", x, y);

        //luister naar spatie. 
        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e));
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e));

    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.keyCode in this.keymap) {
            this.keymap[event.keyCode] = true;
        }
        this.move();
    }

    private onKeyUp(event: KeyboardEvent) {
           // when space is pressed
        if (this.keymap[32]) {
            let g: Game = Game.getInstance(); // take game and check shot.
            g.checkShot();
            this.keymap[32] = false; // set space for false so not to trigger gun on accident.
        }
        if (event.keyCode in this.keymap) {
            this.keymap[event.keyCode] = false;
        }
        
    }

    private move(): void {
        // 37 is left. 38 is up. 39 is right and 40 is down. check if pressed and transform crosshair as such.
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
            this.x -= this.speed ;
            this.y += this.speed;
        }
        else if (this.keymap[37]) {
            this.x -= this.speed *2;
        }
        else if (this.keymap[38]) {
            this.y -= this.speed *2;
        }
        else if (this.keymap[39]) {
            this.x += this.speed *2;
        }
        else if (this.keymap[40]) {
            this.y += this.speed *2;
        }
        // draw
        this.div.style.transform = "translate(" + this.x + "px," + this.y + "px)";
    }

    public getLocation() {
        let location = { x: this.x, y: this.y, height: this.height, width: this.width };
        return location;
    }

}