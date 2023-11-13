import { Team } from "../teams/Team";

export class Match {

  id;
  isTournament;
  homeTeam;
  awayTeam;
  score;

  constructor (match = {}) {
    this.id = match.id;
    this.isTournament = match.isTournament;
    this.homeTeam = new Team(match.homeTeam);
    this.awayTeam = new Team(match.awayTeam);
    this.score = match.score;
  }

}