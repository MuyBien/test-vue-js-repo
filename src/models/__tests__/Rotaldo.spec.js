import { describe, it, expect } from "vitest";

import matchMock from "@/assets/mocks/match/response.js";
import { Rotaldo } from "../Rotaldo";

describe("Le modèle de Rotaldo", () => {

  let player;
  const playerMock = matchMock.home.players[1];

  it("Créé un joueur appelé Rotaldo", () => {
    player = new Rotaldo({
      ...playerMock,
      lastName: "Drogba",
    });
    expect(player.lastName).toBe("Rotaldo");
  });

  it("Créé un joueur avec une note de 2.5", () => {
    player = new Rotaldo({
      ...playerMock,
      rating: 5,
    });
    expect(player.getTotalScore()).toBe(2.5);
  });

  it("Créé un joueur sans bonus", () => {
    player = new Rotaldo({
      ...playerMock,
      bonusRating: 0.5,
      rating: 5,
    });
    expect(player.getTotalScore()).toBe(2.5);
  });

});