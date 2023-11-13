import { Player } from "../players/Player";
import { Substitution } from "../substitutions/Substitution";

export class Team {
  id;
  name;
  jersey;

  pitchPlayers = [];
  benchPlayers = [];
  substitutions = [];

  bonus;

  constructor (team = {}) {
    this.id = team.id;
    this.name = team.name;
    this.jersey = team.jersey;

    this.pitchPlayers = team.pitchPlayers?.map(player => new Player(player)) || [];
    this.benchPlayers = team.benchPlayers?.map(player => new Player(player)) || [];
    this.substitutions = team.substitutions?.map(substitution => new Substitution(substitution)) || [];

    this.bonus = team.bonus;
  }
}