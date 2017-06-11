namespace Keys {
    export class down implements Observer {
        subject: Subject;
        constructor(s: Subject) {
            this.subject = s;
            this.subject.subscribe(this);
        }
        public notify() {
            Crosshair.yspeed = 5;
        }
        public unsubscribe() {
            this.subject.unsubscribe(this);
        }
    }
}