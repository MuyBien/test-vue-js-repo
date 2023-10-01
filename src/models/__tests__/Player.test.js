import { describe, it, expect, beforeEach } from "vitest";

import matchMock from "@/assets/mocks/match/response.js";
import { Player } from "../Player";

describe("Le modèle de joueur", () => {

  let player;
  let playerMock = matchMock.home.players[1];

  it("Renvoi le score du joueur en comptant les bonus", () => {
    player = new Player({
      ...playerMock,
      rating: 5,
      bonusRating: 1,
    });
    expect(player.getTotalScore()).toBe(6);
  });

});