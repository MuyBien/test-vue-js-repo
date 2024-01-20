import { Match } from "@/models/match/Match";
import { roundFloat } from "../math/math";

/**
 * Renvoi un nouveau match en ajoutant la note moyenne des joueurs
 * dont le match n'a pas encore commencé
 * @param {Match} match le match à modifier
 * @param {*} championshipMatches matchs du championnat
 * @returns {Match} le match avec les moyennes pour les joueurs
 */
const setMatchPlayersAverageRating = async (match, championshipMatches, getPlayerInfos) => {
  const matchCopy = new Match(match);
  const notStartedTeams = getNotStartedTeams(championshipMatches);

  await setTeamPlayersAverageRating(matchCopy.homeTeam, match, notStartedTeams, getPlayerInfos);
  await setTeamPlayersAverageRating(matchCopy.awayTeam, match, notStartedTeams, getPlayerInfos);

  return matchCopy;
};

const getNotStartedTeams = (championshipMatches) => {
  const notStartedChampionshipMatches = Object.values(championshipMatches).filter((match) => {
    return match.period !== "fullTime";
  });
  const notStartedTeamIds = [];
  notStartedChampionshipMatches.forEach(async (championshipMatch) => {
    notStartedTeamIds.push(championshipMatch.home.clubId);
    notStartedTeamIds.push(championshipMatch.away.clubId);
  });
  return notStartedTeamIds;
};

const setTeamPlayersAverageRating = async (team, match, notStartedTeams, getPlayerInfos) => {
  for (const player of team.pitchPlayers) {
    if (notStartedTeams.includes(player.clubId)) {
      await setPlayerAverageRating(player, match.championshipId, match.championshipSeason, getPlayerInfos);
    }
  }
  for (const player of team.benchPlayers) {
    if (notStartedTeams.includes(player.clubId)) {
      await setPlayerAverageRating(player, match.championshipId, match.championshipSeason, getPlayerInfos);
    }
  }
};

const setPlayerAverageRating = async (player, championshipId, season, getPlayerInfos) => {
  const { averageRating } = await getPlayerInfos(player.playerId, championshipId, season);
  if (averageRating) {
    player.rating = roundFloat(averageRating, 1);
    player.isAverageRating = true;
  }
};

export { setMatchPlayersAverageRating };