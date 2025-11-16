
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let player = { x:170, y:550, w:70, h:20, speed:8, color:"lime" };
let balls = [];
let score = 0;
let paused = false;
let ballColor = "yellow";
let evilColor = "red";
let shapes = ["rect","round"];
let currentShape = 0;
let ballShapes = ["round","square"];
let currentBallShape = 0;

document.getElementById("pauseBtn").onclick = () => paused = !paused;
document.getElementById("colorBtn").onclick = () => {
    currentShape = (currentShape+1)%2;
};
document.getElementById("ballBtn").onclick = () => {
    currentBallShape = (currentBallShape+1)%2;
};

document.getElementById("leftBtn").ontouchstart = () => player.x -= player.speed*2;
document.getElementById("rightBtn").ontouchstart = () => player.x += player.speed*2;

document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft") player.x -= player.speed;
    if(e.key==="ArrowRight") player.x += player.speed;
});

function spawnBall(){
    balls.push({
        x: Math.random()*360+20,
        y: -20,
        r: 15,
        speed: 2 + Math.random()*4,
        evil: Math.random() < 0.2
    });
}

function drawPlayer(){
    ctx.fillStyle = player.color;
    if(shapes[currentShape]==="rect"){
        ctx.fillRect(player.x, player.y, player.w, player.h);
    } else {
        ctx.beginPath();
        ctx.roundRect(player.x, player.y, player.w, player.h, 10);
        ctx.fill();
    }
}

function drawBall(b){
    ctx.fillStyle = b.evil ? evilColor : ballColor;
    if(ballShapes[currentBallShape]==="round"){
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
        ctx.fill();
    } else {
        ctx.fillRect(b.x-b.r, b.y-b.r, b.r*2, b.r*2);
    }
}

function update(){
    if(paused){
        requestAnimationFrame(update);
        return;
    }

    ctx.clearRect(0,0,400,600);
    drawPlayer();

    balls.forEach((b,i)=>{
        b.y += b.speed;
        drawBall(b);

        if(b.y + b.r > player.y &&
           b.x > player.x &&
           b.x < player.x + player.w){

            if(b.evil){
                score--;
            } else {
                score++;
            }
            balls.splice(i,1);
        }

        if(b.y > 620){
            balls.splice(i,1);
        }
    });

    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.fillText("Score: "+score, 10, 30);

    if(score >= 30){
        alert("🎉 كسبت يا ابو عمو صل على النبي بق");
        score = 0;
    }

    if(score >= 5 && score <= 0){
        alert("❌خسرت يا ابو عمو ربنا يرزقك وتكسب!");
        score = 0;
    }

    requestAnimationFrame(update);
}

setInterval(spawnBall, 700);
update();
