import { describe, it, expect, beforeEach } from "vitest";
import { BoostAllPlayersBonus } from "../BoostAllPlayersBonus";
import { Team } from "@/models/teams/Team";
import { Player } from "@/models/players/Player";

describe("Le bonus BoostAllPlayersBonus", () => {

  let team;
  beforeEach(() => {
    team = new Team({
      pitchPlayers: [
        new Player({ bonusRating: 0 }),
        new Player({ bonusRating: 0 }),
        new Player({ bonusRating: 0 }),
      ],
    });
  });

  it("donne un bonus de tous les joueurs titulaires de l'équipe", () => {
    const bonus = new BoostAllPlayersBonus();
    bonus.apply(team);

    team.pitchPlayers.forEach(player => {
      expect(player.bonusRating).toBe(0.5);
    });
  });

  it("Ajoute un bonus aux joueurs qui en ont un", () => {
    team.pitchPlayers[1].bonusRating = 1;
    const bonus = new BoostAllPlayersBonus();
    bonus.apply(team);

    expect(team.pitchPlayers[1].bonusRating).toBe(1.5);
  });

  it("Ajoute un bonus aux joueurs qui ont un malus", () => {
    team.pitchPlayers[1].bonusRating = - 1;
    const bonus = new BoostAllPlayersBonus();
    bonus.apply(team);

    expect(team.pitchPlayers[1].bonusRating).toBe(- 0.5);
  });

});