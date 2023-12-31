import { RemoveRandomPlayerBonus } from "@/models/bonus";
import { calculateFinalMatch } from "./resultMatchCalculator";

import { Match } from "@/models/match/Match";

const multipleResultMatchCalculator = (originalMatch) => {
  let results;
  const removePlayerBonusNumber = getRemovePlayerBonusNumber(originalMatch);

  if (removePlayerBonusNumber) {
    results = removePlayerBonusNumber === 1 ? getResultsForOneBonus(originalMatch) : getResultsForTwoBonus(originalMatch);
  }

  return results;
};

/**
 * Renvoi la liste des scores possibles avec un bonus Chapron Rouge
 * @param {Match} match
 * @returns Map
 */
const getResultsForOneBonus = (match) => {
  const positionsToTest = getPositionsToTestOneBonus();

  const results = [];
  positionsToTest.forEach(({ team, position }) => {
    const teamToTest = team === "team" ? match.homeTeam : match.awayTeam;
    if (teamToTest.pitchPlayers[position - 1].lastName !== "Rotaldo") {
      const matchWithPlayerReplaced = calculateWithPlayerReplaced(match, team, position);
      results.push(matchWithPlayerReplaced);
    }
  });

  return results;
};

const getPositionsToTestOneBonus = () => {
  const positionsToTest = [];

  // Joueurs de l'équipe à domicile (sauf le gardien)
  positionsToTest.push(...Array.from({ length: 10 }, (_, i) => {
    return {
      team: "team",
      position: i + 1,
    };
  }));

  // Joueurs de l'équipe à l'extérieur(sauf le gardien)
  positionsToTest.push(...Array.from({ length: 10 }, (_, i) => {
    return {
      team: "opponentTeam",
      position: i + 1,
    };
  }));

  return positionsToTest;
};

const getResultsForTwoBonus = (match) => {
  const positionsToTest = getPositionsToTestTwoBonus();

  const results = [];
  positionsToTest.forEach((positions) => {
    const matchForThosePlayers = new Match(match);

    // First Rotaldo
    const { team: firstTeam, position: firstPosition } = positions[0];
    const teamToTest = firstTeam === "team" ? match.homeTeam : match.awayTeam;
    if (teamToTest.pitchPlayers[firstPosition - 1].lastName === "Rotaldo") {
      return;
    }
    matchForThosePlayers.homeTeam.bonus = new RemoveRandomPlayerBonus({
      team: firstTeam,
      position: firstPosition,
    });

    // Second Rotaldo
    const { team: secondTeam, position: secondPosition } = positions[1];
    const teamToTest2 = secondTeam === "team" ? match.homeTeam : match.awayTeam;
    if (teamToTest2.pitchPlayers[secondPosition - 1].lastName === "Rotaldo") {
      return;
    }
    matchForThosePlayers.awayTeam.bonus = new RemoveRandomPlayerBonus({
      team: secondTeam,
      position: secondPosition,
    });

    const matchWithPlayersReplaced = calculateFinalMatch(matchForThosePlayers);

    // TODO : Supprimer la clé. La récupération du joueur remplacé se fera dans le bonus
    results.push(matchWithPlayersReplaced);
  });

  return results;
};

const getPositionsToTestTwoBonus = () => {
  const positionsToTest = [];

  // Joueurs de l'équipe à domicile (sauf le gardien)
  positionsToTest.push(...Array.from({ length: 10 }, (_, i) => {
    return {
      team: "team",
      position: i + 1,
    };
  }));

  // Joueurs de l'équipe à l'extérieur(sauf le gardien)
  positionsToTest.push(...Array.from({ length: 10 }, (_, i) => {
    return {
      team: "opponentTeam",
      position: i + 1,
    };
  }));

  const allPositionsToTest = [];
  positionsToTest.forEach((position) => {
    const positionsToAdd = getPositionsToTestOneBonus();
    positionsToAdd.forEach((positionToAdd) => {
      const tuppleposition = [];
      if (positionToAdd.team === position.team && positionToAdd.position === position.position) {
        return;
      }
      tuppleposition.push(position);
      tuppleposition.push(positionToAdd);
      allPositionsToTest.push(tuppleposition);
    });
  });

  return allPositionsToTest;
};

const calculateWithPlayerReplaced = (originalMatch, team, position) => {
  const matchForThisPlayer = new Match(originalMatch);
  matchForThisPlayer.homeTeam.bonus = new RemoveRandomPlayerBonus({
    team,
    position,
  });
  return calculateFinalMatch(matchForThisPlayer);
};

const getRemovePlayerBonusNumber = (originalMatch) => {
  return Number(originalMatch.homeTeam.bonus.value === "removeRandomPlayer") + Number(originalMatch.awayTeam.bonus.value === "removeRandomPlayer");
};

export { multipleResultMatchCalculator };