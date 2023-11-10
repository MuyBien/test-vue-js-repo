import { Match } from "@/models_refactored/match/Match";
import { roundFloat } from "@/utils/math";

const POSITION_BACKER = 2;
const POSITION_MIDDLE = 3;
const POSITION_FORWARD = 4;

/**
 * Donne les buts MPG dans les 2 équipes du match d'une ligue
 * @param {Match}
 * @returns {Match} Un match avec les buts MPG
 */
const setMpgGoals = (match) => {
  const newMatch = new Match(match);
  setTeamMpgGoals(newMatch.homeTeam, newMatch.awayTeam, true);
  setTeamMpgGoals(newMatch.awayTeam, newMatch.homeTeam, match.isTournament);
  return newMatch;
};

/**
 * Donne un but MPG aux joueurs qui le peuvent
 * @param {Team} team
 * @param {Boolean} isHome Si le joueur joue à domicile ou non
 */
const setTeamMpgGoals = (team, opponentTeam, isHome) => {
  const opponentTeamAverages = getAverages(opponentTeam);
  const potentialScorers = getPotentialScorers(team);

  const scorers = potentialScorers
    .filter(player => isScoringMpgGoal(player, opponentTeamAverages, isHome))
    .map(player => player.playerId);

  scorers.forEach((scorerId) => {
    const scorerIndex = team.pitchPlayers.findIndex(player => player.playerId === scorerId);
    team.pitchPlayers[scorerIndex].mpgGoals = 1;
  });
};

/**
   * Calcule les moyennes lignes par lignes de l'équipe
   * @param {Team}
   * @returns { Array } les moyennes ligne par ligne
   */
const getAverages = (team) => {
  const finalPlayers = team.pitchPlayers;

  const calculatePositionAverage = position => {
    const players = finalPlayers.filter(player => player.position === position);
    const average = players.reduce((total, player) => total + player.getTotalScore(), 0) / players.length;
    return roundFloat(average, 2);
  };

  const forwardAverage = calculatePositionAverage(POSITION_FORWARD);
  const middleAverage = calculatePositionAverage(POSITION_MIDDLE);
  const backerAverage = calculatePositionAverage(POSITION_BACKER);

  return [finalPlayers[0].getTotalScore(), backerAverage, middleAverage, forwardAverage];
};

/**
 * Renvoi la liste des joueurs pouvant marquer un but MPG
 * @param {Team} team
 * @returns {Players[]} la liste des joueurs pouvant marquer un but MPG
 */
const getPotentialScorers = (team) => {
  return team.pitchPlayers.filter(player => player.getTotalScore() >= 5 && player.goals === 0 && player.position > 1);
};

/**
 * Renvoi true ou false si le joueur marque un but MPG
 * @param {Player} player Le joueur à tester
 * @param {Array} teamAverages les moyennes des lignes de l'équipe adverse
 * @param {Boolean} isHome Le joueur joue à domicile ou non
 * @returns Boolean true si le joueur marque en MPG
 */
const isScoringMpgGoal = (player, teamAverages, isHome) => {
  const LINES_TO_PASS = {
    4: [2, 1],
    3: [3, 2, 1],
    2: [4, 3, 2, 1],
  };
  return LINES_TO_PASS[player.position].every((lineToPass, index) => {
    const dribbleMalus = getDribbleMalus(index);
    const playerNote = player.getTotalScore() - dribbleMalus;
    return isHome ? playerNote >= teamAverages[lineToPass - 1] : playerNote > teamAverages[lineToPass - 1];
  });
};

/**
 *
 * @param {Number} lineIndex le nombre de ligne déjà passée
 * @returns le malus à appliquer à la note pour calculer la suite du but MPG (0 = 0, 1 = 1, 2 = 1.5, 3 = 2)
 */
const getDribbleMalus = (lineIndex) => {
  const DRIBBLE_MALUS_BASE = 0;
  const DRIBBLE_MALUS_INCREMENT = 0.5;

  return lineIndex === 0 ? DRIBBLE_MALUS_BASE : (lineIndex + 1) * DRIBBLE_MALUS_INCREMENT;
};

export { setMpgGoals };