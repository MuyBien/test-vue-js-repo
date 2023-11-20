import { beforeEach, describe, expect, it } from "vitest";

import { LiveSubstitution } from "@/models/substitutions/LiveSubstitution";
import { Substitution } from "@/models/substitutions/Substitution";
import { Team } from "@/models/teams/Team";
import { BlockSubstitutionsBonus } from "../BlockSubstitutionsBonus";

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

  it("bloque les remplacements lives de l'équipe adverse en gardant les 2 premiers dans l'ordre chronologique", () => {
    opponentTeam = new Team({
      isLiveSubstitutesEnabled: true,
      substitutions: [new LiveSubstitution(), new LiveSubstitution(), new LiveSubstitution()],
    });
    opponentTeam.substitutions[0].substitutedAt = new Date("2023-12-31").toISOString();
    opponentTeam.substitutions[1].substitutedAt = new Date("2023-12-30").toISOString();
    opponentTeam.substitutions[2].substitutedAt = new Date("2023-12-29").toISOString();

    bonus.apply(team, opponentTeam);

    expect(opponentTeam.substitutions).toHaveLength(2);
    expect(opponentTeam.substitutions[0].substitutedAt).toBe(new Date("2023-12-29").toISOString());
    expect(opponentTeam.substitutions[1].substitutedAt).toBe(new Date("2023-12-30").toISOString());
  });

});