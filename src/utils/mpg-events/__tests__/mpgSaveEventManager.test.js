import { beforeEach, describe, expect, it } from "vitest";

import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { setMpgSaves } from "../mpgSaveEventManager";

import matchMock from "@/assets/mocks/match/response.js";

describe("Le MpgSaveEventManager", () => {

  let match;
  beforeEach(() => {
    match = matchConstructor(matchMock);

    resetPlayerRatings(match.homeTeam.pitchPlayers);
    match.homeTeam.substitutions = [];
    resetPlayerRatings(match.awayTeam.pitchPlayers);
    match.awayTeam.substitutions = [];
  });

  it("annule un but d'un joueur de l'équipe à l'extérieur si le gardien à domicile arrête un but", () => {
    match.homeTeam.pitchPlayers[0].rating = 8;
    match.homeTeam.pitchPlayers[10].goals = 1;
    match.awayTeam.pitchPlayers[10].goals = 1;

    setMpgSaves(match);

    expect(match.homeTeam.pitchPlayers[10].goals).toBe(1);
    expect(match.awayTeam.pitchPlayers[10].goals).toBe(1);
    expect(match.awayTeam.pitchPlayers[10].savedGoals).toBe(1);
  });

  it("annule un but d'un joueur de l'équipe à domicile si le gardien à l'extérieur arrête un but", () => {
    match.awayTeam.pitchPlayers[0].rating = 8;
    match.awayTeam.pitchPlayers[10].goals = 1;
    match.homeTeam.pitchPlayers[10].goals = 1;

    setMpgSaves(match);

    expect(match.awayTeam.pitchPlayers[10].goals).toBe(1);
    expect(match.homeTeam.pitchPlayers[10].goals).toBe(1);
    expect(match.homeTeam.pitchPlayers[10].savedGoals).toBe(1);
  });

  it("n'annule aucun but si le gardien ne fait pas d'arrêt", () => {
    match.homeTeam.pitchPlayers[0].goals = 1;
    match.awayTeam.pitchPlayers[0].goals = 0;

    setMpgSaves(match);

    expect(match.homeTeam.pitchPlayers[0].savedGoals).toBe(0);
    expect(match.awayTeam.pitchPlayers[0].savedGoals).toBe(0);
  });

  it("n'annule aucun but si il n'y a aucun but à annuler", () => {
    match.awayTeam.pitchPlayers[0].rating = 8;

    setMpgSaves(match);

    expect(match.homeTeam.pitchPlayers.reduce((totalSaved, player) => totalSaved + player.savedGoals, 0)).toBe(0);
    expect(match.awayTeam.pitchPlayers.reduce((totalSaved, player) => totalSaved + player.savedGoals, 0)).toBe(0);
  });
});

function resetPlayerRatings (players) {
  players.forEach(player => {
    player.rating = 4;
    player.bonusRating = 0;
    player.goals = 0;
  });
}