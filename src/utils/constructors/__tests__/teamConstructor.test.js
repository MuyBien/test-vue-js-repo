import { describe, it, expect, beforeEach } from "vitest";

import { teamConstructor } from "../teamConstructor";
import { Team } from "@/models/teams/Team";
import { BONUSES } from "@/constants/bonus";

import matchMock from "@/assets/mocks/match/response.js";

describe("Le constructeur d'équipe", () => {

  let team;
  beforeEach(() => {
    team = teamConstructor(matchMock.home);
  });

  it("renvoi une instance de Team remplie", () => {
    expect(team).toBeInstanceOf(Team);
  });

  it("défini le paramètre capitaine sur le bon joueur", () => {
    const expectedCaptainId = matchMock.home.captain;
    const actualCaptain = team.pitchPlayers.find(player => player.isCaptain);
    expect(actualCaptain.playerId).toBe(expectedCaptainId);
  });

  it("défini la bonne instance de bonus", () => {
    expect(team.bonus).toBeInstanceOf(BONUSES["boostAllPlayers"]);
  });
});