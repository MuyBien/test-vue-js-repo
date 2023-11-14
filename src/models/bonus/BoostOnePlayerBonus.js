import { Bonus } from "./Bonus";

export class BoostOnePlayerBonus extends Bonus {

  playerId;

  constructor (bonusData) {
    super({
      name: "UberEats",
      value: "boostOnePlayer",
      icon: "/img/bonus-images/uber-eats.png",
      description: "+1pt sur le joueur de votre choix.",
      timing: "before",
      isLiveApplied: true,
    });
    this.playerId = bonusData.playerId;
  }

  apply (team) {
    team.pitchPlayers.find(player => player.playerId === this.playerId).bonusRating += 1;
  }
}