import { describe, it, expect, beforeEach } from "vitest";
import { FourStrikersBonus } from "../FourStrikersBonus";
import { Team } from "@/models/teams/Team";
import { Player } from "@/models/players/Player";

describe("FourStrikersBonus", () => {

  let team;
  beforeEach(() => {
    team = new Team({
      pitchPlayers: [
        new Player({
          playerId: "player1",
          bonusRating: 0,
          position: 1,
        }),
        new Player({
          playerId: "player2",
          bonusRating: 0,
          position: 2,
        }),
        new Player({
          playerId: "player3",
          bonusRating: 0,
          position: 2,
        }),
        new Player({
          playerId: "player4",
          bonusRating: 0,
          position: 3,
        }),
      ],
    });
  });

  it("augmente le bonusRating des joueurs défenseurs de l'équipe", () => {
    const bonus = new FourStrikersBonus();
    bonus.apply(team);

    expect(team.pitchPlayers.find(p => p.playerId === "player1").bonusRating).toBe(0);
    expect(team.pitchPlayers.find(p => p.playerId === "player2").bonusRating).toBe(0.5);
    expect(team.pitchPlayers.find(p => p.playerId === "player3").bonusRating).toBe(0.5);
    expect(team.pitchPlayers.find(p => p.playerId === "player4").bonusRating).toBe(0);
  });

  it("augmente le bonusRating du capitaine de l'équipe", () => {
    team.pitchPlayers[1].isCaptain = true;
    team.pitchPlayers[1].bonusRating = 1;

    const bonus = new FourStrikersBonus();
    bonus.apply(team);

    expect(team.pitchPlayers.find(p => p.playerId === "player2").bonusRating).toBe(1.5);
  });

  it("augmente le bonusRating d'un joueur qui a un malus", () => {
    team.pitchPlayers[1].bonusRating = - 0.5;

    const bonus = new FourStrikersBonus();
    bonus.apply(team);

    expect(team.pitchPlayers.find(p => p.playerId === "player2").bonusRating).toBe(0);
  });

});