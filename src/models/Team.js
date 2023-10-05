import { Player } from "./Player";

const POSITION_GOALKEEPER = 1;
const POSITION_BACKER = 2;
const POSITION_MIDDLE = 3;
const POSITION_FORWARD = 4;

export class Team {
  composition;
  score;
  starters = [];
  substitutes = [];
  substitutions = [];
  finalPlayers = [];

  constructor(team) {
    this.composition = team.composition;
    this.score = team.score;

    const playersData = Object.values(team.players);

    this.starters = playersData.slice(0, 11).map(playerData => new Player(playerData));
    this.substitutes = playersData.slice(11).map(playerData => new Player(playerData));
    this.substitutions = team.tacticalSubs;

    const captainIndex = this.starters.findIndex(player => player.playerId === team.captain);
    this.starters[captainIndex].isCaptain = true;

    this.calculateFinalPlayers();
  }

  /**
   * Effectue les RT, les remplacements obligatoires et les rentrées de Rotaldo
   */
  calculateFinalPlayers() {
    let finalPlayers = [...this.starters];
    let substitutesCopy = [...this.substitutes];

    finalPlayers = this.applyTacticalSubstitutions(finalPlayers, substitutesCopy);
    finalPlayers = this.applyClassicSubstitutions(finalPlayers, substitutesCopy);
    finalPlayers = this.applyRotaldoSubstitutions(finalPlayers);

    this.finalPlayers = finalPlayers;
  }

  /**
   * Effectue les RT
   */
  applyTacticalSubstitutions(finalPlayers, substitutesCopy) {
    this.substitutions.forEach(substitution => {
      const { starterId, subId, rating } = substitution;
      const substitutionStarterIndex = finalPlayers.findIndex(starter => starter.playerId === starterId);
      const finalPlayerCompleteRating = finalPlayers[substitutionStarterIndex].getTotalScore();

      if (!finalPlayers[substitutionStarterIndex].rating || finalPlayerCompleteRating < rating) {
        const substituteIndex = substitutesCopy.findIndex(substitute => substitute.playerId === subId);

        if (substituteIndex >= 0 && substitutesCopy[substituteIndex].rating) {
          finalPlayers[substitutionStarterIndex] = substitutesCopy[substituteIndex];
          substitutesCopy.splice(substituteIndex, 1);
        }
      }
    });
    return finalPlayers;
  }

  /**
   * Effectue les remplacements obligatoires
   */
  applyClassicSubstitutions(finalPlayers, substitutesCopy) {
    finalPlayers.forEach((player, index) => {
      if (! player.rating) {
        const substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position === player.position);
        if (substituteIndex >= 0) {
          finalPlayers[index] = substitutesCopy[substituteIndex];
          substitutesCopy.splice(substituteIndex, 1);
        } else {
          let substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position > POSITION_GOALKEEPER && substitute.position + 1 === player.position);
          if (substituteIndex >= 0) {
            finalPlayers[index] = substitutesCopy[substituteIndex];
            finalPlayers[index].rating -= 1;
            substitutesCopy.splice(substituteIndex, 1);
          }
          substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position > POSITION_GOALKEEPER && substitute.position + 2 === player.position);
          if (substituteIndex >= 0) {
            finalPlayers[index] = substitutesCopy[substituteIndex];
            finalPlayers[index].rating -= 2;
            substitutesCopy.splice(substituteIndex, 1);
          }
        }
      }
    });
    return finalPlayers;
  }
/**
   * Effectue les rentrées de Rotaldo
   */
  applyRotaldoSubstitutions(finalPlayers) {
    return finalPlayers.map(player => (!player.rating)
      ? new Player({
        lastName: "Rotaldo",
        position: player.position,
        compositionStatus: 1,
        bonusRating: 0,
        rating: 2.5,
        goals: 0,
        ownGoals: 0,
      })
      : player
    );
  }
  
  getFinalPlayers = () => {
    return this.finalPlayers;
  };

  findSubstitute(substitutes, targetPosition, offset = 0) {
    return substitutes.findIndex(substitute => substitute.rating && substitute.position > POSITION_GOALKEEPER + offset && substitute.position + 1 === targetPosition);
  }

  getFinalTeamGoals = () => {
    const goals = this.finalPlayers.reduce((total, { goals }) => goals ? total + goals : total, 0);
    const ownGoals = this.finalPlayers.reduce((total, { ownGoals }) => ownGoals ? total + ownGoals : total, 0);
    const rotaldoOwnGoals = Math.floor(this.finalPlayers.filter(player => player.lastName === "Rotaldo").length / 3);

    return {
      goals,
      ownGoals: ownGoals + rotaldoOwnGoals,
    };
  };

  getAverages = () => {
    const finalPlayers = this.finalPlayers;

    const calculatePositionAverage = position => {
      const players = finalPlayers.filter(player => player.position === position);
      return players.reduce((total, player) => total + player.getTotalScore(), 0) / players.length;
    };

    const forwardAverage = calculatePositionAverage(POSITION_FORWARD);
    const middleAverage = calculatePositionAverage(POSITION_MIDDLE);
    const backerAverage = calculatePositionAverage(POSITION_BACKER);

    return [finalPlayers[0].getTotalScore(), backerAverage, middleAverage, forwardAverage];
  };
}
