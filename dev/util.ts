class util {

    public static collision(instance1, instance2) {
        if (instance1.x < instance2.x + instance2.width &&
            instance1.x + instance1.width > instance2.x &&
            instance1.y < instance2.y + instance2.height &&
            instance1.height + instance1.y > instance2.y) {


            return true;
        }
    }
    public static playAudio(file: string) {
        var audio = new Audio();
        audio.src = "http://raymondvandervelden.nl/school/Duckhunt/docs/sound/" + file;
        audio.load();
        audio.play();
    }
    public static randomIntFromInterval(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
}