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

    this.pitchPlayers = team.pitchPlayers;
    this.benchPlayers = team.benchPlayers;
    this.substitutions = team.substitutions;

    this.bonus = team.bonus;
  }
}