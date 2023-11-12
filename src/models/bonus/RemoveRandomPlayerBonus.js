import { Bonus } from "./Bonus";
import { Rotaldo } from "../players/Rotaldo";

export class RemoveRandomPlayerBonus extends Bonus {

  playerId;

  constructor (bonusData) {
    super({
      name: "Chapron Rouge",
      value: "removeRandomPlayer",
      icon: "/img/bonus-images/chapron-rouge.png",
      description: "Remplace un joueur de champ final (après les remplacements) par un Rotaldo.",
      timing: "afterSubstitutions",
      isLiveApplied: false,
    });
    this.playerId = bonusData.playerId;
  }

  apply (team, opponentTeam) {
    const replacePlayer = (players) => {
      const playerIndex = players.findIndex(p => p.playerId === this.playerId);
      if (playerIndex !== - 1) {
        const rotaldoAmount = players.filter(player => player.lastName === "Rotaldo").length;
        players[playerIndex] = new Rotaldo({
          ...players[playerIndex],
          ownGoals: (rotaldoAmount + 1) % 3 ? 0 : 1,
          isSubstitute: true,
        });
        return true; // Joueur trouvé et remplacé
      }
      return false; // Joueur non trouvé
    };

    if (! replacePlayer(team.pitchPlayers)) {
      replacePlayer(opponentTeam.pitchPlayers);
    }
  }
}