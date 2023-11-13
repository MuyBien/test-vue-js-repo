import { calculateTournamentTeamAverage, calculatePositionsAverages } from "@/utils/averages/averageCalculator";

const getQualified = (match) => {
  const finalScore = match.score;

  if (finalScore[0] === finalScore[1]) {

    const homeTeamAverage = calculateTournamentTeamAverage(match.homeTeam);
    const awayTeamAverage = calculateTournamentTeamAverage(match.awayTeam);

    if (homeTeamAverage > awayTeamAverage) {
      return match.homeTeam;
    } else if (awayTeamAverage > homeTeamAverage) {
      return match.awayTeam;
    }

    // Compare par lignes (Forward, Middle, Backer, Goalkeeper)
    const homeTeamLinesAverages = calculatePositionsAverages(match.homeTeam);
    const awayTeamLinesAverages = calculatePositionsAverages(match.awayTeam);

    for (let line = 3; line >= 0; line --) {
      const lineAverageDiff = homeTeamLinesAverages[line] - awayTeamLinesAverages[line];
      if (lineAverageDiff !== 0) {
        return lineAverageDiff > 0 ? match.homeTeam : match.awayTeam;
      }
    }

    return undefined; // Aucune équipe n'est qualifiée
  }
  return finalScore[0] - finalScore[1] > 0 ? match.homeTeam : match.awayTeam;
};

export { getQualified };