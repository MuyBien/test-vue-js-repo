/**
 * Calcule la progression d'une équipe en fonction des joueurs qui n'ont pas encore joué.
 *
 * @param {Object} team - L'objet Team à calculer (doit être dans un match final)
 * @returns {number} - La progression du match en pourcentage
 */
const getTeamProgress = (team) => {
  const positionsNotPlayed = getTeamUnfinishedPosition(team);
  return Math.round(100 - (positionsNotPlayed.length / 11) * 100);
};

const getTeamUnfinishedPosition = (team) => {
  const positionsNotPlayed = team.isLiveSubstitutesEnabled ? getLiveTeamUnfinishedPositions(team) : getTacticalTeamUnfinishedPositions(team);
  return positionsNotPlayed;
};

const getTacticalTeamUnfinishedPositions = (team) => {
  const unfinishedPositions = team.pitchPlayers.filter((player) => {
    return player.isAverageRating || player.isLiveRating || player.substitued?.isAverageRating || player.substitued?.isLiveRating;
  });
  return unfinishedPositions;
};

const getLiveTeamUnfinishedPositions = () => {
  return [];
};

export { getTeamProgress };