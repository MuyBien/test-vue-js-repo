import { describe, it, expect, beforeEach } from "vitest";

import matchMock from "@/assets/mocks/match/response.js";
import { TournamentMatch } from "../TournamentMatch";

describe("Le modèle de match de tournoi", () => {

  let match;
  beforeEach(() => {
    match = new TournamentMatch(matchMock);
  });

  describe("Calcule les buts MPG", () => {

    beforeEach(() => {
      match.homeTeam.starters.map(player => player.rating = 4);
      match.homeTeam.starters.map(player => player.bonusRating = 0);
      match.homeTeam.substitutions = [];

      match.awayTeam.starters.map(player => player.rating = 4);
      match.awayTeam.starters.map(player => player.bonusRating = 0);
      match.awayTeam.substitutions = [];
    });

    it("En considérant l'équipes à l'extérieur comme étant à domicile", () => {
      match.awayTeam.starters[10].rating = 5; // Goal MPG dans tournoi pas dans match classique

      match.homeTeam.calculateFinalPlayers();
      match.awayTeam.calculateFinalPlayers();
      match.setMpgGoals();

      expect(match.awayTeam.getFinalPlayers()[10].mpgGoals).toBe(1);
    });

  });

});