import { beforeEach, describe, expect, it } from "vitest";

import { multipleResultMatchCalculator } from "../multipleResultMatchCalculator";

import mockMatch from "@/assets/mocks/match/response";
import { RemoveRandomPlayerBonus } from "@/models/bonus";
import { matchConstructor } from "@/utils/constructors/matchConstructor";

describe("Le calculateur de résultat multiple de match", () => {

  let match;

  beforeEach(() => {
    match = matchConstructor(mockMatch);
    match.homeTeam.bonus = new RemoveRandomPlayerBonus();
  });

  it("calcule tous les résultats possibles avec 1 chapron rouge", () => {
    const results = multipleResultMatchCalculator(match);

    expect(results).toBeInstanceOf(Array);
    expect(results).toHaveLength(20);

    const scoreList = results.map(match => match.score);
    expect(JSON.stringify(scoreList)).toContain("[0,0]");
  });

  it("ne remplace pas le gardien", () => {
    const results = multipleResultMatchCalculator(match);

    const playersReplaced = results.map(match => {
      return [
        match.homeTeam.bonus.team,
        match.homeTeam.bonus.position,
      ];
    });
    expect(JSON.stringify(playersReplaced)).not.toContain("\"team\",0"); // position = 0 = gardien
  });

  describe("dans le cas de 2 chaprons rouges", () => {

    beforeEach(() => {
      match.awayTeam.bonus = new RemoveRandomPlayerBonus();
    });

    it("calcule tous les résultats possibles", () => {
      const results = multipleResultMatchCalculator(match);

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(380);

      const scoreList = results.map(match => match.score);
      expect(JSON.stringify(scoreList)).toContain("[0,0]");
    });

    it("ne remplace pas 2 fois le même joueur", () => {
      const results = multipleResultMatchCalculator(match);

      const playersReplaced = results.map(match => {
        return [
          match.homeTeam.bonus.team,
          match.homeTeam.bonus.position,
          match.awayTeam.bonus.team,
          match.awayTeam.bonus.position,
        ];
      });
      expect(JSON.stringify(playersReplaced)).not.toContain("[\"team\",1,\"opponentTeam\",1]"); // team de home === opponentTeam de away
    });

  });

});