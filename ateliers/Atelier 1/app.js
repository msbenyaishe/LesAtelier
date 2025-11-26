import { stats, updateScores, resetStats } from "./stats.js";

const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");
const tieScoreElement = document.getElementById("tie-score");
const resultElement = document.getElementById("result");
const resetButton = document.getElementById("reset");
const buttons = document.querySelectorAll(".btn-choice");

const choices = ["Pierre", "Feuille", "Ciseaux"];

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "tie";

  if (
    (playerChoice === "Pierre" && computerChoice === "Ciseaux") ||
    (playerChoice === "Feuille" && computerChoice === "Pierre") ||
    (playerChoice === "Ciseaux" && computerChoice === "Feuille")
  ) {
    return "player";
  }

  return "computer";
}

function updateUI() {
  playerScoreElement.textContent = stats.playerScore;
  computerScoreElement.textContent = stats.computerScore;
  tieScoreElement.textContent = stats.tieScore;
}

function handlePlayerChoice(event) {
  const playerChoice =
    event.target.id === "rock"
      ? "Pierre"
      : event.target.id === "paper"
      ? "Feuille"
      : "Ciseaux";

  const computerChoice = getComputerChoice();
  const winner = determineWinner(playerChoice, computerChoice);

  if (winner === "player") {
    resultElement.textContent = `Vous avez gagné ! ${playerChoice} bat ${computerChoice}.`;
  } else if (winner === "computer") {
    resultElement.textContent = `Vous avez perdu... ${computerChoice} bat ${playerChoice}.`;
  } else {
    resultElement.textContent = `Égalité ! Vous avez tous choisi ${playerChoice}.`;
  }

  updateScores(winner);
  updateUI();
}

function handleReset() {
  resetStats();
  updateUI();
  resultElement.textContent = "Scores réinitialisés. Choisissez pour commencer.";
}

buttons.forEach(button => {
  button.addEventListener("click", handlePlayerChoice);
});

resetButton.addEventListener("click", handleReset);

updateUI();
