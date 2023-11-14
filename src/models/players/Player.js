const PRECISE_POSITIONS = {
  10: "G",
  20: "DC",
  21: "DL",
  30: "MD",
  31: "MO",
  40: "A",
};

export class Player {
  playerId;
  lastName;
  firstName;

  position; // 1 gardien, 2 defenseur, 3 milieu, 4 attaquant
  precisePosition; // 10 G, 20 DC, 21 DL, 30 MD, 31 MO, 40 ATT

  rating;
  bonusRating;

  goals;
  mpgGoals;
  ownGoals;
  canceledGoals;
  savedGoals;

  isCaptain = false;
  isSubstitute = false;

  constructor (playerData = {}) {
    this.playerId = playerData.playerId;
    this.lastName = playerData.lastName;
    this.firstName = playerData.firstName;

    this.position = playerData.position;
    this.precisePosition = playerData.precisePosition || PRECISE_POSITIONS[playerData.ultraPosition];

    this.rating = playerData.rating || undefined;
    this.bonusRating = isNaN(playerData.bonusRating) ? 0 : playerData.bonusRating;

    this.goals = playerData.goals || 0;
    this.mpgGoals = playerData.mpgGoals || 0;
    this.ownGoals = playerData.ownGoals || 0;
    this.canceledGoals = playerData.canceledGoals || 0;
    this.savedGoals = playerData.savedGoals || 0;

    this.isCaptain = playerData.isCaptain || false;
    this.isSubstitute = playerData.isSubstitute || false;
  }

  isGoalkeeper = () => {
    return this.position === 1;
  };

  isBacker = () => {
    return this.position === 2;
  };

  isMiddle = () => {
    return this.position === 3;
  };

  isForward = () => {
    return this.position === 4;
  };

  /**
   * Renvoi le score total du joueur en comptant son bonus
   * @returns {number} score
   */
  getTotalScore = () => {
    return this.rating + this.bonusRating;
  };

  toString = () => {
    return `${this.playerId} - ${this.lastName} - note: ${this.rating} - bonus: ${this.bonusRating} - Goals: ${this.goals} - capitaine: ${this.isCaptain}`;
  };
}