import { beforeEach, describe, it, expect } from "vitest";

import { BlockSubstitutionsBonus } from "../BlockSubstitutionsBonus";
import { Team } from "@/models/teams/Team";
import { Substitution } from "@/models/substitutions/Substitution";

describe("Le bonus BlockSubstitutionsBonus", () => {

  let team;
  let opponentTeam;
  const bonus = new BlockSubstitutionsBonus();

  beforeEach(() => {
    team = new Team({ substitutions: [new Substitution(), new Substitution()] });
    opponentTeam = new Team({ substitutions: [new Substitution(), new Substitution()] });
  });

  it("bloque les remplacements tactiques de l'équipe adverse", () => {
    bonus.apply(team, opponentTeam);
    expect(opponentTeam.substitutions).toHaveLength(0);
  });

});