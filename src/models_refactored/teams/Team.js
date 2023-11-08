import { Player } from "./Player";
import { Substitution } from "../substitutions/Substitution";

export class Team {
  id;
  name;
  jersey;

  starters = [];
  substitutes = [];
  substitutions = [];

  pitchPlayers = [];

  constructor (teamData) {

    this.name = teamData.name;
    this.score = teamData.score;
    this.jersey = teamData.jerseyUrl;

    const playersData = Object.values(teamData.players);

    this.starters = this.setStarters(playersData);
    this.substitutes = this.setSubstitutes(playersData);
    this.substitutions = this.setSubstitutions(teamData);

    this.setCaptain(teamData);

    const captainIndex = this.starters.findIndex(player => player.playerId === teamData.captain);
    if (captainIndex > 0) {
      this.starters[captainIndex].isCaptain = true;
    }
  }

  setStarters = (players) => {
    this.starters = players.slice(0, 11).map(playerData => new Player(playerData));
  };

  setSubstitutes = (players) => {
    this.substitutes = players.slice(11).map(playerData => new Player(playerData));
  };

  setSubstitutions = (teamData) => {
    this.substitutions = teamData.tacticalSubs.map(substitutionData => new Substitution(substitutionData));
  };

  setCaptain = (teamData) => {
    const captainIndex = this.starters.findIndex(player => player.playerId === teamData.captain);
    if (captainIndex > 0) {
      this.starters[captainIndex].isCaptain = true;
    }
  };
}