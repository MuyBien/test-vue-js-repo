import { Player } from "@/models/players/Player";
import { Team } from "@/models/teams/Team";
import { beforeEach, describe, expect, it } from "vitest";
import { FourStrikersBonus } from "../FourStrikersBonus";

describe("FourStrikersBonus", () => {

  let team;
  let bonus;

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
    bonus = new FourStrikersBonus();
  });

  it("augmente le bonusRating des joueurs défenseurs de l'équipe", () => {
    bonus.apply(team);

    expect(team.pitchPlayers.find(p => p.playerId === "player1").bonusRating).toBe(0);
    expect(team.pitchPlayers.find(p => p.playerId === "player2").bonusRating).toBe(0.5);
    expect(team.pitchPlayers.find(p => p.playerId === "player3").bonusRating).toBe(0.5);
    expect(team.pitchPlayers.find(p => p.playerId === "player4").bonusRating).toBe(0);
  });

  it("augmente le bonusRating du capitaine de l'équipe", () => {
    team.pitchPlayers[1].isCaptain = true;
    team.pitchPlayers[1].bonusRating = 1;

    bonus.apply(team);

    expect(team.pitchPlayers.find(p => p.playerId === "player2").bonusRating).toBe(1.5);
  });

  it("augmente le bonusRating d'un joueur qui a un malus", () => {
    team.pitchPlayers[1].bonusRating = - 0.5;

    bonus.apply(team);

    expect(team.pitchPlayers.find(p => p.playerId === "player2").bonusRating).toBe(0);
  });

  it("retire le bonusRating des défenseurs de l'équipe quand il est annulé", () => {
    team.pitchPlayers[1].bonusRating = 0.5;
    team.pitchPlayers[2].bonusRating = 0.5;
    team.pitchPlayers[3].bonusRating = 0.5;

    bonus.revert(team);

    expect(team.pitchPlayers.find(p => p.playerId === "player1").bonusRating).toBe(0);
    expect(team.pitchPlayers.find(p => p.playerId === "player2").bonusRating).toBe(0);
    expect(team.pitchPlayers.find(p => p.playerId === "player3").bonusRating).toBe(0);
    expect(team.pitchPlayers.find(p => p.playerId === "player4").bonusRating).toBe(0.5);
  });

});