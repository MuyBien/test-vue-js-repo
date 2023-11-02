import { Team } from "./Team";

export class Match {

  id;
  homeTeam;
  awayTeams;
  goalkeeperSaves;

  constructor (match) {
    this.id = match.id;

    this.homeTeam = new Team(match.home, match.away.bonuses.blockTacticalSubs);
    this.awayTeam = new Team(match.away, match.home.bonuses.blockTacticalSubs);

    this.setMpgGoals();
    this.goalkeeperSaves = this.getGoalkeeperSaves();

    this.applyBonus();
  }

  getScore = () => {
    return [this.homeTeam.score, this.awayTeam.score];
  };

  getFinalScore = () => {
    const homeTeamGoals = this.homeTeam.getFinalTeamGoals();
    const awayTeamGoals = this.awayTeam.getFinalTeamGoals();

    return [
      homeTeamGoals.goals + awayTeamGoals.ownGoals - this.goalkeeperSaves.homeTeam.length,
      awayTeamGoals.goals + homeTeamGoals.ownGoals - this.goalkeeperSaves.awayTeam.length,
    ];
  };

  /**
   * Renvoi les scores possibles si on remplace un à un les joueurs d'une équipe par Rotaldo (sauf si déjà Rotaldo)
   * @param { Team } team l'équipe à tester
   * @param { Boolean } isTacticalSubsBlocked la façon doit être recalculer l'équipe initiale (si bonus  = pas de RT)
   * @param { Number } additionalRotaldoIndex l'index d'un joueur qui est déjà Rotaldo (suite à un autre bonus)
   * @returns { Array } tous les scores possibles
   */
  #getScoresForAllPossibleRotaldoInTeam = (team, isTacticalSubsBlocked, additionalRotaldoIndex) => {
    const scores = [];
    for (let index = 1; index < 11; index ++) {
      if (additionalRotaldoIndex) {
        team.applyRotaldoSubstitution(additionalRotaldoIndex);
      }
      if (team.getFinalPlayers()[index].lastName === "Rotaldo") {
        continue;
      }
      team.applyRotaldoSubstitution(index);
      this.resetMpgGoals();
      const score = this.getFinalScore();
      scores.push(score);
      team.calculateFinalPlayers(isTacticalSubsBlocked);
    }
    return scores;
  };

  /**
   * Renvoi les scores possibles si on remplace un à un les joueurs des 2 équipes du match par Rotaldo (sauf si déjà Rotaldo)
   * @returns { Array } tous les scores possibles
   */
  #getScoresForAllPossibleRotaldoAllTeams = () => {
    const scores = [];
    for (let index = 1; index < 11; index ++) { // 2 Rotaldo for homeTeam
      if (this.homeTeam.getFinalPlayers()[index].lastName === "Rotaldo") {
        continue;
      }
      this.homeTeam.applyRotaldoSubstitution(index);
      scores.push(...this.#getScoresForAllPossibleRotaldoInTeam(this.homeTeam, this.awayTeam.bonuses?.value.blockTacticalSubs, index));
      this.homeTeam.calculateFinalPlayers(this.awayTeam.bonuses?.value.blockTacticalSubs);
    }
    for (let index = 1; index < 11; index ++) { // 1 Rotaldo for homeTeam, 1 for awayTeam
      if (this.homeTeam.getFinalPlayers()[index].lastName === "Rotaldo") {
        continue;
      }
      this.homeTeam.applyRotaldoSubstitution(index);
      scores.push(...this.#getScoresForAllPossibleRotaldoInTeam(this.awayTeam, this.homeTeam.bonuses?.value.blockTacticalSubs));
      this.homeTeam.calculateFinalPlayers(this.awayTeam.bonuses?.value.blockTacticalSubs);
    }
    for (let index = 1; index < 11; index ++) { // 2 Rotaldo for awayTeam
      if (this.awayTeam.getFinalPlayers()[index].lastName === "Rotaldo") {
        continue;
      }
      this.awayTeam.applyRotaldoSubstitution(index);
      scores.push(...this.#getScoresForAllPossibleRotaldoInTeam(this.awayTeam, this.homeTeam.bonuses?.value.blockTacticalSubs, index));
      this.awayTeam.calculateFinalPlayers(this.homeTeam.bonuses?.value.blockTacticalSubs);
    }
    for (let index = 1; index < 11; index ++) { // 1 Rotaldo for awayTeam, 1 for homeTeam
      if (this.awayTeam.getFinalPlayers()[index].lastName === "Rotaldo") {
        continue;
      }
      this.awayTeam.applyRotaldoSubstitution(index);
      scores.push(...this.#getScoresForAllPossibleRotaldoInTeam(this.homeTeam, this.awayTeam.bonuses?.value.blockTacticalSubs));
      this.awayTeam.calculateFinalPlayers(this.homeTeam.bonuses?.value.blockTacticalSubs);
    }
    return scores;
  };

  /**
   * Renvoi la probabilité d'un score unqiue dans une liste de scores
   * @param { Array } scores les scores à calculer
   * @returns { Obkect } tous les scores uniques et leurs pourcentages
   */
  #getScoresPoucentages = (scores) => {
    const uniqueScores = Array.from(new Set(scores.map(JSON.stringify)), JSON.parse);
    const pourcentages = uniqueScores.map(uniqueScore => {
      const occurences = scores.filter(score => JSON.stringify(score) === JSON.stringify(uniqueScore)).length;
      const pourcentage = (occurences / scores.length) * 100;
      return {
        score: uniqueScore,
        pourcentage,
      };
    });
    pourcentages.sort((a, b) => b.pourcentage - a.pourcentage);
    return pourcentages;
  };

  /**
 * Renvoi les scores probables selon le nombre de bonus Chapron Rouge
 * @returns { Object } La liste des scores uniques ainsi que leur probabilité
 */
  getScoreProbabilities = () => {
    const bonusNumber = Number(this.homeTeam.bonus.value === "removeRandomPlayer") + Number(this.awayTeam.bonus.value === "removeRandomPlayer");
    if (bonusNumber > 0) {
      const scores = [];
      if (bonusNumber < 2) {
        scores.push(...this.#getScoresForAllPossibleRotaldoInTeam(this.homeTeam, this.awayTeam.bonuses?.value.blockTacticalSubs));
        scores.push(...this.#getScoresForAllPossibleRotaldoInTeam(this.awayTeam, this.homeTeam.bonuses?.value.blockTacticalSubs));
      } else {
        scores.push(...this.#getScoresForAllPossibleRotaldoAllTeams());
      }

      return this.#getScoresPoucentages(scores);
    }
  };

  applyBonus = () => {
    const homeBonus = this.homeTeam.bonus?.value;
    const awayBonus = this.awayTeam.bonus?.value;

    if (homeBonus === "removeGoal" || awayBonus === "removeGoal") {
      const targetTeam = homeBonus === "removeGoal" ? this.awayTeam : this.homeTeam;
      this.removeGoal(targetTeam);
    }
  };

  /**
   * Enlève un but au 1er joueur qui a marqué dans l'équipe
   * @param {Team} team équipe sur laquelle appliquer le bonus
   */
  removeGoal = (team) => {
    const firstScorerIndex = team.getFinalPlayers().findIndex(player => player.goals >= 1 || player.mpgGoals >= 1);
    team.finalPlayers[firstScorerIndex].cancelGoal();
  };

  resetMpgGoals = () => {
    this.homeTeam.finalPlayers.map(player => player.mpgGoals = 0);
    this.awayTeam.finalPlayers.map(player => player.mpgGoals = 0);
    this.setMpgGoals();
  };

  /**
   * Donne les buts MPG marquant des buts MPG dans les 2 équipes du match
   */
  setMpgGoals = () => {
    this.setTeamMpgGoals(true);
    this.setTeamMpgGoals(false);
  };

  /**
   * Donne un but MPG aux joueurs qui le peuvent
   * @param {Boolean} isHome Si le joueur joue à domicile ou non
   */
  setTeamMpgGoals = (isHome) => {
    const teamAverages = isHome ? this.awayTeam.getAverages() : this.homeTeam.getAverages();
    const potentialScorers = this.#getPotentialScorers(isHome);

    const scorers = potentialScorers
      .filter(player => this.isScoringMpgGoal(player, teamAverages, isHome))
      .map(player => player.playerId);

    const players = isHome ? this.homeTeam.getFinalPlayers() : this.awayTeam.getFinalPlayers();
    scorers.forEach((scorerId) => {
      const scorerIndex = players.findIndex(player => player.playerId === scorerId);
      isHome ? this.homeTeam.finalPlayers[scorerIndex].mpgGoals = 1 : this.awayTeam.finalPlayers[scorerIndex].mpgGoals = 1;
    });
  };

  /**
   * Renvoi la liste des buts arretés par les gardiens
   * @returns Array
   */
  getGoalkeeperSaves = () => {
    const saves = {
      homeTeam: [],
      awayTeam: [],
    };

    if (this.homeTeam.canSaveGoal()) {
      saves.awayTeam.push(this.awayTeam.getFinalPlayers().find(player => player.goals > 0).playerId);
    }
    if (this.awayTeam.canSaveGoal()) {
      saves.homeTeam.push(this.homeTeam.getFinalPlayers().find(player => player.goals > 0).playerId);
    }

    return saves;
  };

  /**
   * Renvoi la liste des joueurs pouvant marquer un but MPG
   * @param {Boolean} isHome Si le joueur joue à domicile ou non
   * @returns la liste des joueurs pouvant marquer un but MPG
   */
  #getPotentialScorers = (isHome) => {
    const players = isHome ? this.homeTeam.getFinalPlayers() : this.awayTeam.getFinalPlayers();
    return players.filter(player => player.getTotalScore() >= 5 && player.goals === 0 && player.position > 1);
  };

  /**
   * Renvoi true ou false si le joueur marque un but MPG
   * @param {Player} player Le joueur à tester
   * @param {Array} teamAverages les moyennes des lignes de l'équipe adverse
   * @param {Boolean} isHome Le joueur joue à domicile ou non
   * @returns Boolean true si le joueur marque en MPG
   */
  isScoringMpgGoal = (player, teamAverages, isHome) => {
    const LINES_TO_PASS = {
      4: [2, 1],
      3: [3, 2, 1],
      2: [4, 3, 2, 1],
    };
    return LINES_TO_PASS[player.position].every((lineToPass, index) => {
      const dribbleMalus = this.getDribbleMalus(index);
      const playerNote = player.getTotalScore() - dribbleMalus;
      return isHome ? playerNote >= teamAverages[lineToPass - 1] : playerNote > teamAverages[lineToPass - 1];
    });
  };

  /**
   *
   * @param {Number} lineIndex le nombre de ligne déjà passée
   * @returns le malus à appliquer à la note pour calculer la suite du but MPG (0 = 0, 1 = 1, 2 = 1.5, 3 = 2)
   */
  getDribbleMalus = (lineIndex) => {
    const DRIBBLE_MALUS_BASE = 0;
    const DRIBBLE_MALUS_INCREMENT = 0.5;

    return lineIndex === 0 ? DRIBBLE_MALUS_BASE : (lineIndex + 1) * DRIBBLE_MALUS_INCREMENT;
  };

}