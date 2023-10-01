import { Player } from "./Player";

export class Team {

  composition;
  score;
  starters = [];
  substitutes = [];
  substitutions = [];

  constructor(team) {
    this.composition = team.composition;
    this.score = team.score;

    const playersData = Object.values(team.players);

    this.starters = playersData.slice(0, 11).map(playerData => new Player(playerData));
    this.substitutes = playersData.slice(11).map(playerData => new Player(playerData));
    this.substitutions = team.tacticalSubs;
  }

  getFinalPlayers = () => {
    let finalPlayers = [...this.starters];
    let substitutesCopy = [...this.substitutes];

    /** Tactical substitutions */
    this.substitutions.forEach((substitution, index) => {

      const substitutionStarterIndex = finalPlayers.findIndex(starter => starter.playerId === substitution.starterId);
      const finalPlayerCompleteRating = finalPlayers[substitutionStarterIndex].getTotalScore();
      if (! finalPlayers[substitutionStarterIndex].rating || finalPlayerCompleteRating < substitution.rating) {
        
        const substituteIndex = substitutesCopy.findIndex(substitute => substitute.playerId === substitution.subId);
        
        if (substituteIndex >= 0 && substitutesCopy[substituteIndex].rating) {
          finalPlayers[substitutionStarterIndex] = substitutesCopy[substituteIndex];
          substitutesCopy.splice(substituteIndex, 1);
        }
      }
    });

    /** Classic substitutions */
    finalPlayers.forEach((player, index) => {
      if (! player.rating) {
        const substituteIndex = substitutesCopy.findIndex((substitute) => substitute.rating && substitute.position === player.position);
        if (substituteIndex >= 0) {
          finalPlayers[index] = substitutesCopy[substituteIndex];
          substitutesCopy.splice(substituteIndex, 1);
        } else {
          const substituteIndex = substitutesCopy.findIndex((substitute) => substitute.rating && substitute.position + 1 === player.position);
          if (substituteIndex >= 0) {
            finalPlayers[index] = substitutesCopy[substituteIndex];
            finalPlayers[index].rating -= 1;
            substitutesCopy.splice(substituteIndex, 1);
          }
        }
      }
    });

    // Rotaldo substitutions
    finalPlayers = finalPlayers.map((player) => {
      if (! player.rating) {
        return new Player({
          lastName: "Rotaldo",
          position: player.position,
          compositionStatus: 1,
          bonusRating: 0,
          rating: 2.5,
          goals: 0,
          ownGoals: 0,
        });
      }
      return player;
    });

    return finalPlayers;
  };

  getFinalTeamGoals = () => {
    const finalPlayers = this.getFinalPlayers();
    const goals = finalPlayers.reduce((goals, player) => { return player.goals ? goals + player.goals : goals }, 0);
    const ownGoals = finalPlayers.reduce((ownGoals, player) => { return player.ownGoals ? ownGoals + player.ownGoals : ownGoals }, 0);
    const rotaldoOwnGoals = Math.floor(finalPlayers.filter(player => player.lastName === "Rotaldo").length / 3);

    return {
      goals,
      ownGoals: ownGoals + rotaldoOwnGoals,
    }
  }

}