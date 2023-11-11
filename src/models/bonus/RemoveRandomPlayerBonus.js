import { Bonus } from "./Bonus";

export class RemoveRandomPlayerBonus extends Bonus {

  constructor () {
    super({
      name: "Chapron Rouge",
      value: "removeRandomPlayer",
      icon: "/img/bonus-images/chapron-rouge.png",
      description: "Remplace un joueur de champ final (après les remplacements) par un Rotaldo.",
      timing: "after",
    });
  }

  apply (team, opponentTeam) {
    //TODO
  }
}