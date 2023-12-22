import { Bonus } from "./Bonus";

export class NerfGoalkeeperBonus extends Bonus {

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