class player extends Entity{
    constructor(){
        super()

        this.x = 50;
        this.y = 50;
        this.r = 10;
        this.speed = 5;
    }
    draw(){
        getSpriteManager().drawSprite(context, 'Player', this.x, this.y);
    }
}