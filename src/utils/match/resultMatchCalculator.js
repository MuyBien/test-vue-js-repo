import { doMatchSubstitutions } from "@/utils/substitutions/substitutionMaker";
import { setMpgGoals } from "@/utils/mpg-events/mpgGoalEventManager";
import { setMpgSaves } from "@/utils/mpg-events/mpgSaveEventManager";
import { setScore } from "@/utils/score/score";

const calculateFinalMatch = (match) => {
  const finalMatch = doMatchSubstitutions(match);
  setMpgGoals(finalMatch);
  setMpgSaves(finalMatch);
  setScore(finalMatch);
  return finalMatch;
};

export { calculateFinalMatch };