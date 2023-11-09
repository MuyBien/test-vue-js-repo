import { Team } from "@/models_refactored/teams/Team";
import { Player } from "@/models_refactored/players/Player";
import { Substitution } from "@/models_refactored/substitutions/Substitution";

const teamConstructor = (teamData) => {
  const team = new Team();

  team.id = teamData.id;
  team.name = teamData.name;
  team.jersey = teamData.jerseyUrl;

  team.starters = setStarters(teamData.players, teamData.playersOnPitch);
  team.substitutes = setSubstitutes(teamData.players, teamData.playersOnPitch);
  team.substitutions = setSubstitutions(teamData);

  setCaptain(team.starters, teamData.captain);

  return team;
};

const setPlayers = (playersData, pitchData, positionLimit) => {
  const playerMap = {};

  Object.keys(pitchData).forEach((position) => {
    const playerId = pitchData[position].playerId;
    const player = playersData[playerId];
    if (position <= positionLimit) {
      playerMap[playerId] = new Player(player);
    }
  });

  return playerMap;
};

const setStarters = (playersData, pitchData) => {
  return setPlayers(playersData, pitchData, 11);
};

const setSubstitutes = (playersData, pitchData) => {
  return setPlayers(playersData, pitchData, Infinity);
};

const setSubstitutions = (teamData) => {
  return teamData.tacticalSubs.map(substitutionData => new Substitution(substitutionData));
};

const setCaptain = (starters, captainId) => {
  if (captainId) {
    starters[captainId].isCaptain = true;
  }
};

export { teamConstructor };