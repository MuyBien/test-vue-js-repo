import mockMatch from "@/assets/mocks/match/response";
import { matchConstructor } from "@/utils/constructors/matchConstructor";
import "fake-indexeddb/auto";
import { openDB } from "idb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setMatchPlayersAverageRating } from "../playersAverageRating";

describe("Le setter de notes moyennes", () => {

  let match;
  let championshipMatches;
  let getPlayerInfos;

  beforeEach(() => {
    match = matchConstructor(mockMatch);
    championshipMatches = {
      1: {
        home: { clubId: 1 },
        away: { clubId: 2 },
      },
      2: {
        period: "fullTime", // terminé
        home: { clubId: 3 },
        away: { clubId: 4 },
      },
      3: {
        period: "firstHalf", // en cours
        home: { clubId: 5 },
        away: { clubId: 6 },
      },
    };
    resetPlayersClubId(4);
    getPlayerInfos = vi.fn().mockResolvedValue({ averageRating: 5.6 });
  });

  it("donne sa note moyenne à un joueur dont son match n'a pas commencé", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 1;

    const resultMatch = await setMatchPlayersAverageRating(match, championshipMatches, getPlayerInfos);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.rating).toBe(5.6);
    expect(testPlayer.isAverageRating).toBeTruthy();
  });

  it("donne sa note moyenne à un joueur dont son match va bientôt commencé", async () => {
    championshipMatches = {
      1: {
        period: "preMatch", // bientôt commencé
        home: { clubId: 1 },
        away: { clubId: 2 },
      },
    };
    match.homeTeam.pitchPlayers[0].clubId = 1;

    const resultMatch = await setMatchPlayersAverageRating(match, championshipMatches, getPlayerInfos);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.rating).toBe(5.6);
    expect(testPlayer.isAverageRating).toBeTruthy();
  });

  it("ne change pas la note d'un joueur dont son match a commencé", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 5;

    const resultMatch = await setMatchPlayersAverageRating(match, championshipMatches, getPlayerInfos);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.rating).toBe(6.5);
    expect(testPlayer.isAverageRating).toBeFalsy();
  });

  it("ne change pas la note d'un joueur dont son match est terminé", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 3;

    const resultMatch = await setMatchPlayersAverageRating(match, championshipMatches, getPlayerInfos);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.rating).toBe(6.5);
    expect(testPlayer.isAverageRating).toBeFalsy();
  });

  it("récupère la note moyenne d'un joueur en local si elle existe", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 1;

    const db = await openDB("players-db", 1, {
      upgrade (db) {
        db.createObjectStore("playerInfos");
      },
    });
    await db.put("playerInfos", {
      data: { averageRating: 6.1 },
      updatedAt: Date.now(),
    }, match.homeTeam.pitchPlayers[0].playerId);

    const resultMatch = await setMatchPlayersAverageRating(match, championshipMatches, getPlayerInfos);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.rating).toBe(6.1);
    expect(testPlayer.isAverageRating).toBeTruthy();
  });

  it("ne récupère pas la note moyenne d'un joueur en local si elle est périmée", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 1;

    const db = await openDB("players-db", 1, {
      upgrade (db) {
        db.createObjectStore("playerInfos");
      },
    });
    const twoDays = 1000 * 60 * 60 * 24 * 2;
    await db.put("playerInfos", {
      data: { averageRating: 6.1 },
      updatedAt: Date.now() - twoDays,
    }, match.homeTeam.pitchPlayers[0].playerId);

    const resultMatch = await setMatchPlayersAverageRating(match, championshipMatches, getPlayerInfos);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.rating).toBe(5.6);
    expect(testPlayer.isAverageRating).toBeTruthy();
  });

  const resetPlayersClubId = (clubId) => {
    match.homeTeam.pitchPlayers.forEach((player) => {
      player.clubId = clubId;
    });
    match.homeTeam.benchPlayers.forEach((player) => {
      player.clubId = clubId;
    });
    match.awayTeam.pitchPlayers.forEach((player) => {
      player.clubId = clubId;
    });
    match.awayTeam.benchPlayers.forEach((player) => {
      player.clubId = clubId;
    });
  };

});