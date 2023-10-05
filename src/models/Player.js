const PRECISE_POSITIONS = {
  10: "G",
  20: "DC",
  21: "DL",
  30: "MD",
  31: "MO",
  40: "A",
}

export class Player {

  playerId;
  lastName;
  firstName;
  position; // 1 gardien, 2 defenseur, 3 milieu, 4 attaquant
  precisePosition; // 10 G, 20 DC, 21 DL, 30 MD, 31 MO, 40 ATT
  compositionStatus; // 1 ?
  bonusRating;
  hasMatchPostponed;
  rating;
  goals;
  ownGoals;
  isCaptain = false;
  isSubstitute = false;

  constructor(playerData) {
    this.playerId = playerData.playerId;
    this.lastName = playerData.lastName;
    this.firstName = playerData.firstName;
    this.position = playerData.position;
    this.precisePosition = PRECISE_POSITIONS[playerData.ultraPosition];
    this.compositionStatus = playerData.compositionStatus;
    this.hasMatchPostponed = playerData.hasMatchPostponed;
    this.bonusRating = playerData.bonusRating || 0;
    this.rating = playerData.rating || undefined;
    this.goals = playerData.goals || 0;
    this.ownGoals = playerData.ownGoals || 0;
    this.isSubstitute = playerData.isSubstitute || false;
  }

  /**
   * Renvoi le score total du joueur en comptant son bonus
   * @returns {number} score
   */
  getTotalScore = () => {
    return this.rating + this.bonusRating;
  }
}

