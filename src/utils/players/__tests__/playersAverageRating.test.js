import mockMatch from "@/assets/mocks/match/response";
import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setMatchPlayersAverageRating } from "../playersAverageRating";

describe("Le setter de notes moyennes", () => {

  let match;
  let championshipMatches;

  beforeEach(() => {
    match = matchConstructor(mockMatch);
    championshipMatches = {
      1: {
        period: "firstHalf",
        home: { clubId: 1 },
        away: { clubId: 2 },
      },
      2: {
        period: "fullTime",
        home: { clubId: 3 },
        away: { clubId: 4 },
      },
    };
    resetPlayersClubId(4);
  });

  it("donne sa note moyenne à un joueur dont son match n'a pas commencé", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 1;
    const getPlayerInfos = vi.fn().mockResolvedValue({ averageRating: 5.6 });

    const resultMatch = await setMatchPlayersAverageRating(match, championshipMatches, getPlayerInfos);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.rating).toBe(5.6);
    expect(testPlayer.isAverageRating).toBeTruthy();
  });

  it("ne change pas la note d'un joueur dont son match a commencé", async () => {
    const getPlayerInfos = vi.fn().mockResolvedValue({ averageRating: 5.6 });

    const resultMatch = await setMatchPlayersAverageRating(match, championshipMatches, getPlayerInfos);

    const allFalse = resultMatch.homeTeam.pitchPlayers.map(player => player.isAverageRating).every(val => val === false);
    expect(allFalse).toBeTruthy();
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