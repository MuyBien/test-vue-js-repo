import { Bonus } from "./Bonus";

export class BoostAllPlayersBonus extends Bonus {

  constructor () {
    super({
      name: "Zahia",
      value: "boostAllPlayers",
      icon: "/img/bonus-images/zahia.png",
      description: "Ajoute un bonus de 0.5 à tous les joueurs titulaires (pas les remplaçants).",
      timing: "before",
      isLiveApplied: true,
    });
  }

  apply (team) {
    team.pitchPlayers.forEach(player => {
      player.bonusRating += 0.5;
    });
  }
}