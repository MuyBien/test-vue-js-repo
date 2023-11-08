import { Team } from "./teams/Team";

export class Match {

  id;
  homeTeam;
  awayTeams;

  constructor (match) {
    this.id = match.id;

    this.homeTeam = new Team(match.home);
    this.awayTeam = new Team(match.away);
  }

}