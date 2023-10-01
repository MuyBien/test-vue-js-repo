import { Team } from "./Team";

export class Match {

  homeTeam;
  awayTeams;

  constructor(match) {
    this.homeTeam = new Team(match.home);
    this.awayTeam = new Team(match.away);
  }

  getScore = () => {
    return [this.homeTeam.score, this.awayTeam.score];
  };

  getFinalScore = () => {
    const homeTeamGoals = this.homeTeam.getFinalTeamGoals();
    const awayTeamGoals = this.awayTeam.getFinalTeamGoals();

    return [homeTeamGoals.goals + awayTeamGoals.ownGoals, awayTeamGoals.goals + homeTeamGoals.ownGoals];
  };

}