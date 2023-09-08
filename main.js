
//Board Variables

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//Bird Variables

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;


let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height: birdHeight 
}

//Pipes Variables
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Game Physics
let velocityX = -2; // Pipes Moving Left
let velocityY = 0; // Bird Jump Speed
let gravity = 0.4; // Game Gravity. 

let gameOver = false;
let score = 0;

//Board Initialization

window.onload = () => {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //Draw The Bird

    birdImg = new Image();
    birdImg.src = "./ghost.png";

    //Load Bird Image

    birdImg.onload = () => {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //Load Pipe Image

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";


    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird , restart);
};

const update = () =>{
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //Draw Bird 
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);       

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height){
        gameOver = true;
    }

    //Draw Pipes
    for (let i = 0; i < pipeArray.length; i++ ){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5 ;
            pipe.passed = true;
        }

        if (detectCollision (bird, pipe)){
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x  < -pipeWidth){
        pipeArray.shift();
    }

        //Score Counter

    context.fillStyle = "RED";
    context.font = "45px 'Rubik Wet Paint', cursive";
    context.fillText(score, 5, 45);

        //Game Over

    if (gameOver){
        context.fillText("GAME OVER", 50, 330)
    }

    
}

const placePipes = () => {

    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false 
    }  

    pipeArray.push(topPipe);
    
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false 
    }  

    pipeArray.push(bottomPipe);
}

const moveBird = (e) => {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //Making The Bird Jump
        velocityY = -6;
    } else if (e.code == "Enter") {
        if (gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

const restart = (e) => {
    if(e.code == "Enter"){
        if (gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}
   

const detectCollision = (a,b) =>{

    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
}