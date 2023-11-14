import { describe, it, expect, beforeEach } from "vitest";

import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { setMpgGoals } from "../mpgGoalEventManager";

import matchMock from "@/assets/mocks/match/response.js";

describe("Le MpgGoalEventCalculator", () => {

  let match;
  beforeEach(() => {
    match = matchConstructor(matchMock);

    resetPlayerRatings(match.homeTeam.pitchPlayers);
    match.homeTeam.substitutions = [];
    resetPlayerRatings(match.awayTeam.pitchPlayers);
    match.awayTeam.substitutions = [];
  });

  it("calcule les buts MPG de l'équipe à domicile", () => {
    match.homeTeam.pitchPlayers[10].rating = 5; // Goal MPG
    match.homeTeam.pitchPlayers[9].rating = 4.5; // No goal MPG

    setMpgGoals(match);

    expect(match.homeTeam.pitchPlayers[10].mpgGoals).toBe(1);
    expect(match.homeTeam.pitchPlayers[9].mpgGoals).toBe(0);
  });

  it("calcule les buts MPG de l'équipe à l'extérieur", () => {
    match.awayTeam.pitchPlayers[10].rating = 5.5; // Goal MPG
    match.awayTeam.pitchPlayers[9].rating = 5; // No goal MPG

    setMpgGoals(match);

    expect(match.awayTeam.pitchPlayers[10].mpgGoals).toBe(1);
    expect(match.awayTeam.pitchPlayers[9].mpgGoals).toBe(0);
  });

  it("en ne permettant pas à un joueur qui a un but réel annulé de marquer en MPG", () => {
    match.awayTeam.pitchPlayers[10].rating = 6; // Goal MPG
    match.awayTeam.pitchPlayers[10].goals = 1;
    match.awayTeam.pitchPlayers[10].canceledGoals = 1; // Bonus valise

    setMpgGoals(match);

    expect(match.awayTeam.pitchPlayers[10].mpgGoals).toBe(0);
  });

  it("considère les 2 équipes comme jouant à domicile pour un match de tournoi", () => {
    match.isTournament = true;
    match.homeTeam.pitchPlayers[10].rating = 5; // Goal MPG
    match.awayTeam.pitchPlayers[10].rating = 5; // Goal MPG

    setMpgGoals(match);

    expect(match.homeTeam.pitchPlayers[10].mpgGoals).toBe(1);
    expect(match.awayTeam.pitchPlayers[10].mpgGoals).toBe(1);
  });

});

function resetPlayerRatings (players) {
  players.forEach(player => {
    player.rating = 4;
    player.bonusRating = 0;
  });
}