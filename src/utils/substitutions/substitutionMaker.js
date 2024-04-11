import { Match } from "@/models/match/Match";
import { Player } from "@/models/players/Player";
import { Rotaldo } from "@/models/players/Rotaldo";
import { Team } from "@/models/teams/Team";

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

  let finalPlayers;
  if (team.isLiveSubstitutesEnabled) {
    const playersAfterRL = applyLiveSubstitutions(pitchPlayersCopy, benchPlayersCopy, team.substitutions);
    const playerAfterSub = applyGoalkeeperSubstitution(playersAfterRL, benchPlayersCopy);
    finalPlayers = applyRotaldoSubstitutions(playerAfterSub);
  } else {
    const playersAfterRT = applyTacticalSubstitutions(pitchPlayersCopy, benchPlayersCopy, team.substitutions);
    const playersAfterSub = applyClassicSubstitutions(playersAfterRT, benchPlayersCopy);
    finalPlayers = applyRotaldoSubstitutions(playersAfterSub);
  }

  return new Team({
    ...team,
    pitchPlayers: finalPlayers, //TODO changer les remplaçants et les remplacements (marquer en done)
  });
};

/**
 * Effectue les RT
 * Fais rentrer le joueur remplaçant :
 *   - si le joueur titulaire n'a pas joué  ou si elle est inférieure à la note définie
 *   - si le joueur remplaçant a joué
 */
const applyTacticalSubstitutions = (finalPlayers, substitutesCopy, substitutions) => {
  substitutions.forEach(substitution => {
    const { starterId, subId, rating } = substitution;
    const substitutionStarterIndex = finalPlayers.findIndex(starter => starter.playerId === starterId);
    const finalPlayerCompleteRating = finalPlayers[substitutionStarterIndex].getTotalScore();

    if (! finalPlayers[substitutionStarterIndex].rating || finalPlayerCompleteRating < rating) {
      const substituteIndex = substitutesCopy.findIndex(substitute => substitute.playerId === subId);

      if (substituteIndex >= 0 && substitutesCopy[substituteIndex].rating) {
        const substituedPlayer = new Player(finalPlayers[substitutionStarterIndex]);
        finalPlayers[substitutionStarterIndex] = substitutePlayer(substituedPlayer, substitutesCopy[substituteIndex]);
        substitutesCopy.splice(substituteIndex, 1);
      }
    }
  });
  return finalPlayers;
};

/**
 * Effectue les remplacements Live
 * Fais rentrer le joueur remplaçant dans tous les cas
 */
const applyLiveSubstitutions = (finalPlayers, substitutesCopy, substitutions) => {
  substitutions.forEach(substitution => {
    const { starterId, subId } = substitution;
    const substitutionStarterIndex = finalPlayers.findIndex(starter => starter.playerId === starterId);
    const substituteIndex = substitutesCopy.findIndex(substitute => substitute.playerId === subId);

    const substituedPlayer = new Player(finalPlayers[substitutionStarterIndex]);
    finalPlayers[substitutionStarterIndex] = substitutePlayer(substituedPlayer, substitutesCopy[substituteIndex]);
    finalPlayers[substitutionStarterIndex].isSubstitute = true;
    substitutesCopy.splice(substituteIndex, 1);
  });
  return finalPlayers;
};

/**
 * Effectue les remplacements obligatoires
 */
const applyClassicSubstitutions = (finalPlayers, substitutesCopy) => {
  finalPlayers.forEach((player, index) => {
    if (! player.rating) {
      const substituedPlayer = new Player(finalPlayers[index]);
      const substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position === player.position);
      if (substituteIndex >= 0) {
        finalPlayers[index] = substitutePlayer(substituedPlayer, substitutesCopy[substituteIndex]);
        substitutesCopy.splice(substituteIndex, 1);
      } else {
        let substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position > POSITION_GOALKEEPER && substitute.position + 1 === player.position);
        if (substituteIndex >= 0) {
          finalPlayers[index] = substitutePlayer(substituedPlayer, substitutesCopy[substituteIndex], - 1);
          substitutesCopy.splice(substituteIndex, 1);
        } else {
          substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position > POSITION_GOALKEEPER && substitute.position + 2 === player.position);
          if (substituteIndex >= 0) {
            finalPlayers[index] = substitutePlayer(substituedPlayer, substitutesCopy[substituteIndex], - 2);
            substitutesCopy.splice(substituteIndex, 1);
          }
        }
      }
    }
  });
  return finalPlayers;
};

/**
 * Effectue le remplacement obligatoire du gardien (mode RL)
 */
const applyGoalkeeperSubstitution = (finalPlayers, substitutesCopy) => {
  const goalkeeperIndex = finalPlayers.findIndex(player => player.position === POSITION_GOALKEEPER);
  const goalkeeper = finalPlayers[goalkeeperIndex];
  if (! goalkeeper.rating) {
    const substituedPlayer = new Player(goalkeeper);
    const substituteIndex = substitutesCopy.findIndex(substitute => substitute.rating && substitute.position === goalkeeper.position);
    if (substituteIndex >= 0) {
      finalPlayers[goalkeeperIndex] = substitutePlayer(substituedPlayer, substitutesCopy[substituteIndex]);
      substitutesCopy.splice(substituteIndex, 1);
    }
  }
  return finalPlayers;
};

/**
 * Effectue les rentrées de Rotaldo
 */
const applyRotaldoSubstitutions = (finalPlayers) => {
  let rotaldoAmount = finalPlayers.filter(player => player.lastName === "Rotaldo").length;
  return finalPlayers.map(player => {
    if (! player.rating) {
      const substituedPlayer = new Player(player);
      rotaldoAmount ++;
      return new Rotaldo({
        ...player,
        ownGoals: rotaldoAmount % 3 ? 0 : 1,
        isSubstitute: true,
        substitued: substituedPlayer,
      });
    }
    return player;
  });
};

const substitutePlayer = (substituedPlayer, substitute, bonusRating = 0) => {
  const newSubstitute = new Player(substitute);
  newSubstitute.bonusRating += bonusRating;
  newSubstitute.isSubstitute = true;
  newSubstitute.substitued = substituedPlayer;
  return newSubstitute;
};

export { doMatchSubstitutions };