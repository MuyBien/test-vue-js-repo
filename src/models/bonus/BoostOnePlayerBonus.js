import { Bonus } from "./Bonus";

export class BoostOnePlayerBonus extends Bonus {

  constructor () {
    super({
      name: "UberEats",
      value: "boostOnePlayer",
      icon: "/img/bonus-images/uber-eats.png",
      description: "+1pt sur le joueur de votre choix.",
      timing: "before",
    });
  }

  apply (team) {
    //TODO
  }
}