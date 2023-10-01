import { describe, it, expect, beforeEach } from "vitest";

import { Match } from "../Match";
import matchMock from "@/assets/mocks/match/response.js";
import { Team } from "../Team";

describe("Le modèle de match", () => {

  let match;

  describe("Construit un match", () => {
    beforeEach(() => {
      match = new Match(matchMock);
    });

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

    it("Après remplacements et buts MPG", () => {
      expect(match.getFinalScore()).toStrictEqual([0, 2]);
    });

  });

});