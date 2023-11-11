import { Bonus } from "./Bonus";

export class FourStrikersBonus extends Bonus {

  constructor () {
    super({
      name: "4 - Decat'",
      value: "fourStrikers",
      icon: "/img/bonus-images/4-decat.png",
      description: "Passe en 4-2-4 et aligne 4 attaquants.",
      timing: "before",
    });
  }

  apply () {}
}