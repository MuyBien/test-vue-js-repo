import mockMatch from "@/assets/mocks/match/response";
import { matchConstructor } from "@/utils/constructors/matchConstructor";
import { beforeEach, describe, expect, it } from "vitest";
import { setMatchPlayersLiveStatus } from "../playersLiveStatus";

describe("Le setter de statut de note", () => {

  let match;
  let championshipMatches;

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
  });

  it("définit la note d'un joueur en 'live' quand son match est en cours", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 5;

    const resultMatch = await setMatchPlayersLiveStatus(match, championshipMatches);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.isLiveRating).toBeTruthy();
  });

  it("ne définit pas la note d'un joueur en 'live' quand son match est fini", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 3;

    const resultMatch = await setMatchPlayersLiveStatus(match, championshipMatches);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.isLiveRating).toBeFalsy();
  });

  it("ne définit pas la note d'un joueur en 'live' quand son match n'est pas commencé", async () => {
    match.homeTeam.pitchPlayers[0].clubId = 1;

    const resultMatch = await setMatchPlayersLiveStatus(match, championshipMatches);

    const testPlayer = resultMatch.homeTeam.pitchPlayers[0];
    expect(testPlayer.isLiveRating).toBeFalsy();
  });

});