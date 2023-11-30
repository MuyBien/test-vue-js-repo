import { LiveAppliedBonus } from "./LiveAppliedBonus";

export class FourStrikersBonus extends LiveAppliedBonus {

  constructor () {
    super({
      name: "4 - Decat'",
      value: "fourStrikers",
      icon: "/img/bonus-images/4-decat.png",
      description: "Passe en 4-2-4 et aligne 4 attaquants.",
      timing: "before",
    });
  }

  apply (team) {
    team.pitchPlayers.filter(player => player.isBacker()).forEach(player => {
      player.bonusRating += 0.5;
    });
  }

  revert (team) {
    team.pitchPlayers.filter(player => player.isBacker()).forEach(player => {
      player.bonusRating -= 0.5;
    });
  }
}