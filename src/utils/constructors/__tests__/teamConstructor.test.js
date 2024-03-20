import { beforeEach, describe, expect, it } from "vitest";

import { BONUSES } from "@/constants/bonus";
import { LiveSubstitution } from "@/models/substitutions/LiveSubstitution";
import { Team } from "@/models/teams/Team";
import { teamConstructor } from "../teamConstructor";

import liveMatchMock from "@/assets/mocks/liveMatch/response.js";
import matchMock from "@/assets/mocks/match/response.js";

describe("Le constructeur d'équipe", () => {

  let team;
  beforeEach(() => {
    team = teamConstructor(matchMock.home);
  });

  it("renvoi une instance de Team remplie", () => {
    expect(team).toBeInstanceOf(Team);
  });

  it("défini les joueurs sur le terrain", () => {
    expect(team.pitchPlayers.length).toBe(11);
  });

  it("défini les joueurs sur le banc", () => {
    expect(team.benchPlayers.length).toBe(7);
  });

  it("défini le paramètre capitaine sur le bon joueur", () => {
    const expectedCaptainId = matchMock.home.captain;
    const actualCaptain = team.pitchPlayers.find(player => player.isCaptain);
    expect(actualCaptain.playerId).toBe(expectedCaptainId);
  });

  it("récupére le nom de l'équipe d'un tournoi", () => {
    matchMock.home.abbreviation = "AMB";
    team = teamConstructor(matchMock.home);
    expect(team.name).toBe("AMB");
  });

  it("défini la bonne instance de bonus", () => {
    expect(team.bonus).toBeInstanceOf(BONUSES["boostAllPlayers"]);
  });

  it("applique le bonus 4-Decat si il y a 4 attaquants sur le terrain", () => {
    matchMock.home.composition = "424";
    matchMock.home.bonuses = {};

    team = teamConstructor(matchMock.home);
    expect(team.bonus).toBeInstanceOf(BONUSES["fourStrikers"]);
  });

  describe("pour une équipe live", () => {

    beforeEach(() => {
      team = teamConstructor(liveMatchMock.away);
    });

    it("défini les joueurs sur le terrain", () => {
      expect(team.pitchPlayers.length).toBe(11);
    });

    it("défini les joueurs sur le banc", () => {
      const benchLength = Object.values(liveMatchMock.away.players).length - 11;
      expect(team.benchPlayers.length).toBe(benchLength);
    });

    it("défini les remplacements à faire", () => {
      const substitutions = team.substitutions;
      expect(substitutions.length).toBe(2);
      expect(substitutions[0]).toBeInstanceOf(LiveSubstitution);
    });

    it("ne récupère qu'un seul gardien remplaçant", () => {
      const liveTeamMock = JSON.parse(JSON.stringify(liveMatchMock.away));
      liveTeamMock.players["mock_player_100000"] = {
        ...Object.values(liveMatchMock.away.players)[0],
        playerId: "mock_player_100000",
        lastName: "FakeGoalKeeper",
        position: 1,
        ultraPosition: 10,
      };
      team = teamConstructor(liveTeamMock);

      const benchGoalkeepers = team.benchPlayers.filter(player => player.position === 1);
      expect(benchGoalkeepers.length).toBe(1);
    });
  });

});