import { roundFloat } from "../math";

const POSITION_BACKER = 2;
const POSITION_MIDDLE = 3;
const POSITION_FORWARD = 4;

const calculateTournamentTeamAverage = (team) => {
  const teamAverage = team.pitchPlayers.reduce((total, player) => {
    const playerScore = getScoreWhithoutDefBonus(player);
    return total + playerScore;
  }, 0) / team.pitchPlayers.length;
  return roundFloat(teamAverage, 2);
};

/**
   * Permet de récupérer un nouveau joueur sans bonus défensif
   * @returns un nouveau joueur sans le bonus défensif (utile pour les tournois)
   */
const getScoreWhithoutDefBonus = (player) => {
  if (player.isBacker()) {
    let bonusRating = player.bonusRating;
    if (bonusRating >= 0) {
      bonusRating = player.isCaptain ? 0.5 : 0;
    }
    return player.rating + bonusRating;
  }
  return player.getTotalScore();
};

/**
   * Calcule les moyennes lignes par lignes de l'équipe
   * @param {Team}
   * @returns { Array } les moyennes ligne par ligne
   */
const calculatePositionsAverages = (team) => {
  const calculatePositionAverage = position => {
    const players = team.pitchPlayers.filter(player => player.position === position);
    const average = players.reduce((total, player) => total + player.getTotalScore(), 0) / players.length;
    return roundFloat(average, 2);
  };

  const forwardAverage = calculatePositionAverage(POSITION_FORWARD);
  const middleAverage = calculatePositionAverage(POSITION_MIDDLE);
  const backerAverage = calculatePositionAverage(POSITION_BACKER);

  return [team.pitchPlayers[0].getTotalScore(), backerAverage, middleAverage, forwardAverage];
};

export { calculateTournamentTeamAverage, calculatePositionsAverages };