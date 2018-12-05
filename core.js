var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

height = canvas.height;
width = canvas.width;

var ball_speed = 5;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var upPressed = false;
var downPressed = false;

var score = 0;
var level = 1;

var start = Date.now();

var audio = new Audio('sound.mp3')
// Keys logic

function distance(x1, x2, y1, y2){
    return Math.sqrt(Math.pow((x1 - x2),2)+Math.pow((y1 - y2), 2));
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    else if(e.keyCode == 32){
        spacePressed = true;
    }
    else if(e.keyCode == 38){
        upPressed = true;
    }
    else if(e.keyCode == 40){
        downPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    else if(e.keyCode == 32){
        spacePressed = false;
    }
    else if(e.keyCode == 40){
        downPressed = false;
    }
    else if(e.keyCode == 38){
        upPressed = false;
    }
}


// Player class
var Player = function(){
    this.init = function(x,y,r,speed){
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = speed;
        this.name = "Test"
    }
    this.move = function(){
        if (rightPressed && (this.x + this.r +this.speed < width)){
            this.x += this.speed;
        }
        if (leftPressed && (this.x - this.r - this.speed > 0)){
            this.x -= this.speed;
        }
        if (downPressed && (this.y + this.r + this.speed < height)){
            this.y += this.speed;
        }
        if (upPressed && (this.y - this.r - this.speed > 0)){
            this.y -= this.speed;
        }
    }
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = "#F87217"
        ctx.fill();
        ctx.closePath();
    }
}

//Ball class
var Ball = function(){
    this.init = function(x, y, r, dx, dy){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
    }
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = "#F87217"
        ctx.fill();
        ctx.closePath();
    }
    this.move = function(distance){
        if(this.x + this.dx > width-this.r || this.x + this.dx < this.r) {
            this.dx *= -1;
        }
        if(this.y + this.dy > height-this.r || this.y + this.dy < this.r) {
            this.dy *= -1;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.dx *=0.99;
        this.dy *=0.99;
    }
}

var Goal = function(){
    this.init = function(r, type){
        this.r = r;
        this.type = Math.floor(Math.random()*4);
        this.scored = false;
        this.score = 0;
        this.level = 1;
        switch(this.type){
            case 0:
                this.x = width/2;
                this.y = 0;
                break;
            case 1:
                this.x = width/2;
                this.y = height;
                break;
            case 2:    
                this.x = width;
                this.y = height/2;
                break;
            case 3:  
                this.x = 0;
                this.y = height/2;
                break;
        }
    }

    this.initGK = function(r){
        this.Goalkeeper.x = this.x;
        this.Goalkeeper.y = this.y;
        this.Goalkeeper.type = this.type;
        this.Goalkeeper.r = r;
        switch(this.type){
            case 0:
                this.Goalkeeper.startAngle = 0;
                this.Goalkeeper.endAngle =Math.PI; 
                break;
            case 1:
                this.Goalkeeper.startAngle = 0;
                this.Goalkeeper.endAngle = Math.PI;
                break;
            case 2:
                this.Goalkeeper.startAngle = Math.PI/2;
                this.Goalkeeper.endAngle = 3*Math.PI/2;
                break;
            case 3:
                this.Goalkeeper.startAngle = Math.PI/2;
                this.Goalkeeper.endAngle = 3*Math.PI/2;
                break;
        }
        this.Goalkeeper.angle = this.Goalkeeper.startAngle;
    }

    this.moveGK = function(){
        if ((this.Goalkeeper.angle + this.Goalkeeper.speed > this.Goalkeeper.endAngle)
            ||(this.Goalkeeper.angle + this.Goalkeeper.speed < this.Goalkeeper.startAngle)){
                this.Goalkeeper.speed *= -1;
        }
        switch(this.type){
            case 0:
                this.Goalkeeper.x = this.x + Math.cos(this.Goalkeeper.angle) * this.r;
                this.Goalkeeper.y = this.y + Math.sin(this.Goalkeeper.angle) * this.r;
                break;
            case 1:
                this.Goalkeeper.x = this.x + Math.cos(this.Goalkeeper.angle) * this.r;
                this.Goalkeeper.y = this.y - Math.sin(this.Goalkeeper.angle) * this.r;
                break;
            case 2:
                this.Goalkeeper.x = this.x + Math.cos(this.Goalkeeper.angle) * this.r;
                this.Goalkeeper.y = this.y - Math.sin(this.Goalkeeper.angle) * this.r;
                break;
            case 3:
                this.Goalkeeper.x = this.x - Math.cos(this.Goalkeeper.angle) * this.r;
                this.Goalkeeper.y = this.y - Math.sin(this.Goalkeeper.angle) * this.r;
                break;
        }
        
        this.Goalkeeper.angle += this.Goalkeeper.speed;
    }

    this.draw = function(){
        ctx.beginPath();
        ctx.lineWidth=4;
        switch(this.type){
            case 0:
                ctx.arc(this.x, this.y, this.r, 0, Math.PI, false);
                break;
            case 1:
                ctx.arc(this.x, this.y, this.r, Math.PI, 0, false);
                break;
            case 2:
                ctx.arc(this.x, this.y, this.r, Math.PI/2, 3*Math.PI/2, false);
                break;
            case 3:
                ctx.arc(this.x, this.y, this.r, 3*Math.PI/2, Math.PI/2, false);
                break;
        }
        ctx.strokeStyle = "#1589FF";
        ctx.stroke();
        ctx.closePath();
    }

    this.drawGK = function(){
        ctx.beginPath();
        ctx.arc(this.Goalkeeper.x, this.Goalkeeper.y, this.Goalkeeper.r, 0, Math.PI*2);
        ctx.fillStyle = "#F87217"
        ctx.fill();
        ctx.closePath();
    }

    this.Goalkeeper = {
        x: 0,
        y: 0,
        type: 0,
        r: 0,
        speed: Math.PI/160,
        angle: 0,
        startAngle: 0,
        endAngle: 0,
    }
}


