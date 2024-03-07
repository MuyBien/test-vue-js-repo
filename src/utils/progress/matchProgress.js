/**
 * Calcule la progression du match en fonction des joueurs qui n'ont pas encore joué.
 *
 * @param {Object} match - L'objet match à calculer (doit être un match final)
 * @returns {number} - La progression du match en pourcentage
 */
const getMatchProgress = (match) => {
  const allPlayers = match.homeTeam.pitchPlayers.concat(match.awayTeam.pitchPlayers);
  const playersNotPlayed = allPlayers.filter((player) => player.isAverageRating);
  return Math.round(100 - (playersNotPlayed.length / allPlayers.length) * 100);
};

export { getMatchProgress };