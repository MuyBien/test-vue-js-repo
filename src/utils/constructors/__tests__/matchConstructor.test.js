import { describe, it, expect, beforeEach } from "vitest";

import { matchConstructor } from "../matchConstructor";
import { Team } from "@/models/teams/Team.js";

import matchMock from "@/assets/mocks/match/response.js";

describe("Le constructeur de match", () => {

  let match;
  beforeEach(() => {
    match = matchConstructor(matchMock);
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

});