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
      match.setMpgGoals();

      expect(match.homeTeam.getFinalPlayers()[10].mpgGoals).toBe(1);
      expect(match.homeTeam.getFinalPlayers()[9].mpgGoals).toBe(0);
    });

    it("De l'équipe à l'extérieur", () => {
      match.awayTeam.starters[10].rating = 5.5; // Goal MPG
      match.awayTeam.starters[9].rating = 5; // No goal MPG

      match.homeTeam.calculateFinalPlayers();
      match.awayTeam.calculateFinalPlayers();
      match.setMpgGoals();

      expect(match.awayTeam.getFinalPlayers()[10].mpgGoals).toBe(1);
      expect(match.awayTeam.getFinalPlayers()[9].mpgGoals).toBe(0);
    });

    it("En ne permettant pas à un joueur qui a un but réel annulé de marquer en MPG", () => {
      match.awayTeam.starters[10].rating = 6; // Goal MPG
      match.awayTeam.starters[10].goals = 1;
      match.awayTeam.starters[10].canceledGoals = 1; // Bonus valise

      match.awayTeam.calculateFinalPlayers();
      match.setMpgGoals();

      expect(match.awayTeam.getFinalPlayers()[10].mpgGoals).toBe(0);
    });

  });

  describe("Calcule les arrêts d'un gardien à 8", () => {

    beforeEach(() => {
      match.homeTeam.starters.map(player => player.rating = 5);
      match.homeTeam.starters.map(player => player.bonusRating = 0);
      match.homeTeam.substitutions = [];

      match.awayTeam.starters.map(player => player.rating = 5);
      match.awayTeam.starters.map(player => player.bonusRating = 0);
      match.awayTeam.substitutions = [];
    });

    it("De l'équipe à domicile", () => {
      match.homeTeam.starters[0].rating = 8; // MPG Save
      match.homeTeam.score = 0;
      match.awayTeam.starters[10].goals = 2;
      match.awayTeam.score = 2;

      const saves = match.getGoalkeeperSaves();
      expect(saves.awayTeam).toHaveLength(1);
    });

    it("De l'équipe à l'extérieur", () => {
      match.awayTeam.starters[0].rating = 8; // MPG Save
      match.homeTeam.starters[10].goals = 2;

      const saves = match.getGoalkeeperSaves();
      expect(saves.homeTeam).toHaveLength(1);
    });

  });

  describe("Applique le bonus", () => {

    beforeEach(() => {
      match.homeTeam.starters.map(player => player.rating = 5);
      match.homeTeam.starters.map(player => player.bonusRating = 0);
      match.homeTeam.substitutions = [];

      match.awayTeam.starters.map(player => player.rating = 5);
      match.awayTeam.starters.map(player => player.bonusRating = 0);
      match.awayTeam.substitutions = [];
    });

    describe("De la valise à Nanard", () => {

      beforeEach(() => {
        match.homeTeam.bonus = {
          name: "La valise à Nanard",
          value: "removeGoal",
        };
      });

      it("En enlevant un but réel à l'adversaire", () => {
        match.awayTeam.starters[10].goals = 2;
        match.applyBonus();
        expect(match.getFinalScore()).toStrictEqual([0, 1]);
        expect(match.awayTeam.getFinalPlayers()[10].goals).toBe(2);
        expect(match.awayTeam.getFinalPlayers()[10].canceledGoals).toBe(1);
      });

      it("En enlevant un but MPG à l'adversaire", () => {
        match.awayTeam.starters[10].rating = 8;

        match.awayTeam.calculateFinalPlayers();
        match.setMpgGoals();

        match.applyBonus();
        expect(match.getFinalScore()).toStrictEqual([0, 0]);
        expect(match.awayTeam.getFinalPlayers()[10].mpgGoals).toBe(1);
        expect(match.awayTeam.getFinalPlayers()[10].canceledGoals).toBe(1);
      });
    });
  });

});