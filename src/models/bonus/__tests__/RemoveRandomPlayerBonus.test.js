import { describe, it, expect } from "vitest";
import { RemoveRandomPlayerBonus } from "../RemoveRandomPlayerBonus";
import { Player } from "@/models/players/Player";
import { Rotaldo } from "@/models/players/Rotaldo";

const createMockTeam = (playerIds) => {
  return { pitchPlayers: playerIds.map(id => new Player({ playerId: id })) };
};

describe("Le bonus RemoveRandomPlayerBonus", () => {
  it("remplace un joueur spécifié par un Rotaldo dans l'équipe", () => {
    const team = createMockTeam(["player1", "player2", "player3"]);
    const opponentTeam = createMockTeam(["player4", "player5", "player6"]);

    const bonus = new RemoveRandomPlayerBonus({
      team: "team",
      position: 1,
    });
    bonus.apply(team, opponentTeam);

    expect(team.pitchPlayers.some(p => p instanceof Rotaldo)).toBe(true);
  });

  it("remplace un joueur spécifié par un Rotaldo dans l'équipe adverse", () => {
    const team = createMockTeam(["player1", "player2", "player3"]);
    const opponentTeam = createMockTeam(["player4", "player5", "player6"]);

    const bonus = new RemoveRandomPlayerBonus({
      team: "opponentTeam",
      position: 1,
    });
    bonus.apply(team, opponentTeam);

    expect(opponentTeam.pitchPlayers.some(p => p instanceof Rotaldo)).toBe(true);
  });

  it("remplace un joueur spécifié par un Rotaldo avec un CSC i c'est le 3eme Rotaldo", () => {
    const team = createMockTeam(["player1", "player2", "player3"]);
    const opponentTeam = createMockTeam(["player4", "player5", "player6"]);
    opponentTeam.pitchPlayers[0].lastName = "Rotaldo";
    opponentTeam.pitchPlayers[2].lastName = "Rotaldo";

    const bonus = new RemoveRandomPlayerBonus({
      team: "opponentTeam",
      position: 1,
    });
    bonus.apply(team, opponentTeam);

    expect(opponentTeam.pitchPlayers[1].ownGoals).toBe(1);
  });

});