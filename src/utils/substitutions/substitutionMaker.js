import { Match } from "@/models_refactored/Match";
import { Team } from "@/models_refactored/teams/Team";
import { Rotaldo } from "@/models_refactored/players/Rotaldo";

const POSITION_GOALKEEPER = 1;

const doMatchSubstitutions = (match) => {
  const homeTeam = doSubstitutions(match.homeTeam);
  const awayTeam = doSubstitutions(match.awayTeam);
  return new Match({
    ...match,
    homeTeam,
    awayTeam,
  });
};

/**
 *
 * @param {Team} team L'équipe sur laquelle effectuer les remplacements
 * @returns { Team } Une nouvelle équipe avec les changements effectués
 */
const doSubstitutions = (team) => {
  const pitchPlayersCopy = [...team.pitchPlayers];
  const benchPlayersCopy = [...team.benchPlayers];

  const playersAfterRT = applyTacticalSubstitutions(pitchPlayersCopy, benchPlayersCopy, team.substitutions);
  const playersAfterSub = applyClassicSubstitutions(playersAfterRT, benchPlayersCopy);
  const finalPlayers = applyRotaldoSubstitutions(playersAfterSub);

  return new Team({
    ...team,
    pitchPlayers: finalPlayers, //TODO changer les remplaçants et les remplacements (marquer en done)
  });
};

/**
 * Effectue les RT
 */
const applyTacticalSubstitutions = (finalPlayers, substitutesCopy, substitutions) => {
  substitutions.forEach(substitution => {
    const { starterId, subId, rating } = substitution;
    const substitutionStarterIndex = finalPlayers.findIndex(starter => starter.playerId === starterId);
    const finalPlayerCompleteRating = finalPlayers[substitutionStarterIndex].getTotalScore();

    if (! finalPlayers[substitutionStarterIndex].rating || finalPlayerCompleteRating < rating) {
      const substituteIndex = substitutesCopy.findIndex(substitute => substitute.playerId === subId);

      if (substituteIndex >= 0 && substitutesCopy[substituteIndex].rating) {
        finalPlayers[substitutionStarterIndex] = substitutesCopy[substituteIndex];
        finalPlayers[substitutionStarterIndex].isSubstitute = true;
        substitutesCopy.splice(substituteIndex, 1);
      }
    }
  });
  return finalPlayers;
};

/**
 * Effectue les remplacements obligatoires
 */
const applyClassicSubstitutions = (finalPlayers, substitutesCopy) => {
  finalPlayers.forEach((player, index) => {
    if (! player.rating) {
      const substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position === player.position);
      if (substituteIndex >= 0) {
        finalPlayers[index] = substitutesCopy[substituteIndex];
        finalPlayers[index].isSubstitute = true;
        substitutesCopy.splice(substituteIndex, 1);
      } else {
        let substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position > POSITION_GOALKEEPER && substitute.position + 1 === player.position);
        if (substituteIndex >= 0) {
          finalPlayers[index] = substitutesCopy[substituteIndex];
          finalPlayers[index].bonusRating -= 1;
          finalPlayers[index].isSubstitute = true;
          substitutesCopy.splice(substituteIndex, 1);
        } else {
          substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position > POSITION_GOALKEEPER && substitute.position + 2 === player.position);
          if (substituteIndex >= 0) {
            finalPlayers[index] = substitutesCopy[substituteIndex];
            finalPlayers[index].bonusRating -= 2;
            finalPlayers[index].isSubstitute = true;
            substitutesCopy.splice(substituteIndex, 1);
          }
        }
      }
    }
  });
  return finalPlayers;
};

/**
 * Effectue les rentrées de Rotaldo
 */
const applyRotaldoSubstitutions = (finalPlayers) => {
  let rotaldoAmount = finalPlayers.filter(player => player.lastName === "Rotaldo").length;
  return finalPlayers.map(player => {
    if (! player.rating) {
      rotaldoAmount ++;
      return new Rotaldo({
        ...player,
        ownGoals: rotaldoAmount % 3 ? 0 : 1,
        isSubstitute: true,
      });
    }
    return player;
  });
};

export { doMatchSubstitutions };