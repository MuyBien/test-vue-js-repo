import mockMatch from "@/assets/mocks/match/response";
import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { beforeEach, describe, expect, it } from "vitest";
import { getTeamProgress } from "../teamProgress";

describe("Le calcul de progression d'une équipe", () => {

  let team;

  beforeEach(() => {
    const match = matchConstructor(mockMatch);
    team = match.homeTeam;
  });

  describe("en mode remplacements tactiques", () => {

    beforeEach(() => {
      team.isLiveSubstitutesEnabled = false;
    });

    it("retourne 0% si aucun joueur n'a joué", () => {
      team.pitchPlayers.forEach((player) => player.isAverageRating = true);

      const progress = getTeamProgress(team);
      expect(progress).toBe(0);
    });

    it("retourne 100% si le résultat ne peut plus changer", () => {
      team.pitchPlayers.forEach((player) => player.isAverageRating = false);

      const progress = getTeamProgress(team);
      expect(progress).toBe(100);
    });

    it("retourne le pourcentage de position qui ne bougeront plus", () => {
      team.pitchPlayers.forEach((player) => player.isAverageRating = false);
      team.pitchPlayers[0].isAverageRating = true;
      team.pitchPlayers[2].isLiveRating = true;

      const progress = getTeamProgress(team);
      expect(progress).toBe(82);
    });

    it("vérifie que les joueurs remplacés ont joué", () => {
      team.pitchPlayers.forEach((player) => player.isAverageRating = false);
      team.pitchPlayers[10].substitued = { isAverageRating: true };

      const progress = getTeamProgress(team);
      expect(progress).not.toBe(100);
    });

    it("ne considère pas un joueur en live comme terminé", () => {
      team.pitchPlayers.forEach((player) => player.isAverageRating = false);
      team.pitchPlayers.forEach((player) => player.isLiveRating = false);

      team.pitchPlayers[10].substitued = {
        isAverageRating: false,
        isLiveRating: true,
      };

      const progress = getTeamProgress(team);
      expect(progress).not.toBe(100);
    });
  });

  describe("en mode remplacements live", () => {

    beforeEach(() => {
      team.isLiveSubstitutesEnabled = true;
    });

    it("retourne undefined", () => {
      const progress = getTeamProgress(team);
      expect(progress).toBeUndefined();
    });

  });

});