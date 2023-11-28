import { Rotaldo } from "../players/Rotaldo";
import { Bonus } from "./Bonus";

export class RemoveRandomPlayerBonus extends Bonus {

  team;
  position;

  constructor (bonusData = {}) {
    super({
      name: "Chapron Rouge",
      value: "removeRandomPlayer",
      icon: "/img/bonus-images/chapron-rouge.png",
      description: "Remplace un joueur de champ final (après les remplacements) par un Rotaldo.",
      timing: "afterSubstitutions",
      isLiveApplied: false,
    });
    this.team = bonusData.team;
    this.position = bonusData.position;
  }

  apply (team, opponentTeam) {
    const players = this.team === "team" ? team.pitchPlayers : opponentTeam.pitchPlayers;
    const rotaldoAmount = players.filter(player => player.lastName === "Rotaldo").length;
    players[this.position] = new Rotaldo({
      ...players[this.position],
      ownGoals: (rotaldoAmount + 1) % 3 ? 0 : 1,
      isSubstitute: true,
    });
  }
}