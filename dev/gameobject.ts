abstract class gameobject
{
    protected x:number;
    protected y:number;
    protected div:HTMLElement;

    constructor(targetElement:HTMLElement, htmlString:string, x:number, y:number){

        this.div = document.createElement(htmlString);
        this.div.setAttribute("id",htmlString);
        targetElement.appendChild(this.div);
        this.x = x;
        this.y = y;
        this.div.style.transform = "translate(" + this.x + "px," + this.y + "px)";
    }

}
