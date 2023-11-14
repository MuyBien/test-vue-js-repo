import { Bonus } from "./Bonus";

export class RemoveGoalBonus extends Bonus {

  constructor () {
    super({
      name: "La valise à Nanard",
      value: "removeGoal",
      icon: "/img/bonus-images/valise-nanard.png",
      description: "Retire un but réel ou MPG à un joueur adverse.",
      timing: "after",
      isLiveApplied: false,
    });
  }

  apply (team, opponentTeam) {
    const firstScorerIndex = opponentTeam.pitchPlayers.findIndex(player => player.goals >= 1 || player.mpgGoals >= 1);
    if (firstScorerIndex >= 0) {
      opponentTeam.pitchPlayers[firstScorerIndex].canceledGoals = 1;
    }
  }
}