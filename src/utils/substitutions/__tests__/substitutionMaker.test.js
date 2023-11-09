import { describe, it, expect, beforeEach } from "vitest";

import { Team } from "@/models_refactored/teams/Team";
import { teamConstructor } from "@/utils/constructors/teamConstructor";
import { doSubstitutions } from "../substitutionMaker";

import matchMock from "@/assets/mocks/match/response.js";

describe("Le substitutionMaker", () => {

  let team;
  beforeEach(() => {
    team = teamConstructor(matchMock.home);
  });

  it("Renvoi une nouvelle équipe avec les remplacements effectués", () => {
    const updatedTeam = doSubstitutions(team);

    expect(updatedTeam).not.toBe(team);
    expect(updatedTeam).toBeInstanceOf(Team);
    expect(updatedTeam.pitchPlayers).not.toEqual(team.pitchPlayers);
    expect(updatedTeam.benchPlayers).toEqual(team.benchPlayers);
    expect(updatedTeam.substitutions).toEqual(team.substitutions);
  });
  describe("Calcule les joueurs sur le terrain", () => {

    describe("En faisant les remplacements tactiques", () => {

      it("D'un joueur qui a eu une note inférieure à la note requise", () => {
        const pitchPlayer = team.pitchPlayers[10];
        pitchPlayer.rating = 5.5;
        pitchPlayer.bonusRating = 0;
        pitchPlayer.lastName = "Satriano";

        const benchPlayer = team.benchPlayers[2];
        benchPlayer.rating = 6;
        benchPlayer.lastName = "Emegha";

        team.substitutions[0] = {
          rating: 6,
          subId: benchPlayer.playerId,
          starterId: pitchPlayer.playerId,
        };

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Emegha");
        expect(updatedTeam.pitchPlayers[10].rating).toBe(6);
      });

      it("Si le joueur titulaire n'a pas joué", () => {
        team.pitchPlayers[10].lastName = "Satriano";
        delete team.pitchPlayers[10].rating;

        team.benchPlayers[2].rating = 6;
        team.benchPlayers[2].lastName = "Emegha";

        team.substitutions[0] = {
          rating: 6,
          subId: team.benchPlayers[2].playerId,
          starterId: team.pitchPlayers[10].playerId,
        };

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Emegha");
        expect(updatedTeam.pitchPlayers[10].rating).toBe(6);
      });

      it("Sauf si le joueur remplaçant n'a pas joué", () => {
        team.pitchPlayers[10].lastName = "Satriano";
        team.pitchPlayers[10].rating = 5.5;

        team.benchPlayers[2].lastName = "Emegha";
        delete team.benchPlayers[2].rating;

        team.substitutions[0] = {
          rating: 6,
          subId: team.benchPlayers[2].playerId,
          starterId: team.pitchPlayers[10].playerId,
        };

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Satriano");
        expect(updatedTeam.pitchPlayers[10].rating).toBe(5.5);
      });

      it("Sauf si le joueur titulaire a eu la note requise", () => {
        team.pitchPlayers[10].lastName = "Satriano";
        team.pitchPlayers[10].rating = 6;
        team.benchPlayers[2].lastName = "Emegha";
        delete team.benchPlayers[2].rating;

        team.substitutions[0] = {
          rating: 6,
          subId: team.benchPlayers[2].playerId,
          starterId: team.pitchPlayers[10].playerId,
        };

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Satriano");
        expect(updatedTeam.pitchPlayers[10].rating).toBe(6);
      });

      it("En marquant le joueur entrant comme remplaçant", () => {
        team.pitchPlayers[10].rating = 5.5;
        team.pitchPlayers[10].bonusRating = 0;
        team.pitchPlayers[10].lastName = "Satriano";

        team.benchPlayers[2].rating = 6;
        team.benchPlayers[2].lastName = "Emegha";

        team.substitutions[0] = {
          rating: 6,
          subId: team.benchPlayers[2].playerId,
          starterId: team.pitchPlayers[10].playerId,
        };

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].isSubstitute).toBeTruthy();
      });
    });

    describe("En remplaçant les joueurs qui n'ont pas joué", () => {

      it("Par un joueur du même poste disponible sur le banc après RT", () => {
        team.pitchPlayers[9].lastName = "Balogun";
        team.pitchPlayers[9].position = 4;
        team.pitchPlayers[9].rating = 4;

        team.pitchPlayers[10].lastName = "Satriano";
        team.pitchPlayers[10].position = 4;
        delete team.pitchPlayers[10].rating;

        team.benchPlayers[1].lastName = "RKM";
        team.benchPlayers[1].position = 4;
        team.benchPlayers[1].rating = 5;

        team.benchPlayers[2].lastName = "Emegha";
        team.benchPlayers[2].position = 4;
        team.benchPlayers[2].rating = 6;

        team.substitutions = [{
          rating: 6,
          subId: team.benchPlayers[1].playerId, // RKM
          starterId: team.pitchPlayers[9].playerId, // Balogun
        }];

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Emegha");
        expect(updatedTeam.pitchPlayers[10].rating).toBe(6);
      });

      it("Par un milieu (avec malus) si aucun attaquant n'est disponible", () => {
        team.pitchPlayers.forEach(player => {
          player.rating = 3;
          player.bonusRating = 0;
        });
        delete team.pitchPlayers[10].rating;
        team.pitchPlayers[10].lastName = "Satriano";
        team.pitchPlayers[10].position = 4;

        team.benchPlayers.forEach(player => {
          player.position = 5;
          player.bonusRating = 0;
        });
        team.benchPlayers[0].rating = 6;
        team.benchPlayers[0].lastName = "Zaire Emery";
        team.benchPlayers[0].position = 3;

        team.substitutions = [];

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Zaire Emery");
        expect(updatedTeam.pitchPlayers[10].getTotalScore()).toBe(5); // 6 - 1
        expect(updatedTeam.pitchPlayers[10].rating).toBe(6);
        expect(updatedTeam.pitchPlayers[10].bonusRating).toBe(- 1);
      });

      it("Par un defenseur (avec malus) si aucun milieu n'est disponible", () => {
        team.pitchPlayers.forEach(player => {
          player.rating = 5;
          player.bonusRating = 0;
        });

        team.pitchPlayers[10].lastName = "Zaire Emery";
        team.pitchPlayers[10].position = 3;
        delete team.pitchPlayers[10].rating;

        team.benchPlayers.forEach(player => {
          player.position = 4;
          player.bonusRating = 0;
        });
        team.benchPlayers[1].rating = 6;
        team.benchPlayers[1].lastName = "Theate";
        team.benchPlayers[1].position = 2;

        team.substitutions = [];

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Theate");
        expect(updatedTeam.pitchPlayers[10].getTotalScore()).toBe(5); // 6 - 1
        expect(updatedTeam.pitchPlayers[10].rating).toBe(6);
        expect(updatedTeam.pitchPlayers[10].bonusRating).toBe(- 1);
      });

      it("Par un defenseur (avec double malus) si aucun attaquant ou milieu ne sont disponible", () => {
        team.pitchPlayers.forEach(player => {
          player.rating = 5;
          player.bonusRating = 0;
        });
        team.pitchPlayers[10].lastName = "Satriano";
        team.pitchPlayers[10].position = 4;
        delete team.pitchPlayers[10].rating;

        team.benchPlayers.forEach(player => {
          player.position = 2;
          player.bonusRating = 0;
        });
        team.benchPlayers[0].rating = 6;
        team.benchPlayers[0].lastName = "Theate";
        team.benchPlayers[0].position = 2;

        team.substitutions = [];

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Theate");
        expect(updatedTeam.pitchPlayers[10].getTotalScore()).toBe(4); // 6 - 2
        expect(updatedTeam.pitchPlayers[10].rating).toBe(6);
        expect(updatedTeam.pitchPlayers[10].bonusRating).toBe(- 2);
      });

      it("En ne remplacant pas un défenseur par un gardien si aucun défenseur n'est disponible", () => {
        team.pitchPlayers.forEach(player => player.rating = 5);
        team.pitchPlayers[1].lastName = "Theate";
        team.pitchPlayers[1].position = 2;
        delete team.pitchPlayers[1].rating;

        team.benchPlayers.forEach(player => {
          player.position = 3;
        });
        team.benchPlayers[0].rating = 6;
        team.benchPlayers[0].lastName = "Mandanda";

        team.substitutions = [];

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[1].lastName).toBe("Rotaldo");
        expect(updatedTeam.pitchPlayers[1].rating).toBe(2.5);
      });

      it("Par un Rotaldo si aucun defenseur n'est disponible", () => {
        team.pitchPlayers.forEach(player => player.rating = 5);
        delete team.pitchPlayers[10].rating;
        team.pitchPlayers[10].lastName = "Theate";
        team.pitchPlayers[10].position = 2;

        team.benchPlayers.forEach(player => {
          player.position = 3;
        });
        team.substitutions = [];

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Rotaldo");
        expect(updatedTeam.pitchPlayers[10].rating).toBe(2.5); // 6 - 1
      });

      it("Par Rotaldo si plus aucun joueur n'est disponible", () => {
        team.pitchPlayers.forEach(player => player.rating = 5);
        delete team.pitchPlayers[10].rating;
        team.pitchPlayers[10].lastName = "Satriano";
        team.pitchPlayers[10].position = 3;

        team.benchPlayers = [];
        team.substitutions = [];

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].lastName).toBe("Rotaldo");
        expect(updatedTeam.pitchPlayers[10].rating).toBe(2.5);
      });

      it("En marquant le joueur entrant comme remplaçant", () => {
        delete team.pitchPlayers[10].rating;
        team.pitchPlayers[10].lastName = "Satriano";
        team.pitchPlayers[10].position = 4;

        team.benchPlayers[2].rating = 6;
        team.benchPlayers[2].lastName = "Emegha";
        team.benchPlayers[2].position = 4;

        team.substitutions = [];

        const updatedTeam = doSubstitutions(team);
        expect(updatedTeam.pitchPlayers[10].isSubstitute).toBeTruthy();
      });

    });

  });

});