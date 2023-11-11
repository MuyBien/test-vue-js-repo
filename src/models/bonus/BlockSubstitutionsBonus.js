import { Bonus } from "./Bonus";

export class BlockSubstitutionsBonus extends Bonus {

  constructor () {
    super({
      name: "Tonton Pat",
      value: "blockTacticalSubs",
      icon: "/img/bonus-images/tonton-pat.png",
      description: "Aucun remplacement TACTIQUE adverse possible.",
      timing: "before",
    });
  }

  apply (team, opponentTeam) {
    opponentTeam.substitutions = [];
  }
}