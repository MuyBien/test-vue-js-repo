import { RemoveRandomPlayerBonus } from "@/models/bonus";
import { calculateFinalMatch } from "./resultMatchCalculator";

import { Match } from "@/models/match/Match";

const multipleResultMatchCalculator = (originalMatch) => {
  const results = new Map();

  // Itérer sur les joueurs de l'équipe à domicile (sauf le gardien)
  originalMatch.homeTeam.pitchPlayers.slice(1).forEach(({ lastName }, position) => {
    if (lastName !== "Rotaldo") {
      const matchWithRotaldo = calculateWithPlayerReplaced(originalMatch, "team", position + 1);
      results.set({ home: position + 1 }, matchWithRotaldo);
    }
  });

  // Itérer sur les joueurs de l'équipe à l'extérieur (sauf le gardien)
  originalMatch.awayTeam.pitchPlayers.slice(1).forEach(({ lastName }, position) => {
    if (lastName !== "Rotaldo") {
      const matchWithRotaldo = calculateWithPlayerReplaced(originalMatch, "opponentTeam", position + 1);
      matchWithRotaldo.awayTeam.pitchPlayers.map(player => player.toString());
      results.set({ away: position + 1 }, matchWithRotaldo);
    }
  });

  return results;
};

const calculateWithPlayerReplaced = (originalMatch, team, position) => {
  const matchForThisPlayer = new Match(originalMatch);
  matchForThisPlayer.homeTeam.bonus = new RemoveRandomPlayerBonus({
    team,
    position,
  });
  return calculateFinalMatch(matchForThisPlayer);
};

export { multipleResultMatchCalculator };