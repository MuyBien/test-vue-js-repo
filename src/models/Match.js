import { Team } from "./Team";

export class Match {

  homeTeam;
  awayTeams;
  score;

  constructor(match) {
    this.homeTeam = new Team(match.home);
    this.awayTeam = new Team(match.away);
  }

  getScore = () => {
    return [this.homeTeam.score, this.awayTeam.score];
  };

}