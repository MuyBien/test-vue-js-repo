import { describe, it, expect, beforeEach } from "vitest";

import { Team } from "../Team";
import matchMock from "@/assets/mocks/match/response.js";

describe("Le modèle d'une équipe", () => {

  let team;
  beforeEach(() => {
    team = new Team(matchMock.home);
  });

  describe("Construit une équipe", () => {

    it("Avec une compo", () => {
      expect(team.composition).toBe("433");
    });

    it("Avec les titulaires", () => {
      expect(team.starters).toHaveLength(11);
      expect(team.starters[0].lastName).toBe("Bizot");
    });

    it("Avec les remplaçants", () => {
      expect(team.substitutes).toHaveLength(7);
      expect(team.substitutes[0].lastName).toBe("Sylla");
    });

    it("Avec les remplacements", () => {
      expect(team.substitutions).toHaveLength(5);
      expect(team.substitutions[0].rating).toBe(6.5);
    });

  });

  describe("Calcule l'équipe finale", () => {

    describe("En faisant les remplacements tactiques", () => {

      it("D'un joueur qui a eu une note inférieure à la note requise", () => {
        team = new Team(matchMock.home);

        team.starters[10].rating = 5.5;
        team.starters[10].bonusRating = 0;
        team.starters[10].lastName = "Satriano";

        team.substitutes[2].rating = 6;
        team.substitutes[2].lastName = "Emegha";

        team.substitutions[0] = {
          rating: 6,
          subId: team.substitutes[2].playerId,
          starterId: team.starters[10].playerId,
        };

        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Emegha");
        expect(finalPlayers[10].rating).toBe(6);
      });

      it("Si le joueur titulaire n'a pas joué", () => {
        team = new Team(matchMock.home);
        delete team.starters[10].rating;
        team.starters[10].lastName = "Satriano";
        team.substitutes[2].rating = 6;
        team.substitutes[2].lastName = "Emegha";
        team.substitutions[0] = {
          rating: 6,
          subId: team.substitutes[2].playerId,
          starterId: team.starters[10].playerId,
        };
        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Emegha");
        expect(finalPlayers[10].rating).toBe(6);
      });

      it("Sauf si le joueur remplaçant n'a pas joué", () => {
        team = new Team(matchMock.home);
        team.starters[10].rating = 5.5;
        team.starters[10].lastName = "Satriano";
        delete team.substitutes[2].rating;
        team.substitutes[2].lastName = "Emegha";
        team.substitutions[0] = {
          rating: 6,
          subId: team.substitutes[2].playerId,
          starterId: team.starters[10].playerId,
        };
        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Satriano");
        expect(finalPlayers[10].rating).toBe(5.5);
      });

      it("Sauf si le joueur titulaire a eu la note requise", () => {
        team = new Team(matchMock.home);
        team.starters[10].rating = 6;
        team.starters[10].lastName = "Satriano";
        delete team.substitutes[2].rating;
        team.substitutes[2].lastName = "Emegha";
        team.substitutions[0] = {
          rating: 6,
          subId: team.substitutes[2].playerId,
          starterId: team.starters[10].playerId,
        };
        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Satriano");
        expect(finalPlayers[10].rating).toBe(6);
      });

      it("En prenant en compte les bonus", () => {
        team = new Team(matchMock.home);

        team.starters[10].rating = 5;
        team.starters[10].bonusRating = 1;
        team.starters[10].lastName = "Satriano";

        team.substitutes[0].lastName = "Emegha";
        team.substitutes[0].rating = 4;

        team.substitutions[0] = {
          rating: 6,
          subId: team.substitutes[0].playerId,
          starterId: team.starters[10].playerId,
        };

        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Satriano");
        expect(finalPlayers[10].rating).toBe(5);
      });

    });

    describe("En remplaçant les joueurs qui n'ont pas joué", () => {

      it("Par un joueur du même poste disponible sur le banc après RT", () => {
        team = new Team(matchMock.home);

        team.starters[9].rating = 4;
        team.starters[9].lastName = "Balogun";
        team.starters[9].position = 4;

        delete team.starters[10].rating;
        team.starters[10].lastName = "Satriano";
        team.starters[10].position = 4;

        team.substitutes[1].rating = 5;
        team.substitutes[1].lastName = "RKM";
        team.substitutes[1].position = 4;

        team.substitutes[2].rating = 6;
        team.substitutes[2].lastName = "Emegha";
        team.substitutes[2].position = 4;

        team.substitutions = [{
          rating: 6,
          subId: team.substitutes[1].playerId, // RKM
          starterId: team.starters[9].playerId, // Balogun
        }];

        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Emegha");
        expect(finalPlayers[10].rating).toBe(6);
      });

      it("Par un milieu (avec malus) si aucun attaquant n'est disponible", () => {
        team = new Team(matchMock.home);

        team.starters.map(player => player.rating = 3);
        delete team.starters[10].rating;
        team.starters[10].lastName = "Satriano";
        team.starters[10].position = 4;

        team.substitutes.map(player => player.position = 5);
        team.substitutes[0].rating = 6;
        team.substitutes[0].lastName = "Zaire Emery";
        team.substitutes[0].position = 3;

        team.substitutions = [];

        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Zaire Emery");
        expect(finalPlayers[10].rating).toBe(5); // 6 - 1
      });

      it("Par un defenseur (avec malus) si aucun milieu n'est disponible", () => {
        team = new Team(matchMock.home);

        team.starters.map(player => player.rating = 5);
        delete team.starters[10].rating;
        team.starters[10].lastName = "Zaire Emery";
        team.starters[10].position = 2;

        team.substitutes.map(player => player.position = 4);
        team.substitutes[1].rating = 6;
        team.substitutes[1].lastName = "Theate";
        team.substitutes[1].position = 1;

        team.substitutions = [];

        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Theate");
        expect(finalPlayers[10].rating).toBe(5); // 6 - 1
      });

      it("Par un defenseur (avec double malus) si aucun attaquant ou milieu ne sont disponible", () => {
        team = new Team(matchMock.home);

        team.starters.map(player => player.rating = 5);
        team.starters[10].lastName = "Satriano";
        team.starters[10].position = 4;
        delete team.starters[10].rating;

        team.substitutes.map(player => player.position = 2);
        team.substitutes[0].rating = 6;
        team.substitutes[0].lastName = "Theate";
        team.substitutes[0].position = 2;

        team.substitutions = [];

        const finalPlayers = team.getFinalPlayers();
        console.log("🚀 ~ file: Team.spec.js:221 ~ it.only ~ finalPlayers[10]:", finalPlayers[10])
        expect(finalPlayers[10].lastName).toBe("Theate");
        expect(finalPlayers[10].rating).toBe(4); // 6 - 2
      });


      it("Par un Rotaldo si aucun defenseur n'est disponible", () => {
        team = new Team(matchMock.home);

        team.starters.map(player => player.rating = 5);
        delete team.starters[10].rating;
        team.starters[10].lastName = "Theate";
        team.starters[10].position = 2;

        team.substitutes.map(player => player.position = 4);

        team.substitutions = [];

        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Rotaldo");
        expect(finalPlayers[10].rating).toBe(2.5); // 6 - 1
      });

      it("Par Rotaldo si plus aucun joueur n'est disponible", () => {
        team = new Team(matchMock.home);

        team.starters.map(player => player.rating = 5);
        delete team.starters[10].rating;
        team.starters[10].lastName = "Satriano";
        team.starters[10].position = 3;

        team.substitutes = [];
        team.substitutions = [];

        const finalPlayers = team.getFinalPlayers();
        expect(finalPlayers[10].lastName).toBe("Rotaldo");
        expect(finalPlayers[10].rating).toBe(2.5);
      });

    });

    describe("En calculant les buts d'une équipe", () => {

      it("Une fois les RT effectués", () => {
        team = new Team(matchMock.home);

        team.starters.map(player => player.goals = 0);
        team.substitutes.map(player => player.goals = 0);

        team.starters[10].rating = 5;
        team.starters[10].lastName = "Satriano";
        team.starters[10].goals = 1;

        team.substitutes[2].rating = 6;
        team.substitutes[2].lastName = "Emegha";
        team.substitutes[2].goals = 2;

        team.substitutions[0] = {
          rating: 6,
          subId: team.substitutes[2].playerId,
          starterId: team.starters[10].playerId,
        };

        const teamGoals = team.getFinalTeamGoals();
        expect(teamGoals.goals).toBe(2);
        expect(teamGoals.ownGoals).toBe(0);
      });

      it("En ajoutant un CSC tous les 3 Rotaldo", () => {
        team = new Team(matchMock.home);

        team.starters.map(player => player.rating = undefined);
        team.substitutes.map(player => player.rating = undefined);
        team.substitutions= [];

        const teamGoals = team.getFinalTeamGoals();
        expect(teamGoals.goals).toBe(0);
        expect(teamGoals.ownGoals).toBe(3);
      });

    });

  });

  describe("Calcule les moyennes", () => {

    it("Des attaquants", () => {
      expect(team.getAverages()[3]).toBe(3.25);
    });

    it("Des milieux", () => {
      expect(team.getAverages()[2]).toBe(4.875);
    });

    it("Des défenseurs", () => {
      expect(team.getAverages()[1]).toBe(6.375);
    });

    it("Du gardien", () => {
      expect(team.getAverages()[0]).toBe(7);
    });
  });

});