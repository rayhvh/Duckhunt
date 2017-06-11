/// <reference path="gameobject.ts" />

class Duck extends gameobject {


    private height: number = 64;
    private width: number = 64;
    public x: number;
    public y: number;
    public upspeed: number = 0.5;
    public sidespeed: number = 1.0;
    public div: HTMLElement;
    public gone: boolean = false;
    Behavior: DuckBehavior;

    constructor(x: number, y: number) {
        super(document.getElementById("container"), "duck", x, y);
    }

    public update() {
        this.Behavior.performBehavior();
    }

    public reset() { // wordt ook 1e keer aangeroepen 
       
        this.Behavior = new Flying(this); // make duck alive
        let g: Game = Game.getInstance(); // take game
        let multiplier = g.level / 10;
        this.sidespeed = Tools.util.randomIntFromInterval(-0.5,0.5) + multiplier; // willekeurig getal tussen -0.5 en 0.5. vermendigvuldingen met 1/10 van leven waarde
        this.upspeed = Tools.util.randomIntFromInterval(30,50) / 100 + multiplier ; // willekeurig getal tussen 0.5 en 1.5. 
        this.gone = false; // reset gone value of current duck
        this.x = Tools.util.randomIntFromInterval(64,738); // place duck horizontal somewhere betwen 64 to 738 in the field
        this.y = Tools.util.randomIntFromInterval(550,750); // placement vertical between - 550 and 750
        console.log("Verticaal:" + this.sidespeed + " Horizontaal" + this.upspeed);
       
    

    }

    public getLocation() {
        let location = { x: this.x, y: this.y, height: this.height, width: this.width };
        return location;
    }

}