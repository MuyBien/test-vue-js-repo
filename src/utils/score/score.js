const setScore = (match) => {
  const homeGoals = match.homeTeam.pitchPlayers.reduce((total, player) => total + player.goals + player.mpgGoals - player.ownGoals - player.canceledGoals - player.savedGoals, 0);
  const awayGoals = match.awayTeam.pitchPlayers.reduce((total, player) => total + player.goals + player.mpgGoals - player.ownGoals - player.canceledGoals - player.savedGoals, 0);
  match.score = [homeGoals, awayGoals];
};

export { setScore };