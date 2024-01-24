import { Match } from "@/models/match/Match";

/**
 * Renvoi un nouveau match en ajoutant la note moyenne des joueurs
 * dont le match n'a pas encore commencé
 * @param {Match} match le match à modifier
 * @param {*} championshipMatches matchs du championnat
 * @returns {Match} le match avec les moyennes pour les joueurs
 */
const setMatchPlayersLiveStatus = (match, championshipMatches) => {
  const matchCopy = new Match(match);
  const liveTeams = getLiveTeams(championshipMatches);

  setTeamPlayersLiveStatus(matchCopy.homeTeam, liveTeams);
  setTeamPlayersLiveStatus(matchCopy.awayTeam, liveTeams);

  return matchCopy;
};

const getLiveTeams = (championshipMatches) => {
  const notStartedChampionshipMatches = Object.values(championshipMatches).filter((match) => {
    const startedPeriods = ["firstHalf", "halfTime", "secondHalf"];
    return match.period && startedPeriods.includes(match.period);
  });
  const liveTeamIds = [];
  notStartedChampionshipMatches.forEach((championshipMatch) => {
    liveTeamIds.push(championshipMatch.home.clubId);
    liveTeamIds.push(championshipMatch.away.clubId);
  });
  return liveTeamIds;
};

const setTeamPlayersLiveStatus = (team, liveTeams) => {
  team.pitchPlayers.forEach((player) => {
    if (liveTeams.includes(player.clubId)) {
      player.isLiveRating = true;
    }
  });
  team.benchPlayers.forEach((player) => {
    if (liveTeams.includes(player.clubId)) {
      player.isLiveRating = true;
    }
  });
};

export { setMatchPlayersLiveStatus };