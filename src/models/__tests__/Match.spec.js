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

    describe.skip("Avec une équipe", () => {

      it("À domicile", () => {
        expect(match.homeTeam).toBeInstanceOf(Team);
      });

      it("À l'extérieur", () => {
        expect(match.awayTeam).toBeInstanceOf(Team);
      });

    });

  });
});