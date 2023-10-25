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

      if (homeTeamAverage > awayTeamAverage) {
        return this.homeTeam;
      } else if (awayTeamAverage > homeTeamAverage) {
        return this.awayTeam;
      }

      // Compare par lignes (Forward, Middle, Backer, Goalkeeper)
      const homeTeamLinesAverages = this.homeTeam.getAverages();
      const awayTeamLinesAverages = this.awayTeam.getAverages();

      for (let line = 3; line >= 0; line--) {
        const lineAverageDiff = homeTeamLinesAverages[line] - awayTeamLinesAverages[line];
        if (lineAverageDiff !== 0) {
          return lineAverageDiff > 0 ? this.homeTeam : this.awayTeam;
        }
      }

      return undefined; // Aucune équipe n'est qualifiée
    } else {
      return finalScore[0] - finalScore[1] > 0 ? this.homeTeam : this.awayTeam;
    }
  };

}