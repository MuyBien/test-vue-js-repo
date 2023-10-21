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

  describe("Donne le qualifié pour le prochain tour", () => {

    beforeEach(() => {
      match.homeTeam.starters.map(player => player.rating = 4);
      match.homeTeam.starters.map(player => player.bonusRating = 0);
      match.homeTeam.starters.map(player => player.goals = 0);
      match.homeTeam.substitutions = [];

      match.awayTeam.starters.map(player => player.rating = 4);
      match.awayTeam.starters.map(player => player.bonusRating = 0);
      match.awayTeam.starters.map(player => player.goals = 0);
      match.awayTeam.substitutions = [];

      match.homeTeam.calculateFinalPlayers();
      match.awayTeam.calculateFinalPlayers();
    });

    describe("En se basant sur le score", () => {

      it("Si l'équipe à domicile marque plus de but que l'équipe à l'extérieur", () => {
        match.homeTeam.starters[10].goals = 2;
        match.awayTeam.starters[10].rating = 7;
        expect(match.getQualified()).toBe(match.homeTeam);
      });

      it("Si l'équipe à l'extérieur marque plus de but que l'équipe à domicile", () => {
        match.homeTeam.starters[10].rating = 7;
        match.awayTeam.starters[10].goals = 2;
        expect(match.getQualified()).toBe(match.awayTeam);
      });

      it("Sauf si les 2 équipes marquent autant de but", () => {
        match.homeTeam.starters[10].goals = 2;
        match.awayTeam.starters[10].goals = 2;
        expect(match.getQualified()).toBeUndefined();
      });

    });

  });

});