import { Player } from "@/models/players/Player";
import { Team } from "@/models/teams/Team";
import { beforeEach, describe, expect, it } from "vitest";
import { BoostAllPlayersBonus } from "../BoostAllPlayersBonus";

describe("Le bonus BoostAllPlayersBonus", () => {

  let team;
  let bonus;

  beforeEach(() => {
    team = new Team({
      pitchPlayers: [
        new Player({ bonusRating: 0 }),
        new Player({ bonusRating: 0 }),
        new Player({ bonusRating: 0 }),
      ],
    });
    bonus = new BoostAllPlayersBonus();
  });

  it("donne un bonus à tous les joueurs titulaires de l'équipe", () => {
    bonus.apply(team);

    team.pitchPlayers.forEach(player => {
      expect(player.bonusRating).toBe(0.5);
    });
  });

  it("ajoute un bonus aux joueurs qui en ont un", () => {
    team.pitchPlayers[1].bonusRating = 1;
    bonus.apply(team);

    expect(team.pitchPlayers[1].bonusRating).toBe(1.5);
  });

  it("ajoute un bonus aux joueurs qui ont un malus", () => {
    team.pitchPlayers[1].bonusRating = - 1;
    bonus.apply(team);

    expect(team.pitchPlayers[1].bonusRating).toBe(- 0.5);
  });

  it("retire le bonus à tous les joueurs titulaires de l'équipe quand il est annulé", () => {
    team.pitchPlayers.forEach(player => {
      player.bonusRating = 0.5;
    });
    bonus.revert(team);

    team.pitchPlayers.forEach(player => {
      expect(player.bonusRating).toBe(0);
    });
  });

});