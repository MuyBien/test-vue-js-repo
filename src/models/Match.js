import { Team } from "./Team";

const LINES_TO_PASS = {
  4: [2, 1],
  3: [3, 2, 1],
  2: [4, 3, 2, 1],
};

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

  getScoreProbabilities = () => {
    const bonusNumber = Number(this.homeTeam.bonus.value === "removeRandomPlayer") + Number(this.awayTeam.bonus.value === "removeRandomPlayer");
    if (bonusNumber > 0) {
      const scores = [];
      for (let index = 1; index < 11; index ++) {
        if (this.homeTeam.getFinalPlayers()[index].lastName === "Rotaldo") {
          continue;
        }
        if (bonusNumber > 1) {
          for (let secondIndex = 1; secondIndex < 11; secondIndex ++) {
            this.homeTeam.applyRotaldoSubstitution(index);
            if (this.homeTeam.getFinalPlayers()[secondIndex].lastName === "Rotaldo") {
              this.homeTeam.calculateFinalPlayers(false);
              continue;
            }
            this.homeTeam.applyRotaldoSubstitution(secondIndex);
            const score = this.getFinalScore();
            scores.push(score);
            this.homeTeam.calculateFinalPlayers(false);
          }
          for (let secondIndex = 1; secondIndex < 11; secondIndex ++) {
            this.homeTeam.applyRotaldoSubstitution(index);
            if (this.awayTeam.getFinalPlayers()[secondIndex].lastName === "Rotaldo") {
              this.awayTeam.calculateFinalPlayers(false);
              continue;
            }
            this.awayTeam.applyRotaldoSubstitution(secondIndex);
            const score = this.getFinalScore();
            scores.push(score);
            this.homeTeam.calculateFinalPlayers(false);
            this.awayTeam.calculateFinalPlayers(false);
          }
        } else {
          this.homeTeam.applyRotaldoSubstitution(index);
          const score = this.getFinalScore();
          scores.push(score);
          this.homeTeam.calculateFinalPlayers(this.awayTeam.bonuses?.value.blockTacticalSubs);
        }
      }
      for (let index = 1; index < 11; index ++) {
        if (this.awayTeam.getFinalPlayers()[index].lastName === "Rotaldo") {
          continue;
        }
        if (bonusNumber > 1) {
          for (let secondIndex = 1; secondIndex < 11; secondIndex ++) {
            this.awayTeam.applyRotaldoSubstitution(index);
            if (this.homeTeam.getFinalPlayers()[secondIndex].lastName === "Rotaldo") {
              this.awayTeam.calculateFinalPlayers(false);
              continue;
            }
            this.homeTeam.applyRotaldoSubstitution(secondIndex);
            const score = this.getFinalScore();
            scores.push(score);
            this.homeTeam.calculateFinalPlayers(false);
            this.awayTeam.calculateFinalPlayers(false);
          }
          for (let secondIndex = 1; secondIndex < 11; secondIndex ++) {
            this.awayTeam.applyRotaldoSubstitution(index);
            if (this.awayTeam.getFinalPlayers()[secondIndex].lastName === "Rotaldo") {
              this.awayTeam.calculateFinalPlayers(false);
              continue;
            }
            this.awayTeam.applyRotaldoSubstitution(secondIndex);
            const score = this.getFinalScore();
            scores.push(score);
            this.awayTeam.calculateFinalPlayers(false);
          }
        } else {
          this.awayTeam.applyRotaldoSubstitution(index);
          const score = this.getFinalScore();
          scores.push(score);
          this.awayTeam.calculateFinalPlayers(this.homeTeam.bonuses?.value.blockTacticalSubs);
        }
      }

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
      .filter(player => this.#isScoringMpgGoal(player, teamAverages, isHome))
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