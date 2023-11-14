import { describe, it, expect, beforeEach } from "vitest";

import { getQualified } from "../qualification";
import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { calculateFinalMatch } from "@/utils/match/resultMatchCalculator";

import matchMock from "@/assets/mocks/match/response.js";

describe("L'utilitaire de qualification donne le qualifié pour le prochain tour d'un tournoi", () => {

  let match;
  beforeEach(() => {
    match = matchConstructor(matchMock);

    resetPlayerRatings(match.homeTeam.pitchPlayers);
    match.homeTeam.substitutions = [];
    resetPlayerRatings(match.awayTeam.pitchPlayers);
    match.awayTeam.substitutions = [];
  });

  describe("En se basant sur le score", () => {

    it("Quand l'équipe à domicile marque plus de but que l'équipe à l'extérieur", () => {
      match.homeTeam.pitchPlayers[10].goals = 2;
      match.awayTeam.pitchPlayers[10].rating = 7;
      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBe(resultMatch.homeTeam);
    });

    it("Quand l'équipe à l'extérieur marque plus de but que l'équipe à domicile", () => {
      match.homeTeam.pitchPlayers[10].rating = 7;
      match.awayTeam.pitchPlayers[10].goals = 2;
      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBe(resultMatch.awayTeam);
    });

  });

  describe("En se basant sur la moyenne générale si le score est nul", () => {

    it("Quand une équipe a une moyenne générale supérieure à l'autre", () => {
      match.homeTeam.pitchPlayers[10].rating = 7;
      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBe(resultMatch.homeTeam);
    });

    it("Sans prendre en compte les bonus défensifs", () => {
      match.homeTeam.pitchPlayers.map(player => {
        player.isBacker() ? player.bonusRating = 1 : player.bonusRating = 0;
        player.isCaptain = false;
        return player;
      });
      match.awayTeam.pitchPlayers.map(player => {
        player.isCaptain = false;
        return player;
      });
      match.awayTeam.pitchPlayers[10].rating = 5.5;

      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBe(resultMatch.awayTeam);
    });

    it("En prenant en compte le bonus du capitaine", () => {
      match.homeTeam.pitchPlayers.map(player => {
        player.isBacker() ? player.bonusRating = 1 : player.bonusRating = 0;
        player.isCaptain = false;
        return player;
      });
      match.homeTeam.pitchPlayers[4].isCaptain = true;
      match.homeTeam.pitchPlayers[4].bonusRating += 0.5;

      match.awayTeam.pitchPlayers.map(player => {
        player.isBacker() ? player.bonusRating = 1 : player.bonusRating = 0;
        player.isCaptain = false;
        return player;
      });

      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBe(resultMatch.homeTeam);
    });

  });

  describe("En se basant sur la moyenne de chaque ligne, si la moyenne générale est la même", () => {

    it("De l'attaque", () => {
      match.awayTeam.pitchPlayers[2].rating = 4.5; // Défenseur
      match.homeTeam.pitchPlayers[10].rating = 4.5; // Attaquant

      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBe(resultMatch.homeTeam);
    });

    it("Du milieu", () => {
      match.awayTeam.pitchPlayers[2].rating = 4.5; // Défenseur
      match.homeTeam.pitchPlayers[6].rating = 4.5; // Milieu

      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBe(resultMatch.homeTeam);
    });

    it("De la défense", () => {
      match.awayTeam.pitchPlayers[1].rating = 3.5; // Défenseur
      match.homeTeam.pitchPlayers[0].rating = 3.5; // Gardien

      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBe(resultMatch.homeTeam);
    });

    // Pas trouvé comment tout le reste peut être égal sauf la note des gardiens...

    it("En renvoyant undefined si tout est égal", () => {
      const resultMatch = calculateFinalMatch(match);
      expect(getQualified(resultMatch)).toBeUndefined();
    });

  });

});

function resetPlayerRatings (players) {
  players.forEach(player => {
    player.rating = 4;
    player.bonusRating = 0;
  });
}