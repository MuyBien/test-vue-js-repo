import { Bonus } from "./Bonus";

export class MirrorBonus extends Bonus {

  constructor () {
    super({
      name: "Miroir",
      value: "mirror",
      icon: "/img/bonus-images/mirror.png",
      description: "Le bonus de ton adversaire se retourne contre lui. MPG Calculator pourra bientôt calculer ce bonus selon les bonus restants à l'adversaire",
      timing: "before",
    });
  }

  apply () {
    //TODO
  }
}