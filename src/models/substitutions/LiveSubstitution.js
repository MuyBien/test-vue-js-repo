import { Substitution } from "./Substitution";

export class LiveSubstitution extends Substitution {

  substitutedAt;

  constructor (substitutionData = {}) {
    super(substitutionData);
    this.rating = Infinity;
    this.substitutedAt = substitutionData.substitutedAt;
  }

}