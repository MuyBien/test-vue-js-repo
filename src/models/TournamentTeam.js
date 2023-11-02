import { roundFloat } from "@/utils/math";
import { Team } from "./Team";

export class TournamentTeam extends Team {

  constructor (team, blockTacticalSubs = false) {
    super(team, blockTacticalSubs);
    this.name = team.abbreviation;
  }

  /**
   * Renvoi la moyenne de l'équipe (sans bonus défensif)
   * @returns { Number } la moyenne de l'équipe
   */
  getTeamAverage = () => {
    const teamAverage = this.finalPlayers.reduce((total, player) => {
      const noDefBonusPlayer = player.getWhithoutDefBonus();
      return total + noDefBonusPlayer.getTotalScore();
    }, 0) / this.finalPlayers.length;
    return roundFloat(teamAverage, 2);
  };
}