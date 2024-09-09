document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startButton");
  const gesture = document.getElementById("gesture");
  const video = document.getElementById("video");
  const gameResult = document.getElementById("gameResult");
  const scoreDisplay = document.getElementById("scoreDisplay");

  const modelUrl = "https://teachablemachine.withgoogle.com/models/Wyg-wcf0O/model.json";
  let userChoice = "";
  let classifier = ml5.imageClassifier(modelUrl, modelLoaded);

  let userScore = 0;
  let computerScore = 0;
  let roundsPlayed = 0;
  const totalRounds = 5;

  function updateScoreDisplay() {
    scoreDisplay.innerHTML = `User: ${userScore} | Computer: ${computerScore}`;
  }

  function modelLoaded() {
    console.log("Model Loaded");
    startVideo();
    updateScoreDisplay();
  }

  async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
    classifyGesture();
  }

  function classifyGesture() {
    classifier.classify(video, (results) => {
      userChoice = results[0].label;
      gesture.innerText = `Your gesture: ${userChoice}`;
      classifyGesture();
    });
  }

  startBtn.addEventListener("click", () => {
    if (userChoice) {
      playGame(userChoice);
    } else {
      gameResult.innerText = "Please make a gesture before starting the round!";
    }
  });

  function playGame(userChoice) {
    if (roundsPlayed >= totalRounds) return;

    let choices = ["Rock", "Paper", "Scissors"];
    let randomNumber = Math.floor(Math.random() * choices.length);
    let computerChoice = choices[randomNumber];
    let result = "";

    if (userChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (userChoice === "Rock" && computerChoice === "Scissors") ||
      (userChoice === "Scissors" && computerChoice === "Paper") ||
      (userChoice === "Paper" && computerChoice === "Rock")
    ) {
      result = "You win!";
      userScore++;
    } else {
      result = "You lose!";
      computerScore++;
    }

    roundsPlayed++;
    gameResult.innerText = `Computer chose: ${computerChoice}. ${result}`;
    updateScoreDisplay();

    if (roundsPlayed === totalRounds) {
      declareWinner();
    }
  }

  function declareWinner() {
    if (userScore > computerScore) {
      gameResult.innerText = `Game Over! You win the best of five! Final score: User ${userScore} - Computer ${computerScore}`;
    } else if (computerScore > userScore) {
      gameResult.innerText = `Game Over! Computer wins the best of five! Final score: User ${userScore} - Computer ${computerScore}`;
    } else {
      gameResult.innerText = `Game Over! It's a tie! Final score: User ${userScore} - Computer ${computerScore}`;
    }
    resetGame();
  }

  function resetGame() {
    userScore = 0;
    computerScore = 0;
    roundsPlayed = 0;
    updateScoreDisplay();
  }
});


