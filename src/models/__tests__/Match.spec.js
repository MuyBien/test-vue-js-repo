import { describe, it, expect, beforeEach } from "vitest";

import matchMock from "@/assets/mocks/match/response.js";
import { Match } from "../Match";
import { Team } from "../Team";

describe("Le modèle de match", () => {

  let match;
  beforeEach(() => {
    match = new Match(matchMock);
  });

  describe("Construit un match", () => {
    describe("Avec une équipe", () => {

      it("À domicile", () => {
        expect(match.homeTeam).toBeInstanceOf(Team);
      });

      it("À l'extérieur", () => {
        expect(match.awayTeam).toBeInstanceOf(Team);
      });

    });
  });

  describe("Renvoi le score du match", () => {

    it("Actuel sans remplacement ni but MPG", () => {
      expect(match.getScore()).toStrictEqual([0, 0]);
    });

    it("Après remplacements", () => {
      expect(match.getFinalScore()).toStrictEqual([0, 2]);
    });

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

    it("De l'équipe à domicile", () => {
      match.homeTeam.starters[10].rating = 5; // Goal MPG
      match.homeTeam.starters[9].rating = 4.5; // No goal MPG

      match.homeTeam.calculateFinalPlayers();
      match.awayTeam.calculateFinalPlayers();

      expect(match.getMpgGoals().homeTeam).toHaveLength(1);
      expect(match.getMpgGoals().homeTeam).toStrictEqual([match.homeTeam.starters[10].playerId]);
    });

    it("De l'équipe à l'extérieur", () => {
      match.awayTeam.starters[10].rating = 5.5; // Goal MPG
      match.awayTeam.starters[9].rating = 5; // No goal MPG

      match.homeTeam.calculateFinalPlayers();
      match.awayTeam.calculateFinalPlayers();

      expect(match.getMpgGoals().awayTeam).toHaveLength(1);
      expect(match.getMpgGoals().awayTeam).toStrictEqual([match.awayTeam.starters[10].playerId]);
    });

  });

});