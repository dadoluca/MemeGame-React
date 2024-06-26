class Game {
    constructor(date, totalScore, rounds, SERVER_URL) {
      this.date = date;
      this.totalScore = totalScore;
      this.rounds = rounds.map(round => new Round(round.roundNumber, SERVER_URL + round.imagePath, round.score));
    }
  }
  
  class Round {
    constructor(roundNumber, imageUrl, score) {
      this.roundNumber = roundNumber;
      this.imageUrl = imageUrl;
      this.score = score;
    }
  }
  
  export { Game, Round };
  