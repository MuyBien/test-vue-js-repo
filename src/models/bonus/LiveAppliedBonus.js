import { Bonus } from "./Bonus";

export class LiveAppliedBonus extends Bonus {

  constructor (bonusData = {}) {
    super(bonusData);
    if (new.target === LiveAppliedBonus) {
      throw new TypeError("La classe LiveAppliedBonus est une classe abstraite et ne peut pas être utilisée directement");
    }
    this.isLiveApplied = true;
  }

  revert () {
    throw new Error("La methode 'revert' doit être implémentée");
  }
}