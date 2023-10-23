import { Match } from "./Match";

export class TournamentMatch extends Match {

  constructor (matchData) {
    super(matchData);
  }

  /**
   * Dans un tournoi, les 2 équipes sont considérées à domicile
   * Renvoi true ou false si le joueur marque un but MPG
   * @param {Player} player Le joueur à tester
   * @param {Array} teamAverages les moyennes des lignes de l'équipe adverse
   * @returns Boolean true si le joueur marque en MPG
   */
  isScoringMpgGoal = (player, teamAverages) => {
    const LINES_TO_PASS = {
      4: [2, 1],
      3: [3, 2, 1],
      2: [4, 3, 2, 1],
    };
    return LINES_TO_PASS[player.position].every((lineToPass, index) => {
      const dribbleMalus = this.getDribbleMalus(index);
      const playerNote = player.getTotalScore() - dribbleMalus;
      return playerNote >= teamAverages[lineToPass - 1];
    });
  };

  /**
   * Renvoi l'équipe qualifiée de ce match de tournoi
   */
  getQualified = () => {
    const finalScore = this.getFinalScore();
    if (finalScore[0] === finalScore[1]) {
      const homeTeamAverage = this.homeTeam.getTeamAverage();
      const awayTeamAverage = this.awayTeam.getTeamAverage();
      return homeTeamAverage - awayTeamAverage > 0 ? this.homeTeam : this.awayTeam;
    }
    return finalScore[0] - finalScore[1] > 0 ? this.homeTeam : this.awayTeam;
  };

}