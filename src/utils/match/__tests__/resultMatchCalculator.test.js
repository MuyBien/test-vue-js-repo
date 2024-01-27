import { beforeEach, describe, expect, it } from "vitest";

import { calculateFinalMatch } from "../resultMatchCalculator";

import mockMatch from "@/assets/mocks/match/response";
import { Match } from "@/models/match/Match";
import { matchConstructor } from "@/utils/constructors/matchConstructor";

describe("Le calculateur de résultat de match", () => {

  let match;

  beforeEach(() => {
    match = matchConstructor(mockMatch);
  });

  it("calcule le résultat final d'un match", () => {
    const resultMatch = calculateFinalMatch(match);
    expect(resultMatch).toBeInstanceOf(Match);
  });

  it("attribue les CSC aux Rotaldos présents sur le terrain", () => {
    match.homeTeam.pitchPlayers[0].lastName = "Rotaldo";
    match.homeTeam.pitchPlayers[3].lastName = "Rotaldo";
    match.homeTeam.pitchPlayers[4].lastName = "Rotaldo";
    match.homeTeam.benchPlayers = [];
    match.homeTeam.substitutions = [];

    match.awayTeam.pitchPlayers[3].lastName = "Rotaldo";
    match.awayTeam.pitchPlayers[4].lastName = "Rotaldo";
    match.awayTeam.pitchPlayers[9].lastName = "Rotaldo";
    match.awayTeam.benchPlayers = [];
    match.awayTeam.substitutions = [];

    const resultMatch = calculateFinalMatch(match);

    expect(resultMatch.homeTeam.pitchPlayers[0].ownGoals).toBe(0);
    expect(resultMatch.homeTeam.pitchPlayers[3].ownGoals).toBe(0);
    expect(resultMatch.homeTeam.pitchPlayers[4].ownGoals).toBe(1);

    expect(resultMatch.awayTeam.pitchPlayers[9].ownGoals).toBe(1);
  });

});