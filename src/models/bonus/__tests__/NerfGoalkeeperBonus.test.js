import { Player } from "@/models/players/Player";
import { Team } from "@/models/teams/Team";
import { beforeEach, describe, expect, it } from "vitest";
import { NerfGoalkeeperBonus } from "../NerfGoalkeeperBonus";

describe("Le bonus NerfGoalkeeperBonus", () => {

  let team, opponentTeam;
  let bonus;

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
    bonus = new NerfGoalkeeperBonus();
  });

  it("donne un malus de 1 au gardien adverse", () => {
    bonus.apply(team, opponentTeam);

    expect(opponentTeam.pitchPlayers[0].bonusRating).toBe(- 1);
  });

  it("diminue le bonusRating du gardien adverse", () => {
    opponentTeam.pitchPlayers[0].bonusRating = 0.5;

    bonus.apply(team, opponentTeam);

    expect(opponentTeam.pitchPlayers[0].bonusRating).toBe(- 0.5);
  });

  it("retire le malus de 1 au gardien adverse quand il est annulé", () => {
    opponentTeam.pitchPlayers[0].bonusRating = - 1;

    bonus.revert(team, opponentTeam);

    expect(opponentTeam.pitchPlayers[0].bonusRating).toBe(0);
  });

});