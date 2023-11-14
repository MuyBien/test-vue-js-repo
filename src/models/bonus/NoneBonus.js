import { Bonus } from "./Bonus";

export class NoneBonus extends Bonus {

  constructor () {
    super({
      name: "Aucun bonus",
      value: "none",
      icon: "/img/bonus-images/none.png",
      description: "N'a aucun effet sur le match.",
    });
  }

  apply () {}
}