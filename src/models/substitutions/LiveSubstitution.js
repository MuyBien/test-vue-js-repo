import { Substitution } from "./Substitution";

export class LiveSubstitution extends Substitution {

  constructor (substitutionData) {
    super(substitutionData);
    this.rating = Infinity;
  }

}