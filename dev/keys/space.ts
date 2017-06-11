namespace Keys {
    export class space implements Observer {
      subject:Subject;
        constructor(s: Subject) {
            this.subject = s;
            this.subject.subscribe(this);
        }
        public notify() {
            
        }
            public unsubscribe() {
             this.subject.unsubscribe(this);
        }
    }
}