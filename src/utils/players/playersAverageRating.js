import { Match } from "@/models/match/Match";
import { openDB } from "idb";
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
    return match.matchStatus !== "postponed" && (! match.period || match.period === "preMatch");
  });
  const notStartedTeamIds = [];
  notStartedChampionshipMatches.forEach(async (championshipMatch) => {
    notStartedTeamIds.push(championshipMatch.home.clubId);
    notStartedTeamIds.push(championshipMatch.away.clubId);
  });
  return notStartedTeamIds;
};

const setTeamPlayersAverageRating = async (team, match, notStartedTeams, getPlayerInfos) => {
  const notPlayedPlayers = [];
  team.pitchPlayers.forEach((player) => {
    if (notStartedTeams.includes(player.clubId)) {
      notPlayedPlayers.push(setPlayerAverageRating(player, match.championshipId, match.championshipSeason, getPlayerInfos));
    }
  });
  team.benchPlayers.forEach((player) => {
    if (notStartedTeams.includes(player.clubId)) {
      notPlayedPlayers.push(setPlayerAverageRating(player, match.championshipId, match.championshipSeason, getPlayerInfos));
    }
  });
  await Promise.all(notPlayedPlayers);
};

const setPlayerAverageRating = async (player, championshipId, season, getPlayerInfos) => {
  let averageRating;

  const localPlayerInfos = await getLocalPlayerInfos(player.playerId);
  if (localPlayerInfos) {
    averageRating = localPlayerInfos.averageRating;
  } else {
    const playerInfos = await getPlayerInfos(player.playerId, championshipId, season);
    averageRating = playerInfos.averageRating;
    setLocalPlayerInfos(player.playerId, playerInfos);
  }

  if (averageRating) {
    player.rating = roundFloat(averageRating, 1);
    player.isAverageRating = true;
  }
};

const getLocalPlayerInfos = async (playerId) => {
  const db = await openDB("players-db", 1, {
    upgrade (db) {
      db.createObjectStore("playerInfos");
    },
  });

  const playerInfos = await db.get("playerInfos", playerId);
  if (playerInfos) {
    const currentTime = Date.now();
    const storedTime = playerInfos.updatedAt;
    const differenceInHours = (currentTime - storedTime) / (1000 * 60 * 60);

    if (differenceInHours < 48) {
      return playerInfos.data;
    }
  }
};

const setLocalPlayerInfos = async (playerId, playerInfos) => {
  const db = await openDB("players-db", 1, {
    upgrade (db) {
      db.createObjectStore("playerInfos");
    },
  });

  await db.put("playerInfos", {
    data: playerInfos,
    updatedAt: Date.now(),
  }, playerId);
};

export { setMatchPlayersAverageRating };