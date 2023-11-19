import { Substitution } from "./Substitution";

export default class LiveSubstitution extends Substitution {

  constructor (substitutionData) {
    super(substitutionData);
    this.rating = Infinity;
  }

}