import { describe, it, expect, beforeEach } from "vitest";

import { multipleResultMatchCalculator } from "../multipleResultMatchCalculator";

import { matchConstructor } from "@/utils/constructors/matchConstructor";
import mockMatch from "@/assets/mocks/match/response";

describe("multipleResultMatchCalculator Tests", () => {

  let match;

  beforeEach(() => {
    match = matchConstructor(mockMatch);
  });

  it("calcule des résultats différents pour chaque remplacement de joueur", () => {
    const results = multipleResultMatchCalculator(match);

    expect(results).toBeInstanceOf(Map);
    expect(results.size).toBe(20);

    const scoreList = Array.from(results.values()).map(match => match.score);
    expect(JSON.stringify(scoreList)).toContain("[0,0]");
  });

});