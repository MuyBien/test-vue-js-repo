/**
 * Calcule la progression du match en fonction des joueurs qui n'ont pas encore joué.
 *
 * @param {Object} match - L'objet match à calculer (doit être un match final)
 * @returns {number} - La progression du match en pourcentage
 */
const getMatchProgress = (match) => {
  const positionsNotPlayed = getMatchUnfinishedPosition(match);

  const allPositions = match.homeTeam.pitchPlayers.concat(match.awayTeam.pitchPlayers);
  return Math.round(100 - (positionsNotPlayed.length / allPositions.length) * 100);
};

const getMatchUnfinishedPosition = (match) => {
  const homePositionsNotPlayed = match.homeTeam.isLiveSubstitutesEnabled ? getLiveTeamUnfinishedPositions(match.homeTeam) : getTacticalTeamUnfinishedPositions(match.homeTeam);
  const awayPositionsNotPlayed = match.awayTeam.isLiveSubstitutesEnabled ? getLiveTeamUnfinishedPositions(match.awayTeam) : getTacticalTeamUnfinishedPositions(match.awayTeam);
  return homePositionsNotPlayed.concat(awayPositionsNotPlayed);
};

const getTacticalTeamUnfinishedPositions = (team) => {
  const unfinishedPositions = team.pitchPlayers.filter((player) => {
    return player.isAverageRating || player.isLiveRating || player.substitued?.isAverageRating || player.substitued?.isLiveRating;
  });
  return unfinishedPositions;
};

const getLiveTeamUnfinishedPositions = (team) => {
  const unfinishedPositions = team.pitchPlayers.filter((player) => {
    if (player.position === 1) {
      return player.isAverageRating || player.isLiveRating || player.substitued?.isAverageRating || player.substitued?.isLiveRating;
    }
    // TODO: Rotaldo remplace un joueur *titu* mais il y a des joueurs sur le banc du même poste...
    return player.substitued === undefined || player.substitued?.isAverageRating || player.substitued?.isLiveRating;
  });
  return unfinishedPositions;
};

export { getMatchProgress };