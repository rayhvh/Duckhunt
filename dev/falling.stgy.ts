class Falling implements DuckBehavior {
    duck: Duck;
    constructor(duck: Duck) {
        this.duck = duck;
    }

    public performBehavior() {
        
        this.duck.y += 2; // make duck fall down
        //change bg to deadduck
        this.duck.div.style.backgroundImage = "url('images/deadduck.gif')";
        // draw
        this.duck.div.style.transform = " translate(" + this.duck.x + "px," + this.duck.y + "px)";
        // if duck fell down out of screen its gone
        if (this.duck.y > 600){
             this.duck.gone = true;
        }
    }
    onShot() {
        //easter egg double kill
    }


}

