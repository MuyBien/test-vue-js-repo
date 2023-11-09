export class Match {

  id;
  homeTeam;
  awayTeam;
  score;

  constructor (match = {}) {
    this.id = match.id;
    this.homeTeam = match.homeTeam;
    this.awayTeam = match.awayTeam;
    this.score = match.score;
  }

}