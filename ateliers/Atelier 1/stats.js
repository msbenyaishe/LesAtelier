export const stats = {
  playerScore: 0,
  computerScore: 0,
  tieScore: 0,
};

export function updateScores(winner) {
  if (winner === "player") {
    stats.playerScore++;
  } else if (winner === "computer") {
    stats.computerScore++;
  } else if (winner === "tie") {
    stats.tieScore++;
  }
}

export function resetStats() {
  stats.playerScore = 0;
  stats.computerScore = 0;
  stats.tieScore = 0;
}
