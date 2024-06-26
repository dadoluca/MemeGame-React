function Round(roundNumber, score, imagePath) {
    this.roundNumber = roundNumber;
    this.score = score;
    this.imagePath = imagePath;
}

function Game(date, totalScore, rounds) {
    this.date = date;
    this.totalScore = totalScore;
    this.rounds = rounds; // An array of Round objects
}

export { Game, Round };
