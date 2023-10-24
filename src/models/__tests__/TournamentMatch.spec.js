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

      it("Quand l'équipe à domicile marque plus de but que l'équipe à l'extérieur", () => {
        match.homeTeam.starters[10].goals = 2;
        match.awayTeam.starters[10].rating = 7;
        expect(match.getQualified()).toBe(match.homeTeam);
      });

      it("Quand l'équipe à l'extérieur marque plus de but que l'équipe à domicile", () => {
        match.homeTeam.starters[10].rating = 7;
        match.awayTeam.starters[10].goals = 2;
        expect(match.getQualified()).toBe(match.awayTeam);
      });

    });

    describe("En se basant sur la moyenne générale si le score est nul", () => {

      it("Quand une équipe a une moyenne générale supérieure à l'autre", () => {
        match.homeTeam.starters[10].rating = 7;
        expect(match.getQualified()).toBe(match.homeTeam);
      });

      it("Sans prendre en compte les bonus défensifs", () => {
        match.homeTeam.starters.map(player => player.isBacker() ? player.bonusRating = 1 : player.bonusRating = 0);
        match.awayTeam.starters[10].rating = 5.5;
        match.homeTeam.calculateFinalPlayers();
        match.awayTeam.calculateFinalPlayers();

        expect(match.getQualified()).toBe(match.awayTeam);
      });

      it("En prenant en compte le bonus du capitaine", () => {
        match.homeTeam.starters.map(player => {
          player.isBacker() ? player.bonusRating = 1 : player.bonusRating = 0;
          player.isCaptain = false;
          return player;
        });
        match.homeTeam.starters[4].isCaptain = true;
        match.homeTeam.starters[4].bonusRating += 0.5;

        match.awayTeam.starters.map(player => {
          player.isBacker() ? player.bonusRating = 1 : player.bonusRating = 0;
          player.isCaptain = false;
          return player;
        });

        match.homeTeam.calculateFinalPlayers();
        expect(match.getQualified()).toBe(match.homeTeam);
      });

    });

    describe("En se basant sur la moyenne de chaque ligne, si la moyenne générale est la même", () => {

      it("De l'attaque", () => {
        match.awayTeam.starters[2].rating = 4.5; // Défenseur
        match.awayTeam.calculateFinalPlayers();
        match.homeTeam.starters[10].rating = 4.5; // Attaquant
        match.homeTeam.calculateFinalPlayers();

        expect(match.getQualified()).toBe(match.homeTeam);
      })

      it("Du milieu", () => {
        match.awayTeam.starters[2].rating = 4.5; // Défenseur
        match.awayTeam.calculateFinalPlayers();
        match.homeTeam.starters[6].rating = 4.5; // Milieu
        match.homeTeam.calculateFinalPlayers();

        expect(match.getQualified()).toBe(match.homeTeam);
      })

      it("De la défense", () => {
        match.awayTeam.starters[1].rating = 3.5; // Défenseur
        match.awayTeam.calculateFinalPlayers();
        match.homeTeam.starters[0].rating = 3.5; // Gardien
        match.homeTeam.calculateFinalPlayers();

        expect(match.getQualified()).toBe(match.homeTeam);
      })

      // it("Du gardien", () => {
      //   match.homeTeam.starters[0].rating = 4.5; // Gardien
      //   match.homeTeam.calculateFinalPlayers();

      //   expect(match.getQualified()).toBe(match.awayTeam);
      // })

      it("En renvoyant undefined si tout est égal", () => {
        expect(match.getQualified()).toBeUndefined();
      })

    });

  });

});