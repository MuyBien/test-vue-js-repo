const setScore = (match) => {
  const homeGoals = getTeamGoals(match.homeTeam) + getTeamOwnGoals(match.awayTeam);
  const awayGoals = getTeamGoals(match.awayTeam) + getTeamOwnGoals(match.homeTeam);
  match.score = [homeGoals, awayGoals];
};

const getTeamGoals = (team) => {
  return team.pitchPlayers.reduce((total, player) => total + player.goals + player.mpgGoals - player.canceledGoals - player.savedGoals, 0);
};

const getTeamOwnGoals = (team) => {
  return team.pitchPlayers.reduce((total, player) => total + player.ownGoals, 0);
};

export { setScore };