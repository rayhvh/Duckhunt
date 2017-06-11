class Flying implements DuckBehavior {
    duck: Duck;
    g: Game;
    constructor(duck: Duck) {
        this.duck = duck;
        this.g = Game.getInstance();
    }

    public performBehavior() {
        this.duck.x += this.duck.sidespeed;//new location
        this.duck.y -= this.duck.upspeed;

        if (this.duck.x > 738 || this.duck.x < 0) { // when duck hits the wall
            this.duck.sidespeed -= (this.duck.sidespeed * 2); // change direction
        }


        if (this.duck.sidespeed < 0) {// face left if moving left
            this.duck.div.style.backgroundImage = "url('images/duckleft.gif')";
        }
        else { // face right
            this.duck.div.style.backgroundImage = "url('images/duck.gif')"
        }

        if (this.duck.y < -64 && this.duck.gone == false) // when duck leaves field its considered gone, excute once.
        {
            this.duck.gone = true;
            if (this.g.lifes > 0) { // only take life if there are left
                this.g.lifes -= 1;
            }
            
        }
        // tekenen
        this.duck.div.style.transform = " translate(" + this.duck.x + "px," + this.duck.y + "px)";
    }
    onShot() {
        this.g.score += 1000; // inscrease score in game here so that there is just one excution. 
        this.duck.Behavior = new Falling(this.duck);  // on shot it changes to falling.
        Tools.util.playAudio("hit.mp3");// play hit celebration sound
    }


}

