import { LiveAppliedBonus } from "./LiveAppliedBonus";

export class NerfGoalkeeperBonus extends LiveAppliedBonus {

  constructor () {
    super({
      name: "Suarez",
      value: "nerfGoalkeeper",
      icon: "/img/bonus-images/suarez.png",
      description: "-1pt pour le gardien adverse.",
      timing: "afterSubstitutions",
    });
  }

  apply (team, opponentTeam) {
    opponentTeam.pitchPlayers[0].bonusRating -= 1;
  }

  revert (team, opponentTeam) {
    opponentTeam.pitchPlayers[0].bonusRating += 1;
  }
}