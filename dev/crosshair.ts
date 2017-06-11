/// <reference path="gameobject.ts" />

class Crosshair extends gameobject implements Subject {

    private height: number = 64;
    private width: number = 64;

    private speed: number = 6;
    private keyObservers: Array<Observer> = new Array<Observer>();
    private releases: Array<Observer> = new Array<Observer>();

    static xspeed: number = 0;
    static yspeed: number = 0;


    constructor(x: number, y: number) {
        super(document.getElementById("container"), "crosshair", x, y);

        //luister naar spatie. 
        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e));
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e));

    }
    public subscribe(o: Observer): void {
        this.keyObservers.push(o);
     
    }
    public unsubscribe(o: Observer): void {
        // verwijder observer uit array
        let i: number = this.keyObservers.indexOf(o);
        if (i != -1) {
            this.keyObservers.splice(i, 1);
        }
    }

    private onKeyDown(event: KeyboardEvent) {

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

        for (let i = this.keyObservers.length - 1; i > -1; i--) {
            this.keyObservers[i].notify();
        }
        this.y = this.y + Crosshair.yspeed;
      
        this.x = this.x + Crosshair.xspeed;
        

        this.div.style.transform = "translate(" + this.x + "px," + this.y + "px)";
    }

    private onKeyUp(event: KeyboardEvent) {
        switch (event.keyCode) {
            case Keynumbers.LEFT:
                this.releases = this.keyObservers.filter(l => l instanceof Keys.left);
                break;
            case Keynumbers.UP:
                this.releases = this.keyObservers.filter(l => l instanceof Keys.up);
                break;
            case Keynumbers.RIGHT:
                this.releases = this.keyObservers.filter(l => l instanceof Keys.right);
                break;
            case Keynumbers.DOWN:
                this.releases = this.keyObservers.filter(l => l instanceof Keys.down);
                break;
            case Keynumbers.SPACE:
                let g: Game = Game.getInstance(); // take game and check shot.
                g.checkShot();
                this.releases = this.keyObservers.filter(l => l instanceof Keys.space);
                break;
        }
        for (let keyobserver of this.releases) {
            keyobserver.unsubscribe();
            Crosshair.xspeed =0;
            Crosshair.yspeed = 0;
        }

    }

    public getLocation() {
        let location = { x: this.x, y: this.y, height: this.height, width: this.width };
        return location;
    }

}