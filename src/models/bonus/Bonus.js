export class Bonus {

  name;
  value;
  icon;
  description;
  timing;

  constructor (bonusData) {
    if (new.target === Bonus) {
      throw new TypeError("La classe Bonus est une classe abstraite et ne peut pas être utilisée directement");
    }
    this.name = bonusData.name;
    this.value = bonusData.value;
    this.icon = bonusData.icon;
    this.description = bonusData.description;
    this.timing = bonusData.timing;
  }

  apply () {
    throw new Error("La methode 'apply' doit être implémentée");
  }
}