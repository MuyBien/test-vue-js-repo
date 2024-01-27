import { Match } from "@/models/match/Match";
import { setMpgGoals } from "@/utils/mpg-events/mpgGoalEventManager";
import { setMpgSaves } from "@/utils/mpg-events/mpgSaveEventManager";
import { setScore } from "@/utils/score/score";
import { doMatchSubstitutions } from "@/utils/substitutions/substitutionMaker";

const calculateFinalMatch = (match) => {

  const matchCopy = new Match(match);

  setOnPitchRotaldoOwnGoals(matchCopy);

  applyMatchBonuses(matchCopy, "beforeAll");
  applyMatchBonuses(matchCopy, "before");

  const finalMatch = doMatchSubstitutions(matchCopy);

  applyMatchBonuses(finalMatch, "afterSubstitutions");

  setMpgGoals(finalMatch);
  setMpgSaves(finalMatch);

  applyMatchBonuses(finalMatch, "after");

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

const setOnPitchRotaldoOwnGoals = (match) => {
  setOnPitchTeamRotaldoOwnGoals(match.homeTeam);
  setOnPitchTeamRotaldoOwnGoals(match.awayTeam);
};

const setOnPitchTeamRotaldoOwnGoals = (team) => {
  let homeRotaldoAmount = 0;
  team.pitchPlayers.forEach(player => {
    if (player.lastName === "Rotaldo") {
      homeRotaldoAmount ++;
      if (homeRotaldoAmount === 3) {
        player.ownGoals = 1;
        homeRotaldoAmount = 0;
      }
    }
  });
};

export { calculateFinalMatch };