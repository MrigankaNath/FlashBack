// Game configuration
let gameConfig = {
    speed: 500,
    multiplier: 2,
    flashDuration: 300
};

// Game state variables
let cubeSequence = [];
let playerSequence = [];
let cubeFaces = ["crimson", "emerald", "azure", "amber"];
let gameActive = false;
let currentStage = 0;
let currentDifficulty = 'medium';

// DOM elements
const statusDisplay = document.querySelector("h2");

// Initialize difficulty controls
function initializeDifficulty() {
    const buttons = document.querySelectorAll('.difficulty-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update game configuration
            gameConfig.speed = parseInt(this.dataset.speed);
            gameConfig.multiplier = parseInt(this.dataset.multiplier);
            gameConfig.flashDuration = gameConfig.speed * 0.6;
            
            // Update difficulty and reset game if active
            currentDifficulty = this.classList.contains('easy') ? 'easy' : 
                              this.classList.contains('hard') ? 'hard' : 'medium';
            
            if (gameActive) {
                resetGame();
            }
        });
    });
}

// Game start listener
document.addEventListener("keypress", function() {
    if (!gameActive) { 
        startGame();
    }
});

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    initializeDifficulty();
});

// Start new game
function startGame() {
    console.log("Game started on " + currentDifficulty + " difficulty");
    gameActive = true;
    currentStage = 0;
    cubeSequence = [];
    advanceStage();
}

// Visual feedback functions
function cubeIlluminate(face) {
    face.classList.add("flash"); 
    setTimeout(function() {
        face.classList.remove("flash"); 
    }, gameConfig.flashDuration);
}

function playerIlluminate(face) {
    face.classList.add("user-flash"); 
    setTimeout(function() {
        face.classList.remove("user-flash"); 
    }, gameConfig.flashDuration);
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

// Validate player sequence
function validateSequence() {
    let currentIndex = playerSequence.length - 1; 

    if (playerSequence[currentIndex] === cubeSequence[currentIndex]) {
        if (playerSequence.length === cubeSequence.length) {
            setTimeout(advanceStage, 1000);
        }
    } else {
        let finalScore = currentStage * gameConfig.multiplier;
        statusDisplay.innerHTML = `Game Over! Score: <b>${finalScore}</b> (${currentDifficulty} mode)<br> Press any key to restart`;
        document.body.style.backgroundColor = "#ff6b6b";
        setTimeout(function() {
            document.body.style.backgroundColor = "#f0f0f0";
        }, 200);
        resetGame();
    }
}

// Handle player input
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
