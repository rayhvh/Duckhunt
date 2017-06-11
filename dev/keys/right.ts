namespace Keys {
    export class right implements Observer {
        subject: Subject;
        constructor(s: Subject) {
            this.subject = s;
            this.subject.subscribe(this);
        }
        public notify() {
            Crosshair.xspeed = 5;
        }
        public unsubscribe() {
            this.subject.unsubscribe(this);
        }
    }
}
