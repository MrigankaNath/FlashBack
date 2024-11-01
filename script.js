let cubeSequence = [];
let playerSequence = [];

let cubeFaces = ["crimson", "emerald", "azure", "amber"];

let gameActive = false;
let currentStage = 0;

let statusDisplay = document.querySelector("h2");

document.addEventListener("keypress", function() {
    if (!gameActive) { 
        console.log("Challenge initiated");
        gameActive = true;
        currentStage = 0;  
        cubeSequence = []; 
        advanceStage();
    }
});

function cubeIlluminate(face) {
    face.classList.add("flash"); 
    setTimeout(function() {
        face.classList.remove("flash"); 
    }, 300);
}

function playerIlluminate(face) {
    face.classList.add("user-flash"); 
    setTimeout(function() {
        face.classList.remove("user-flash"); 
    }, 300);
}

function advanceStage() {
    playerSequence = []; 
    currentStage++;
    statusDisplay.innerText = `Stage ${currentStage}`;

    let randomIndex = Math.floor(Math.random() * 4); 
    let randomColor = cubeFaces[randomIndex];
    let randomFace = document.querySelector(`.${randomColor}`);

    cubeSequence.push(randomColor);
    setTimeout(() => cubeIlluminate(randomFace), 500);
}

function validateSequence() {
    let currentIndex = playerSequence.length - 1; 

    if (playerSequence[currentIndex] === cubeSequence[currentIndex]) {
        if (playerSequence.length === cubeSequence.length) {
            setTimeout(advanceStage, 1000);  
        }
    } else {
        statusDisplay.innerHTML = `Game Over! Your Score: <b>${currentStage}</b><br> Press any key to restart`;
        document.body.style.backgroundColor = "#ff6b6b";
        setTimeout(function() {
            document.body.style.backgroundColor = "#f0f0f0";
        }, 200);
        resetGame();
    }
}

function faceActivated() {
    let face = this;
    playerIlluminate(face);

    let selectedColor = face.getAttribute("id");
    playerSequence.push(selectedColor);

    validateSequence();
}

let allFaces = document.querySelectorAll(".cube-face");
for (let face of allFaces) {  
    face.addEventListener("click", faceActivated);
}

function resetGame() {
    gameActive = false;
    cubeSequence = [];
    playerSequence = [];
    currentStage = 0;
}