import { describe, it, expect, beforeEach } from "vitest";

import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { setMpgGoals } from "../mpgGoalManager";

import matchMock from "@/assets/mocks/match/response.js";

describe("Le MpgGoalCalculator", () => {

  let match;
  beforeEach(() => {
    match = matchConstructor(matchMock);

    resetPlayerRatings(match.homeTeam.pitchPlayers);
    match.homeTeam.substitutions = [];
    resetPlayerRatings(match.awayTeam.pitchPlayers);
    match.awayTeam.substitutions = [];
  });

  it("Calcule les buts MPG de l'équipe à domicile", () => {
    match.homeTeam.pitchPlayers[10].rating = 5; // Goal MPG
    match.homeTeam.pitchPlayers[9].rating = 4.5; // No goal MPG

    const updatedMatch = setMpgGoals(match);

    expect(updatedMatch.homeTeam.pitchPlayers[10].mpgGoals).toBe(1);
    expect(updatedMatch.homeTeam.pitchPlayers[9].mpgGoals).toBe(0);
  });

  it("Calcule les buts MPG de l'équipe à l'extérieur", () => {
    match.awayTeam.pitchPlayers[10].rating = 5.5; // Goal MPG
    match.awayTeam.pitchPlayers[9].rating = 5; // No goal MPG

    const updatedMatch = setMpgGoals(match);

    expect(updatedMatch.awayTeam.pitchPlayers[10].mpgGoals).toBe(1);
    expect(updatedMatch.awayTeam.pitchPlayers[9].mpgGoals).toBe(0);
  });

  it("En ne permettant pas à un joueur qui a un but réel annulé de marquer en MPG", () => {
    match.awayTeam.pitchPlayers[10].rating = 6; // Goal MPG
    match.awayTeam.pitchPlayers[10].goals = 1;
    match.awayTeam.pitchPlayers[10].canceledGoals = 1; // Bonus valise

    const updatedMatch = setMpgGoals(match);

    expect(updatedMatch.awayTeam.pitchPlayers[10].mpgGoals).toBe(0);
  });

});

function resetPlayerRatings (players) {
  players.forEach(player => {
    player.rating = 4;
    player.bonusRating = 0;
  });
}