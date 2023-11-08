const getLiveScore = (match) => {
  return [match.homeTeam.score, match.awayTeam.score];
};

const getScore = (match) => {
  const homeTeamGoals = match.homeTeam.getFinalTeamGoals();
  const awayTeamGoals = match.awayTeam.getFinalTeamGoals();

  return [
    homeTeamGoals.goals + awayTeamGoals.ownGoals - match.goalkeeperSaves.homeTeam.length,
    awayTeamGoals.goals + homeTeamGoals.ownGoals - match.goalkeeperSaves.awayTeam.length,
  ];
};

export {
  getLiveScore,
  getScore,
};