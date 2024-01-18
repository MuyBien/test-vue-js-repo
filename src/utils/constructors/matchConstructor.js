import { Match } from "@/models/match/Match";
import { teamConstructor } from "@/utils/constructors/teamConstructor";

const matchConstructor = (matchData) => {
  const match = new Match();
  match.id = matchData.id;
  match.championshipId = matchData.championshipId;
  match.championshipSeason = matchData.championshipSeason;

  match.homeTeam = teamConstructor(matchData.home);
  match.awayTeam = teamConstructor(matchData.away);

  return match;
};

export { matchConstructor };