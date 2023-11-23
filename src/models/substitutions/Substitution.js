export class Substitution {

  starterId;
  subId;
  rating;

  constructor (substitution = {}) {
    this.starterId = substitution.starterId;
    this.subId = substitution.subId;
    this.rating = substitution.rating;
  }
}