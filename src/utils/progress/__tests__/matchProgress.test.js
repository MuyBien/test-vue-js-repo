import mockMatch from "@/assets/mocks/match/response";
import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { beforeEach, describe, expect, it } from "vitest";
import { getMatchProgress } from "../matchProgress";

describe("Le calcul de progression du match", () => {

  let match;

  beforeEach(() => {
    match = matchConstructor(mockMatch);
  });

  describe("avec des équipes en mode remplacements tactiques", () => {

    beforeEach(() => {
      match.homeTeam.isLiveSubstitutesEnabled = false;
      match.awayTeam.isLiveSubstitutesEnabled = false;
    });

    it("retourne 0% si aucun joueur n'a joué", () => {
      match.homeTeam.pitchPlayers.forEach((player) => player.isAverageRating = true);
      match.awayTeam.pitchPlayers.forEach((player) => player.isAverageRating = true);

      const progress = getMatchProgress(match);
      expect(progress).toBe(0);
    });

    it("retourne 100% si le résultat ne peut plus changer", () => {
      match.homeTeam.pitchPlayers.forEach((player) => player.isAverageRating = false);
      match.awayTeam.pitchPlayers.forEach((player) => player.isAverageRating = false);

      const progress = getMatchProgress(match);
      expect(progress).toBe(100);
    });

    it("retourne le pourcentage de position qui ne bougeront plus", () => {
      match.homeTeam.pitchPlayers.forEach((player) => player.isAverageRating = true);
      match.awayTeam.pitchPlayers.forEach((player) => player.isAverageRating = false);

      const progress = getMatchProgress(match);
      expect(progress).toBe(50);
    });

    it("vérifie que les joueurs remplacés ont joué", () => {
      match.homeTeam.pitchPlayers.forEach((player) => player.isAverageRating = false);
      match.awayTeam.pitchPlayers.forEach((player) => player.isAverageRating = false);

      match.homeTeam.pitchPlayers[10].substitued = { isAverageRating: true };

      const progress = getMatchProgress(match);
      expect(progress).not.toBe(100);
    });

    it("ne considère pas un joueur en live comme terminé", () => {
      match.homeTeam.pitchPlayers.forEach((player) => player.isAverageRating = false);
      match.awayTeam.pitchPlayers.forEach((player) => player.isAverageRating = false);
      match.homeTeam.pitchPlayers.forEach((player) => player.isLiveRating = false);
      match.awayTeam.pitchPlayers.forEach((player) => player.isLiveRating = false);

      match.homeTeam.pitchPlayers[10].substitued = {
        isAverageRating: false,
        isLiveRating: true,
      };

      const progress = getMatchProgress(match);
      expect(progress).not.toBe(100);
    });
  });

  describe("avec des équipes en mode remplacements live", () => {

    beforeEach(() => {
      match.homeTeam.isLiveSubstitutesEnabled = true;
      match.awayTeam.isLiveSubstitutesEnabled = true;
    });

    it("retourne 0% si aucun joueur n'a joué", () => {
      match.homeTeam.pitchPlayers.forEach((player) => player.substitued === undefined);
      match.awayTeam.pitchPlayers.forEach((player) => player.substitued === undefined);
      match.homeTeam.pitchPlayers[0].isAverageRating = true;
      match.awayTeam.pitchPlayers[0].isAverageRating = true;

      const progress = getMatchProgress(match);
      expect(progress).toBe(0);
    });

    it("retourne 100% si le résultat ne peut plus changer", () => {
      match.homeTeam.pitchPlayers.forEach((player) => player.substitued = {
        isAverageRating: false,
        isLiveRating: false,
      });
      match.awayTeam.pitchPlayers.forEach((player) => player.substitued = {
        isAverageRating: false,
        isLiveRating: false,
      });

      const progress = getMatchProgress(match);
      expect(progress).toBe(100);
    });

    it("retourne le pourcentage de position qui ne bougeront plus", () => {
      match.homeTeam.pitchPlayers.forEach((player) => player.substitued = {
        isAverageRating: false,
        isLiveRating: false,
      });
      match.awayTeam.pitchPlayers.forEach((player) => player.substitued = undefined);
      match.awayTeam.pitchPlayers[0].isAverageRating = true;

      const progress = getMatchProgress(match);
      expect(progress).toBe(50);
    });

    describe("n'attend pas un remplacement pour le gardien", () => {

      beforeEach(() => {
        match.homeTeam.pitchPlayers.forEach((player) => player.substitued = {
          isAverageRating: false,
          isLiveRating: false,
        });
        match.awayTeam.pitchPlayers.forEach((player) => player.substitued = {
          isAverageRating: false,
          isLiveRating: false,
        });
      });

      it("si il a joué", () => {
        match.homeTeam.pitchPlayers[0].substitued = undefined;
        match.homeTeam.pitchPlayers[0].rating = 6;
        match.homeTeam.pitchPlayers[0].isLiveRating = false;
        match.homeTeam.pitchPlayers[0].isAverageRating = false;

        const progress = getMatchProgress(match);
        expect(progress).toBe(100);
      });

      it("sauf si il n'a pas joué", () => {
        match.homeTeam.pitchPlayers[0].substitued = undefined;
        match.homeTeam.pitchPlayers[0].rating = undefined;
        match.homeTeam.pitchPlayers[0].isLiveRating = false;
        match.homeTeam.pitchPlayers[0].isAverageRating = true;

        const progress = getMatchProgress(match);
        expect(progress).toBe(95);
      });
    });

  });

});