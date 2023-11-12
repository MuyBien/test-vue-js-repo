import { Match } from "@/models/match/Match";
import { doMatchSubstitutions } from "@/utils/substitutions/substitutionMaker";
import { setMpgGoals } from "@/utils/mpg-events/mpgGoalEventManager";
import { setMpgSaves } from "@/utils/mpg-events/mpgSaveEventManager";
import { setScore } from "@/utils/score/score";

const calculateFinalMatch = (match) => {

  const matchCopy = new Match(match);
  applyMatchBonuses(matchCopy, "before");

  const finalMatch = doMatchSubstitutions(matchCopy);

  applyMatchBonuses(matchCopy, "afterSubstitutions");

  setMpgGoals(finalMatch);
  setMpgSaves(finalMatch);

  applyMatchBonuses(matchCopy, "after");

  setScore(finalMatch);
  return finalMatch;
};

const applyMatchBonuses = (match, timing) => {
  applyBonus(match.homeTeam, match.awayTeam, timing);
  applyBonus(match.awayTeam, match.homeTeam, timing);
};

const applyBonus = (team, opponentTeam, timing) => {
  if (team.bonus.timing === timing && ! team.bonus.isLiveApplied) {
    team.bonus.apply(team, opponentTeam);
  }
};

export { calculateFinalMatch };