export class Team {

  composition;
  starters = [];
  substitutes = [];
  substitutions = [];

  constructor(team) {
    this.composition = team.composition;

    const playersData = Object.values(team.players);

    this.starters = playersData.slice(0, 11);
    this.substitutes = playersData.slice(11);
    this.substitutions = team.tacticalSubs;
  }

  getFinalPlayers = () => {
    let finalPlayers = this.starters;

    /** Tactical substitutions */
    this.substitutions.forEach((substitution, index) => {

      
      const substitutionStarterIndex = finalPlayers.findIndex(starter => starter.playerId === substitution.starterId);
      const finalPlayerCompleteRating = finalPlayers[substitutionStarterIndex].rating + finalPlayers[substitutionStarterIndex].bonusRating; // TODO to a Player model
      if (! finalPlayers[substitutionStarterIndex].rating || finalPlayerCompleteRating < substitution.rating) {
        
        const substituteIndex = this.substitutes.findIndex(substitute => substitute.playerId === substitution.subId);

        if (substituteIndex >= 0 && this.substitutes[substituteIndex].rating) {
          finalPlayers[substitutionStarterIndex] = this.substitutes[substituteIndex];
          this.substitutes.splice(substituteIndex, 1);
        }
      }
    });

    /** Classic substitutions */
    finalPlayers.forEach((player, index) => {
      if (! player.rating) {
        const substituteIndex = this.substitutes.findIndex((substitute) => substitute.rating && substitute.position === player.position);
        if (substituteIndex >= 0) {
          finalPlayers[index] = this.substitutes[substituteIndex];
          this.substitutes.splice(substituteIndex, 1);
        } else {
          const substituteIndex = this.substitutes.findIndex((substitute) => substitute.rating && substitute.position + 1 === player.position);
          if (substituteIndex >= 0) {
            finalPlayers[index] = this.substitutes[substituteIndex];
            finalPlayers[index].rating -= 1;
            this.substitutes.splice(substituteIndex, 1);
          }
        }
      }
    });

    // Rotaldo substitutions
    finalPlayers = finalPlayers.map((player) => {
      if (! player.rating) {
        return {
          lastName: "Rotaldo",
          position: player.position,
          compositionStatus: 1,
          bonusRating: 0,
          rating: 2.5,
          goals: 0,
          ownGoals: 0,
        };
      }
      return player;
    });

    return finalPlayers;
  };

}