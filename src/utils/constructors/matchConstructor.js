import { Match } from "@/models_refactored/Match";
import { teamConstructor } from "@/utils/constructors/teamConstructor";

const matchConstructor = (matchData) => {
  const match = new Match();
  match.id = matchData.id;

  match.homeTeam = teamConstructor(matchData.home);
  match.awayTeam = teamConstructor(matchData.away);

  return match;
};

export { matchConstructor };