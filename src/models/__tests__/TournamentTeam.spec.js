import { describe, it, expect, beforeEach } from "vitest";

import { TournamentTeam } from "../TournamentTeam";
import matchMock from "@/assets/mocks/match/response.js";

describe("Le modèle d'une équipe de tournoi", () => {

  let team;
  beforeEach(() => {
    team = new TournamentTeam(matchMock.home);
  });

  describe("Calcule les moyennes", () => {

    it("Des attaquants", () => {
      expect(team.getAverages()[3]).toBe(5);
    });

    it("Des milieux", () => {
      expect(team.getAverages()[2]).toBe(5.17);
    });

    it("Des défenseurs", () => {
      expect(team.getAverages()[1]).toBe(6.38);
    });

    it("Du gardien", () => {
      expect(team.getAverages()[0]).toBe(7);
    });

    it("De l'équipe sans compter le bonus défensif", () => {
      team.starters.map(player => {
        player.isBacker() ? player.bonusRating = 1 : player.bonusRating = 0;
        player.isCaptain = false;
        return player;
      });
      team.starters[2].isCaptain = true;
      team.calculateFinalPlayers();
      expect(team.getTeamAverage()).toBe(5.23);
    });
  });

});