var Game = function(){
    this.init = function(player, ball, goal){
        this.player = player;
        this.ball = ball;
        this.goal = goal;
    }

    this.play = function(){
        audio.play();

        if (score > 2*level){
            level += 1;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (level == 1){
            if (this.goal.scored){
                this.goal.init(70);
            }
            this.goal.draw();
            this.player.draw();
            this.ball.draw();
            this.distanceP = distance(this.player.x, this.ball.x, this.player.y, this.ball.y);
            if(this.distanceP<this.ball.r + this.player.r + this.ball.dx)
              {
                this.ball.dx = ((this.ball.x - this.player.x)/30)*ball_speed;
                this.ball.dy = ((this.ball.y - this.player.y)/30)*ball_speed;
            }
            this.distanceG = distance(this.goal.x, this.ball.x,this.goal.y, this.ball.y);
            if(this.distanceG<this.ball.r + this.goal.r + this.ball.dx)
            {
                score += 1;
                this.goal.scored = true;
            }
        }
        else{
            if (this.goal.scored){
                this.goal.init(70);
                this.goal.initGK(30);
            }
            this.goal.draw();
            this.player.draw();
            this.ball.draw();
            this.goal.drawGK();
            this.distanceP = distance(this.player.x, this.ball.x, this.player.y, this.ball.y);
            if(this.distanceP<this.ball.r + this.player.r + this.ball.dx)
            {
                this.ball.dx = ((this.ball.x - this.player.x)/30)*ball_speed;
                this.ball.dy = ((this.ball.y - this.player.y)/30)*ball_speed;
            }
            this.distanceG = distance(this.goal.x, this.ball.x,this.goal.y, this.ball.y);
            if(this.distanceG<this.ball.r + this.goal.r + this.ball.dx)
            {
                score += 1;
                this.goal.scored = true;
            }
            this.distanceGK = distance(this.goal.Goalkeeper.x, this.ball.x, this.goal.Goalkeeper.y, this.ball.y);
            if(this.distanceGK<this.ball.r + this.goal.Goalkeeper.r + this.ball.dx)
            {
                this.ball.dx = ((this.ball.x - this.goal.Goalkeeper.x)/30)*ball_speed;
                this.ball.dy = ((this.ball.y - this.goal.Goalkeeper.y)/30)*ball_speed;
            }
            this.goal.moveGK();
        }
        this.ball.move();
        this.player.move();
         
        document.getElementById("demo").innerHTML = score;
    }
}

player = new Player();
player.init(0, 0, 30, 2);
ball = new Ball();
ball.init(20,20,10,5,5);
goal = new Goal();
goal.init(70, Math.floor(Math.random()*4));
//goal.initGK(30);

game = new Game();
game.init(player, ball, goal);

setInterval(game.play, 10);