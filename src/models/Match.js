import { Team } from "./Team";

const LINES_TO_PASS = {
  4: [2, 1],
  3: [3, 2, 1],
  2: [4, 3, 2, 1],
};

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

    const homeTeamMpgGoals = this.getMpgGoals();
    return [homeTeamGoals.goals + awayTeamGoals.ownGoals, awayTeamGoals.goals + homeTeamGoals.ownGoals];
  };

  /**
   * Renvoi les ID des joueurs marquant des buts MPG dans les 2 équipes du match
   * @returns Object avec un tableau de playerId mettant un but MPG à domicile et à l'extérieur
   */
  getMpgGoals = () => {
    const mpgGoals = {
      homeTeam: this.getTeamMpgGoals(true),
      awayTeam: this.getTeamMpgGoals(false),
    };
    return mpgGoals;
  };

  /**
   * Renvoi la liste des IDs de joueur qui marquent un but MPG
   * @param {Boolean} isHome Si le jueur joue à domicile ou non
   * @returns Array
   */
  getTeamMpgGoals = (isHome) => {
    const teamAverages = isHome ? this.awayTeam.getAverages() : this.homeTeam.getAverages();
    const potentialScorers = this.#getPotentialScorers(isHome);

    const teamGoals = potentialScorers
      .filter(player => player.getTotalScore() >= 5 && player.goals === 0 && player.position > 1)
      .filter(player => this.#isScoringMpgGoal(player, teamAverages, isHome))
      .map(player => player.playerId);

    return teamGoals;
  };

  /**
   * Renvoi la liste des joueurs pouvant marquer un but MPG
   * @param {Boolean} isHome Si le joueur joue à domicile ou non
   * @returns la liste des joueurs pouvant marquer un but MPG
   */
  #getPotentialScorers = (isHome) => {
    return isHome ? this.homeTeam.getFinalPlayers() : this.awayTeam.getFinalPlayers();
  };

  /**
   * Renvoi true ou false si le joueur marque un but MPG
   * @param {Player} player Le joueur à tester
   * @param {Array} teamAverages les moyennes des lignes de l'équipe adverse
   * @param {Boolean} isHome Le joueur joue à domicile ou non
   * @returns Boolean true si le joueur marque en MPG
   */
  #isScoringMpgGoal = (player, teamAverages, isHome) => {
    return LINES_TO_PASS[player.position].every((lineToPass, index) => {
      const dribbleMalus = this.#getDribbleMalus(index);
      const playerNote = player.getTotalScore() - dribbleMalus;
      return isHome ? playerNote >= teamAverages[lineToPass - 1] : playerNote > teamAverages[lineToPass - 1];
    });
  };

  /**
   * 
   * @param {Number} lineIndex le nombre de ligne déjà passée
   * @returns le malus à appliquer à la note pour calculer la suite du but MPG (0 = 0, 1 = 1, 2 = 1.5, 3 = 2)
   */
  #getDribbleMalus = (lineIndex) => {
    const DRIBBLE_MALUS_BASE = 0;
    const DRIBBLE_MALUS_INCREMENT = 0.5;

    return lineIndex === 0 ? DRIBBLE_MALUS_BASE : (lineIndex + 1) * DRIBBLE_MALUS_INCREMENT;
  };

}