export class Match {

  id;
  isTournament;
  homeTeam;
  awayTeam;
  score;

  constructor (match = {}) {
    this.id = match.id;
    this.isTournament = match.isTournament;
    this.homeTeam = match.homeTeam;
    this.awayTeam = match.awayTeam;
    this.score = match.score;
  }

}