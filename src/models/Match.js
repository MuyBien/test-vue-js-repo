export class Match {

  homeTeam;
  awayTeams;
  score;

  constructor(match) {
    this.homeTeam = match.home;
    this.awayTeam = match.away;
  }

  getScore = () => {};

}