import { describe, it, expect, beforeEach } from "vitest";

import { setScore } from "../score";
import { Team } from "@/models/teams/Team";
import { Player } from "@/models/players/Player";

describe("La méthode setScore", () => {

  let match; beforeEach(() => {
    const homeTeam = new Team();
    homeTeam.pitchPlayers = Array.from({ length: 11 }, () => new Player());
    const awayTeam = new Team();
    awayTeam.pitchPlayers = Array.from({ length: 11 }, () => new Player());
    match = {
      homeTeam,
      awayTeam,
    };
  });

  it("calcule et attribue le bon score du match", () => {
    match.homeTeam.pitchPlayers[0].goals = 2;
    match.homeTeam.pitchPlayers[1].goals = 1;
    match.homeTeam.pitchPlayers[2].ownGoals = 1;
    match.awayTeam.pitchPlayers[0].goals = 1;
    match.awayTeam.pitchPlayers[1].canceledGoals = 1;

    setScore(match);

    expect(match.score).toEqual([3, 1]);
  });

  it("gère les matchs avec aucun but", () => {
    setScore(match);
    expect(match.score).toEqual([0, 0]);
  });

  it("ne compte pas les buts annulés", () => {
    match.awayTeam.pitchPlayers[0].goals = 1;
    match.awayTeam.pitchPlayers[0].canceledGoals = 1;

    setScore(match);

    expect(match.score).toEqual([0, 0]);
  });

  it("ne compte pas les buts arrêtés", () => {
    match.awayTeam.pitchPlayers[0].goals = 1;
    match.awayTeam.pitchPlayers[0].savedGoals = 1;

    setScore(match);

    expect(match.score).toEqual([0, 0]);
  });
});