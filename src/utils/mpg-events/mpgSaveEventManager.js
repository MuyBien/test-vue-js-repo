/**
 * Renvoi un nouveau match avec les buts arrêtés par les gardien le cas échéant.
 * @param {Match} match
 * @returns {Match} - Un nouvel objet `Match` avec les buts annulés si un arrêt de but a été effectué par une des équipes.
*/
const setMpgSaves = (match) => {
  if (isSavingGoal(match.homeTeam)) {
    cancelPlayerGoal(match.awayTeam);
  }
  if (isSavingGoal(match.awayTeam)) {
    cancelPlayerGoal(match.homeTeam);
  }
};

const isSavingGoal = (team) => {
  return team.pitchPlayers[0].getTotalScore() >= 8;
};

const cancelPlayerGoal = (team) => {
  const firstScorer = team.pitchPlayers.find(player => player.goals > 0);
  if (firstScorer) {
    firstScorer.savedGoals += 1;
  }
};

export { setMpgSaves };