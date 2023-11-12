import { describe, it, expect, beforeEach } from "vitest";
import { BoostOnePlayerBonus } from "../BoostOnePlayerBonus";
import { Team } from "@/models/teams/Team";
import { Player } from "@/models/players/Player";

describe("Le bonus BoostOnePlayerBonus", () => {

  let team;
  beforeEach(() => {
    team = new Team({
      pitchPlayers: [
        new Player({
          playerId: "player1",
          bonusRating: 0,
        }),
        new Player({
          playerId: "player2",
          bonusRating: 0,
        }),
        new Player({
          playerId: "player3",
          bonusRating: 0,
        }),
      ],
    });
  });

  it("augmente le bonusRating du joueur spécifié de l'équipe", () => {
    const bonus = new BoostOnePlayerBonus({ playerId: "player2" });

    bonus.apply(team);

    const player = team.pitchPlayers.find(p => p.playerId === "player2");
    expect(player.bonusRating).toBe(1);

    expect(team.pitchPlayers.find(p => p.playerId === "player1").bonusRating).toBe(0);
    expect(team.pitchPlayers.find(p => p.playerId === "player3").bonusRating).toBe(0);
  });
});