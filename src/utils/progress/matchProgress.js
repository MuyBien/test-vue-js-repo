/**
 * Calcule la progression du match en fonction des joueurs qui n'ont pas encore joué.
 *
 * @param {Object} match - L'objet match à calculer (doit être un match final)
 * @returns {number} - La progression du match en pourcentage
 */
const getMatchProgress = (match) => {
  const allPositions = match.homeTeam.pitchPlayers.concat(match.awayTeam.pitchPlayers);
  const positionsNotPlayed = allPositions.filter((player) => {
    return player.isAverageRating || player.isLiveRating || player.substitued?.isAverageRating || player.substitued?.isLiveRating;
  });
  return Math.round(100 - (positionsNotPlayed.length / allPositions.length) * 100);
};

export { getMatchProgress };