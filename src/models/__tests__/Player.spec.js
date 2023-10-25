import { describe, it, expect } from "vitest";

import matchMock from "@/assets/mocks/match/response.js";
import { Player } from "../Player";

describe("Le modèle de joueur", () => {

  let player;
  const playerMock = matchMock.home.players[1];

  describe("Permet de connaitre la position du joueur", () => {

    it("Qui est gardien", () => {
      player = new Player({
        ...playerMock,
        position: 1,
      });
      expect(player.isGoalkeeper()).toBeTruthy();
      expect(player.isBacker()).toBeFalsy();
      expect(player.isMiddle()).toBeFalsy();
      expect(player.isForward()).toBeFalsy();
    });

    it("Qui est défenseur", () => {
      player = new Player({
        ...playerMock,
        position: 2,
      });
      expect(player.isGoalkeeper()).toBeFalsy();
      expect(player.isBacker()).toBeTruthy();
      expect(player.isMiddle()).toBeFalsy();
      expect(player.isForward()).toBeFalsy();
    });

    it("Qui est milieu", () => {
      player = new Player({
        ...playerMock,
        position: 3,
      });
      expect(player.isGoalkeeper()).toBeFalsy();
      expect(player.isBacker()).toBeFalsy();
      expect(player.isMiddle()).toBeTruthy();
      expect(player.isForward()).toBeFalsy();
    });

    it("Qui est attaquant", () => {
      player = new Player({
        ...playerMock,
        position: 4,
      });
      expect(player.isGoalkeeper()).toBeFalsy();
      expect(player.isBacker()).toBeFalsy();
      expect(player.isMiddle()).toBeFalsy();
      expect(player.isForward()).toBeTruthy();
    });

  });

  it("Renvoi le score du joueur en comptant les bonus", () => {
    player = new Player({
      ...playerMock,
      rating: 5,
      bonusRating: 1,
    });
    expect(player.getTotalScore()).toBe(6);
  });

  it("Permet d'annuler un but via la valise", () => {
    player = new Player({
      ...playerMock,
      goals: 2,
    });
    player.cancelGoal();
    expect(player.goals).toBe(2);
    expect(player.canceledGoals).toBe(1);
  });

});