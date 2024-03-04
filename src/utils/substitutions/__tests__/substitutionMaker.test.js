import { beforeEach, describe, expect, it } from "vitest";

import { Match } from "@/models/match/Match";
import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { doMatchSubstitutions } from "../substitutionMaker";

import matchMock from "@/assets/mocks/match/response.js";

describe("Le substitutionMaker", () => {

  let match;
  beforeEach(() => {
    match = matchConstructor(matchMock);
  });

  it("Renvoi une nouvelle équipe avec les remplacements effectués", () => {
    const updatedMatch = doMatchSubstitutions(match);

    expect(updatedMatch).not.toBe(match);
    expect(updatedMatch).toBeInstanceOf(Match);
    expect(updatedMatch.homeTeam.pitchPlayers).not.toEqual(match.homeTeam.pitchPlayers);
  });
  describe("Calcule les joueurs sur le terrain", () => {

    describe("En faisant les remplacements tactiques", () => {

      it("D'un joueur qui a eu une note inférieure à la note requise", () => {
        const pitchPlayer = match.homeTeam.pitchPlayers[10];
        pitchPlayer.rating = 5.5;
        pitchPlayer.bonusRating = 0;
        pitchPlayer.lastName = "Satriano";

        const benchPlayer = match.homeTeam.benchPlayers[2];
        benchPlayer.rating = 6;
        benchPlayer.lastName = "Emegha";

        match.homeTeam.substitutions[0] = {
          rating: 6,
          subId: benchPlayer.playerId,
          starterId: pitchPlayer.playerId,
        };

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Emegha");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(6);
      });

      it("Si le joueur titulaire n'a pas joué", () => {
        match.homeTeam.pitchPlayers[10].lastName = "Satriano";
        delete match.homeTeam.pitchPlayers[10].rating;

        match.homeTeam.benchPlayers[2].rating = 6;
        match.homeTeam.benchPlayers[2].lastName = "Emegha";

        match.homeTeam.substitutions[0] = {
          rating: 6,
          subId: match.homeTeam.benchPlayers[2].playerId,
          starterId: match.homeTeam.pitchPlayers[10].playerId,
        };

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Emegha");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(6);
      });

      it("Sauf si le joueur remplaçant n'a pas joué", () => {
        match.homeTeam.pitchPlayers[10].lastName = "Satriano";
        match.homeTeam.pitchPlayers[10].rating = 5.5;

        match.homeTeam.benchPlayers[2].lastName = "Emegha";
        delete match.homeTeam.benchPlayers[2].rating;

        match.homeTeam.substitutions[0] = {
          rating: 6,
          subId: match.homeTeam.benchPlayers[2].playerId,
          starterId: match.homeTeam.pitchPlayers[10].playerId,
        };

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Satriano");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(5.5);
      });

      it("Sauf si le joueur titulaire a eu la note requise", () => {
        match.homeTeam.pitchPlayers[10].lastName = "Satriano";
        match.homeTeam.pitchPlayers[10].rating = 6;
        match.homeTeam.benchPlayers[2].lastName = "Emegha";
        delete match.homeTeam.benchPlayers[2].rating;

        match.homeTeam.substitutions[0] = {
          rating: 6,
          subId: match.homeTeam.benchPlayers[2].playerId,
          starterId: match.homeTeam.pitchPlayers[10].playerId,
        };

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Satriano");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(6);
      });

      it("En marquant le joueur entrant comme remplaçant", () => {
        match.homeTeam.pitchPlayers[10].rating = 5.5;
        match.homeTeam.pitchPlayers[10].bonusRating = 0;
        match.homeTeam.pitchPlayers[10].lastName = "Satriano";

        match.homeTeam.benchPlayers[2].rating = 6;
        match.homeTeam.benchPlayers[2].lastName = "Emegha";

        match.homeTeam.substitutions[0] = {
          rating: 6,
          subId: match.homeTeam.benchPlayers[2].playerId,
          starterId: match.homeTeam.pitchPlayers[10].playerId,
        };

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].isSubstitute).toBeTruthy();
      });
    });

    describe("En remplaçant les joueurs qui n'ont pas joué", () => {

      it("Par un joueur du même poste disponible sur le banc après RT", () => {
        match.homeTeam.pitchPlayers[9].lastName = "Balogun";
        match.homeTeam.pitchPlayers[9].position = 4;
        match.homeTeam.pitchPlayers[9].rating = 4;

        match.homeTeam.pitchPlayers[10].lastName = "Satriano";
        match.homeTeam.pitchPlayers[10].position = 4;
        delete match.homeTeam.pitchPlayers[10].rating;

        match.homeTeam.benchPlayers[1].lastName = "RKM";
        match.homeTeam.benchPlayers[1].position = 4;
        match.homeTeam.benchPlayers[1].rating = 5;

        match.homeTeam.benchPlayers[2].lastName = "Emegha";
        match.homeTeam.benchPlayers[2].position = 4;
        match.homeTeam.benchPlayers[2].rating = 6;

        match.homeTeam.substitutions = [{
          rating: 6,
          subId: match.homeTeam.benchPlayers[1].playerId, // RKM
          starterId: match.homeTeam.pitchPlayers[9].playerId, // Balogun
        }];

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Emegha");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(6);
      });

      it("Par un milieu (avec malus) si aucun attaquant n'est disponible", () => {
        match.homeTeam.pitchPlayers.forEach(player => {
          player.rating = 3;
          player.bonusRating = 0;
        });
        delete match.homeTeam.pitchPlayers[10].rating;
        match.homeTeam.pitchPlayers[10].lastName = "Satriano";
        match.homeTeam.pitchPlayers[10].position = 4;

        match.homeTeam.benchPlayers.forEach(player => {
          player.position = 5;
          player.bonusRating = 0;
        });
        match.homeTeam.benchPlayers[0].rating = 6;
        match.homeTeam.benchPlayers[0].lastName = "Zaire Emery";
        match.homeTeam.benchPlayers[0].position = 3;

        match.homeTeam.substitutions = [];

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Zaire Emery");
        expect(updatedMatch.homeTeam.pitchPlayers[10].getTotalScore()).toBe(5); // 6 - 1
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(6);
        expect(updatedMatch.homeTeam.pitchPlayers[10].bonusRating).toBe(- 1);
      });

      it("Par un defenseur (avec malus) si aucun milieu n'est disponible", () => {
        match.homeTeam.pitchPlayers.forEach(player => {
          player.rating = 5;
          player.bonusRating = 0;
        });

        match.homeTeam.pitchPlayers[10].lastName = "Zaire Emery";
        match.homeTeam.pitchPlayers[10].position = 3;
        delete match.homeTeam.pitchPlayers[10].rating;

        match.homeTeam.benchPlayers.forEach(player => {
          player.position = 4;
          player.bonusRating = 0;
        });
        match.homeTeam.benchPlayers[1].rating = 6;
        match.homeTeam.benchPlayers[1].lastName = "Theate";
        match.homeTeam.benchPlayers[1].position = 2;

        match.homeTeam.substitutions = [];

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Theate");
        expect(updatedMatch.homeTeam.pitchPlayers[10].getTotalScore()).toBe(5); // 6 - 1
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(6);
        expect(updatedMatch.homeTeam.pitchPlayers[10].bonusRating).toBe(- 1);
      });

      it("Par un defenseur (avec double malus) si aucun attaquant ou milieu ne sont disponible", () => {
        match.homeTeam.pitchPlayers.forEach(player => {
          player.rating = 5;
          player.bonusRating = 0;
        });
        match.homeTeam.pitchPlayers[10].lastName = "Satriano";
        match.homeTeam.pitchPlayers[10].position = 4;
        delete match.homeTeam.pitchPlayers[10].rating;

        match.homeTeam.benchPlayers.forEach(player => {
          player.position = 2;
          player.bonusRating = 0;
        });
        match.homeTeam.benchPlayers[0].rating = 6;
        match.homeTeam.benchPlayers[0].lastName = "Theate";
        match.homeTeam.benchPlayers[0].position = 2;

        match.homeTeam.substitutions = [];

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Theate");
        expect(updatedMatch.homeTeam.pitchPlayers[10].getTotalScore()).toBe(4); // 6 - 2
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(6);
        expect(updatedMatch.homeTeam.pitchPlayers[10].bonusRating).toBe(- 2);
      });

      it("En ne remplacant pas un défenseur par un gardien si aucun défenseur n'est disponible", () => {
        match.homeTeam.pitchPlayers.forEach(player => player.rating = 5);
        match.homeTeam.pitchPlayers[1].lastName = "Theate";
        match.homeTeam.pitchPlayers[1].position = 2;
        delete match.homeTeam.pitchPlayers[1].rating;

        match.homeTeam.benchPlayers.forEach(player => {
          player.position = 3;
        });
        match.homeTeam.benchPlayers[0].rating = 6;
        match.homeTeam.benchPlayers[0].lastName = "Mandanda";

        match.homeTeam.substitutions = [];

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[1].lastName).toBe("Rotaldo");
        expect(updatedMatch.homeTeam.pitchPlayers[1].rating).toBe(2.5);
      });

      it("Par un Rotaldo si aucun defenseur n'est disponible", () => {
        match.homeTeam.pitchPlayers.forEach(player => player.rating = 5);
        delete match.homeTeam.pitchPlayers[10].rating;
        match.homeTeam.pitchPlayers[10].lastName = "Theate";
        match.homeTeam.pitchPlayers[10].position = 2;

        match.homeTeam.benchPlayers.forEach(player => {
          player.position = 3;
        });
        match.homeTeam.substitutions = [];

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Rotaldo");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(2.5); // 6 - 1
      });

      it("Par Rotaldo si plus aucun joueur n'est disponible", () => {
        match.homeTeam.pitchPlayers.forEach(player => player.rating = 5);
        delete match.homeTeam.pitchPlayers[10].rating;
        match.homeTeam.pitchPlayers[10].lastName = "Satriano";
        match.homeTeam.pitchPlayers[10].position = 3;

        match.homeTeam.benchPlayers = [];
        match.homeTeam.substitutions = [];

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Rotaldo");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(2.5);
      });

      it("En marquant le joueur entrant comme remplaçant", () => {
        delete match.homeTeam.pitchPlayers[10].rating;
        match.homeTeam.pitchPlayers[10].lastName = "Satriano";
        match.homeTeam.pitchPlayers[10].position = 4;

        match.homeTeam.benchPlayers[2].rating = 6;
        match.homeTeam.benchPlayers[2].lastName = "Emegha";
        match.homeTeam.benchPlayers[2].position = 4;

        match.homeTeam.substitutions = [];

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].isSubstitute).toBeTruthy();
      });

      it("Par Rotaldo si l'équipe joue en remplacement live", () => {
        match.homeTeam.pitchPlayers.forEach(player => player.rating = 5);
        delete match.homeTeam.pitchPlayers[10].rating;

        match.homeTeam.substitutions = [];
        match.homeTeam.isLiveSubstitutesEnabled = true;

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Rotaldo");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(2.5);
      });

      it("Par Rotaldo si l'entrant n'a pas joué en remplacement live", () => {
        match.homeTeam.pitchPlayers.forEach(player => player.rating = 5);

        match.homeTeam.benchPlayers[1].lastName = "Balogun";
        match.homeTeam.benchPlayers[1].position = 4;
        match.homeTeam.benchPlayers[1].rating = undefined;

        match.homeTeam.substitutions = [];
        match.homeTeam.substitutions.push({
          rating: Infinity,
          subId: match.homeTeam.benchPlayers[1].playerId,
          starterId: match.homeTeam.pitchPlayers[10].playerId,
        });
        match.homeTeam.isLiveSubstitutesEnabled = true;

        const updatedMatch = doMatchSubstitutions(match);
        expect(updatedMatch.homeTeam.pitchPlayers[10].lastName).toBe("Rotaldo");
        expect(updatedMatch.homeTeam.pitchPlayers[10].rating).toBe(2.5);
      });

    });

  });

});