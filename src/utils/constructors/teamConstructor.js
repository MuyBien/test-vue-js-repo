import { Team } from "@/models/teams/Team";
import { Player } from "@/models/players/Player";
import { Substitution } from "@/models/substitutions/Substitution";

import { BONUSES } from "@/constants/bonus";

const teamConstructor = (teamData) => {
  const team = new Team();

  team.id = teamData.teamId;
  team.name = teamData.name;
  team.jersey = teamData.jerseyUrl;

  team.pitchPlayers = setPitchPlayers(teamData.players, teamData.playersOnPitch);
  team.benchPlayers = setBenchPlayers(teamData.players, teamData.playersOnPitch);
  team.substitutions = setSubstitutions(teamData);

  setCaptain(team.pitchPlayers, teamData.captain);

  team.bonus = setBonus(teamData.bonuses);

  return team;
};

const setPlayers = (playersData, pitchData, start, end) => {
  const playerMap = [];

  Object.keys(pitchData).forEach((position) => {
    const playerId = pitchData[position].playerId;
    const player = playersData[playerId];
    if (position >= start && position <= end) {
      playerMap.push(new Player(player));
    }
  });

  return playerMap;
};

const setPitchPlayers = (playersData, pitchData) => {
  return setPlayers(playersData, pitchData, 0, 11);
};

const setBenchPlayers = (playersData, pitchData) => {
  return setPlayers(playersData, pitchData, 12, Infinity);
};

const setSubstitutions = (teamData) => {
  return teamData.tacticalSubs.map(substitutionData => new Substitution(substitutionData));
};

const setCaptain = (starters, captainId) => {
  if (captainId) {
    starters[captainId] ? starters[captainId].isCaptain = true : undefined;
  }
};

const setBonus = (allBonuses) => {
  for (const bonusKey in allBonuses) {
    const BonusClass = BONUSES[bonusKey];
    if (BonusClass) {
      return new BonusClass();
    }
  }
  return BONUSES["none"];
};

export { teamConstructor };