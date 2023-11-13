import { Team } from "@/models/teams/Team";
import { Player } from "@/models/players/Player";
import { Substitution } from "@/models/substitutions/Substitution";

import { BONUSES } from "@/constants/bonus";

/**
 * Construit une équipe avec les données renvoyées par MPG
 *
 * @param {Object} teamData - Les données d'une équipe dans le retour de MPG
 * @param {string} teamData.teamId - L'ID de l'équipe
 * @param {string} teamData.name - Le nom de l'équipe
 * @param {string} teamData.jerseyUrl - L'URL du maillot de l'équipe
 * @param {Array} teamData.players - L'ensemble des joueurs de l'équipe
 * @param {Map} teamData.playersOnPitch - La liste des IDs des joueurs sur le terrain
 * @param {string} teamData.captain - L'ID du joueur capitaine
 * @param {Bonus} teamData.bonuses - Le bonus de l'équipe
 * @returns {Team} - L'équipe construite
 */
const teamConstructor = (teamData) => {
  const team = new Team();

  team.id = teamData.teamId;
  team.name = teamData.name || teamData.abbreviation;
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
    starters.find(({ playerId }) => playerId === captainId).isCaptain = true;
  }
};

const setBonus = (allBonuses) => {
  for (const bonusKey in allBonuses) {
    const bonusClass = BONUSES[bonusKey];
    if (bonusClass) {
      return new bonusClass(allBonuses[bonusKey]);
    }
  }
  return new BONUSES["none"];
};

export { teamConstructor };