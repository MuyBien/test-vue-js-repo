import { describe, it, expect, beforeEach } from "vitest";

import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { setMpgSaves } from "../mpgSaveEventManager";

import matchMock from "@/assets/mocks/match/response.js";
import { Match } from "@/models/match/Match";

describe("Le MpgSaveEventManager", () => {

  let match;
  beforeEach(() => {
    match = matchConstructor(matchMock);

    resetPlayerRatings(match.homeTeam.pitchPlayers);
    match.homeTeam.substitutions = [];
    resetPlayerRatings(match.awayTeam.pitchPlayers);
    match.awayTeam.substitutions = [];
  });

  it("renvoi un nouveau match après les calculs", () => {
    const newMatch = setMpgSaves(match);

    expect(newMatch).not.toBe(match);
    expect(newMatch).toBeInstanceOf(Match);
    expect(newMatch.id).toEqual(match.id);
  });

  it("annule un but d'un joueur de l'équipe à l'extérieur si le gardien à domicile arrête un but", () => {
    match.homeTeam.pitchPlayers[0].rating = 8;
    match.homeTeam.pitchPlayers[10].goals = 1;
    match.awayTeam.pitchPlayers[10].goals = 1;

    const newMatch = setMpgSaves(match);

    expect(newMatch.homeTeam.pitchPlayers[10].goals).toBe(1);
    expect(newMatch.awayTeam.pitchPlayers[10].goals).toBe(1);
    expect(newMatch.awayTeam.pitchPlayers[10].savedGoals).toBe(1);
  });

  it("annule un but d'un joueur de l'équipe à domicile si le gardien à l'extérieur arrête un but", () => {
    match.awayTeam.pitchPlayers[0].rating = 8;
    match.awayTeam.pitchPlayers[10].goals = 1;
    match.homeTeam.pitchPlayers[10].goals = 1;

    const newMatch = setMpgSaves(match);

    expect(newMatch.awayTeam.pitchPlayers[10].goals).toBe(1);
    expect(newMatch.homeTeam.pitchPlayers[10].goals).toBe(1);
    expect(newMatch.homeTeam.pitchPlayers[10].savedGoals).toBe(1);
  });

  it("n'annule aucun but si le gardien ne fait pas d'arrêt", () => {
    match.homeTeam.pitchPlayers[0].goals = 1;
    match.awayTeam.pitchPlayers[0].goals = 0;

    const originalMatch = new Match(match);
    const newMatch = setMpgSaves(originalMatch);

    expect(newMatch.homeTeam.pitchPlayers[0].savedGoals).toBe(0);
    expect(newMatch.awayTeam.pitchPlayers[0].savedGoals).toBe(0);
  });

  it("n'annule aucun but si il n'y a aucun but à annuler", () => {
    match.awayTeam.pitchPlayers[0].rating = 8;

    const originalMatch = new Match(match);
    const newMatch = setMpgSaves(originalMatch);

    expect(newMatch.homeTeam.pitchPlayers.reduce((totalSaved, player) => totalSaved + player.savedGoals, 0)).toBe(0);
    expect(newMatch.awayTeam.pitchPlayers.reduce((totalSaved, player) => totalSaved + player.savedGoals, 0)).toBe(0);
  });
});

function resetPlayerRatings (players) {
  players.forEach(player => {
    player.rating = 4;
    player.bonusRating = 0;
    player.goals = 0;
  });
}