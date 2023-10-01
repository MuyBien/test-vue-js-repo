export class Player {

  playerId;
  lastName;
  firstName;
  position; // 1 gardien, 2 defenseur, 3 milieu, 4 attaquant
  compositionStatus; // 1 ?
  bonusRating;
  hasMatchPostponed;
  rating;
  goals;
  ownGoals;

  constructor(playerData) {
    this.playerId = playerData.playerId;
    this.lastName = playerData.lastName;
    this.firstName = playerData.firstName;
    this.position = playerData.position;
    this.compositionStatus = playerData.compositionStatus;
    this.bonusRating = playerData.bonusRating;
    this.hasMatchPostponed = playerData.hasMatchPostponed;
    this.rating = playerData.rating;
    this.goals = playerData.goals;
    this.ownGoals = playerData.ownGoals;
  }

  /**
   * Renvoi le score total du joueur en comptant son bonus
   * @returns {number} score
   */
  getTotalScore = () => {
    return this.rating + this.bonusRating;
  }
}

