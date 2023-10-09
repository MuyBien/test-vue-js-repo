import { describe, it, expect } from "vitest";

import matchMock from "@/assets/mocks/match/response.js";
import { Player } from "../Player";

describe("Le modèle de joueur", () => {

  let player;
  const playerMock = matchMock.home.players[1];

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