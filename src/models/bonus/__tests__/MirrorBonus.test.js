import { BoostAllPlayersBonus } from "@/models/bonus/BoostAllPlayersBonus";
import { MirrorBonus } from "@/models/bonus/MirrorBonus";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Le bonus Mirroir", () => {
  let mirrorBonus;
  let team;
  let opponentTeam;

  beforeEach(() => {
    mirrorBonus = new MirrorBonus();
    team = {
      pitchPlayers: [],
      bonus: mirrorBonus,
    };
    opponentTeam = {
      pitchPlayers: [],
      bonus: new BoostAllPlayersBonus(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("s'initialise avec les bonnes valeurs", () => {
    expect(team.bonus.value).toBe("mirror");
    expect(team.bonus.timing).toBe("beforeAll");
    expect(team.bonus.isLiveApplied).toBe(false);
  });

  it("annule l'effet du bonus adverse si il est liveApplied", () => {
    const revertFunction = vi.fn();
    opponentTeam.bonus.isLiveApplied = true;
    opponentTeam.bonus.revert = revertFunction;

    mirrorBonus.apply(team, opponentTeam);
    expect(revertFunction).toHaveBeenCalled();
  });

  it("copie les informations du bonus adverse", () => {
    opponentTeam.bonus.timing = "afterAll";
    mirrorBonus.apply(team, opponentTeam);

    expect(team.bonus.timing).toBe("afterAll");
    expect(team.bonus.isLiveApplied).toBe(false);
  });

  it("récupère le bon joueur dans l'équipe cible par rapport à la position du joueur du bonus boostOnePlayer", () => {
    opponentTeam.bonus.value = "boostOnePlayer";
    opponentTeam.bonus.playerId = "playerId-1";

    opponentTeam.pitchPlayers = [{ playerId: "playerId-1" }];
    team.pitchPlayers = [{ playerId: "playerId-2" }];

    mirrorBonus.apply(team, opponentTeam);
    expect(team.bonus.playerId).toBe("playerId-2");
  });

  it("désactive le bonus adverse en le passant en 'isLiveApplied'", () => {
    mirrorBonus.apply(team, opponentTeam);
    expect(opponentTeam.bonus.isLiveApplied).toBe(true);
  });
});