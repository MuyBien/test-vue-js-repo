import { describe, it, expect, beforeEach } from "vitest";

import { teamConstructor } from "@/utils/constructors/teamConstructor";
import { calculateTournamentTeamAverage, calculatePositionsAverages } from "../averageCalculator";

import matchMock from "@/assets/mocks/match/response.js";

describe("Le calculateur de moyennes", () => {

  let team;
  beforeEach(() => {
    team = teamConstructor(matchMock.home);
  });

  describe("calcule les moyennes", () => {

    it("des attaquants", () => {
      expect(calculatePositionsAverages(team)[3]).toBe(4.17);
    });

    it("des milieux", () => {
      expect(calculatePositionsAverages(team)[2]).toBe(6);
    });

    it("des défenseurs", () => {
      expect(calculatePositionsAverages(team)[1]).toBe(6.38);
    });

    it("du gardien", () => {
      expect(calculatePositionsAverages(team)[0]).toBe(7);
    });

    it("de l'équipe sans compter le bonus défensif (pour les tournois)", () => {
      team.pitchPlayers.map(player => {
        player.isBacker() ? player.bonusRating = 1 : player.bonusRating = 0;
        player.isCaptain = false;
        return player;
      });
      team.pitchPlayers[2].isCaptain = true;
      expect(calculateTournamentTeamAverage(team)).toBe(5.05);
    });
  });

});