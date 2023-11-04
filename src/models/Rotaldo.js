import { Player } from "./Player";

export class Rotaldo extends Player {

  ROTALDO_NAME = "Rotaldo";
  ROTALDO_RATING = 2.5;

  constructor (playerData) {
    super(playerData);
    this.lastName = this.ROTALDO_NAME;
    this.firstName = "";
    this.rating = this.ROTALDO_RATING;
    this.bonusRating = 0;
    this.isCaptain = false;
  }

}