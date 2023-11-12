export class Substitution {

  starterId;
  subId;
  rating;
  done;

  constructor (substitution = {}) {
    this.starterId = substitution.starterId;
    this.subId = substitution.subId;
    this.rating = substitution.rating;
    this.done = substitution.done || false;
  }
}