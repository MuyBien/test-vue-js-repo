import { describe, it, expect, beforeEach } from "vitest";
import { NerfGoalkeeperBonus } from "../NerfGoalkeeperBonus";
import { Team } from "@/models/teams/Team";
import { Player } from "@/models/players/Player";

describe("Le bonus NerfGoalkeeperBonus", () => {

  let team, opponentTeam;
  beforeEach(() => {
    team = new Team({
      pitchPlayers: [
        new Player({
          playerId: "player1",
          bonusRating: 0,
        }), // Gardien de but de l'équipe
      ],
    });

    opponentTeam = new Team({
      pitchPlayers: [
        new Player({
          playerId: "opponentGK",
          bonusRating: 0,
        }), // Gardien de but de l'équipe adverse
      ],
    });
  });

  it("donne un malus de 1 au gardien adverse", () => {
    const bonus = new NerfGoalkeeperBonus();
    bonus.apply(team, opponentTeam);

    expect(opponentTeam.pitchPlayers[0].bonusRating).toBe(- 1);
  });

  it("diminue le bonusRating du gardien adverse", () => {
    opponentTeam.pitchPlayers[0].bonusRating = 0.5;

    const bonus = new NerfGoalkeeperBonus();
    bonus.apply(team, opponentTeam);

    expect(opponentTeam.pitchPlayers[0].bonusRating).toBe(- 0.5);
  });
});