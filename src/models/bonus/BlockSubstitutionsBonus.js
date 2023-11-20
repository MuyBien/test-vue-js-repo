import { Bonus } from "./Bonus";

export class BlockSubstitutionsBonus extends Bonus {

  constructor () {
    super({
      name: "Tonton Pat",
      value: "blockTacticalSubs",
      icon: "/img/bonus-images/tonton-pat.png",
      description: "Aucun remplacement TACTIQUE adverse possible. Seuls les 2 premiers remplacements LIVE sont gardés.",
      timing: "before",
      isLiveApplied: false,
    });
  }

  apply (team, opponentTeam) {
    if (opponentTeam.isLiveSubstitutesEnabled) {
      opponentTeam.substitutions = opponentTeam.substitutions.sort((a, b) => {
        return new Date(a.substitutedAt).getTime() - new Date(b.substitutedAt).getTime();
      }).slice(0, 2);
    } else {
      opponentTeam.substitutions = [];
    }
  }
}