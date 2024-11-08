// Game configuration
let gameConfig = {
    speed: 800,
    multiplier: 1,
    flashDuration: 400
};

// Game state variables
let cubeSequence = [];
let playerSequence = [];
let cubeFaces = ["crimson", "emerald", "azure", "amber"];
let gameActive = false;
let currentStage = 0;

// DOM elements
const statusDisplay = document.querySelector("h2");

// Get the audio elements
const cubeFlashAudio = document.getElementById('cube-flash');
const correctSequenceAudio = document.getElementById('correct-sequence');
const gameOverAudio = document.getElementById('game-over');
const clickAudio = document.getElementById('click');  

// Game start listener
document.addEventListener("keypress", function() {
    if (!gameActive) { 
        startGame();
    }
});

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
});

// Start new game
function startGame() {
    console.log("Game started");
    gameActive = true;
    currentStage = 0;
    cubeSequence = [];
    advanceStage();
}

// Visual feedback functions
function cubeIlluminate(face) {
    face.classList.add("flash");
    playCubeFlashSound();  
    setTimeout(function() {
        face.classList.remove("flash");
    }, gameConfig.flashDuration);
}

function playerIlluminate(face) {
    face.classList.add("user-flash");
    playClickSound();  
    setTimeout(function() {
        face.classList.remove("user-flash");
    }, gameConfig.flashDuration);
}

// Play sound effects
function playCubeFlashSound() {
    cubeFlashAudio.currentTime = 0;
    cubeFlashAudio.play();
}

function playCorrectSequenceSound() {
    correctSequenceAudio.currentTime = 0;
    correctSequenceAudio.play();
}

function playGameOverSound() {
    gameOverAudio.currentTime = 0;
    gameOverAudio.play();
}

function playClickSound() {
    clickAudio.currentTime = 0;
    clickAudio.play(); 
}

// Advance to next stage
function advanceStage() {
    playerSequence = []; 
    currentStage++;
    
    let adjustedScore = currentStage * gameConfig.multiplier;
    statusDisplay.innerText = `Stage ${currentStage} | Score: ${adjustedScore}`;
    statusDisplay.classList.add('level-up');
    setTimeout(() => statusDisplay.classList.remove('level-up'), 500);

    let randomIndex = Math.floor(Math.random() * 4); 
    let randomColor = cubeFaces[randomIndex];
    cubeSequence.push(randomColor);
    
    setTimeout(() => playFullSequence(), 500);
}

// Play the full sequence
function playFullSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= cubeSequence.length) {
            clearInterval(interval);
            return;
        }
        let face = document.querySelector(`.${cubeSequence[i]}`);
        cubeIlluminate(face);
        i++;
    }, gameConfig.speed);
}

// Validating player sequence
function validateSequence() {
    let currentIndex = playerSequence.length - 1; 

    if (playerSequence[currentIndex] === cubeSequence[currentIndex]) {
        if (playerSequence.length === cubeSequence.length) {
            setTimeout(() => {
                playCorrectSequenceSound();
                advanceStage();
            }, 1000);
        }
    } else {
        let finalScore = currentStage * gameConfig.multiplier;
        statusDisplay.innerHTML = `Game Over! Score: <b>${finalScore}</b><br> Press any key to restart`;
        document.body.style.backgroundColor = "#ff6b6b";
        setTimeout(function() {
            document.body.style.backgroundColor = "#f0f0f0";
        }, 200);
        playGameOverSound();
        resetGame();
    }
}

// Handling player input
function faceActivated() {
    if (!gameActive) return;
    
    let face = this;
    playerIlluminate(face);  

    let selectedColor = face.getAttribute("id");
    playerSequence.push(selectedColor);

    validateSequence();
}

// Add click listeners to all faces
let allFaces = document.querySelectorAll(".cube-face");
for (let face of allFaces) {  
    face.addEventListener("click", faceActivated);
}

// Reset game state
function resetGame() {
    gameActive = false;
    cubeSequence = [];
    playerSequence = [];
    currentStage = 0;
}
