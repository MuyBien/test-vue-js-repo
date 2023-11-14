/**
 * Permet d'arrondir un chiffre à virgule
 * @param { Float } float Le nombre à arrondir
 * @param { Number } decimalNumber Le nombre de chiffre après la virgule à garder
 * @returns { Float } Le nouveau nombre arrondi
 */
const roundFloat = (float, decimalNumber = 2) => {
  if (isNaN(float) || isNaN(decimalNumber)) {
    throw new Error("Parameter is not a number!");
  }
  return parseFloat(float.toFixed(decimalNumber));
};

export { roundFloat };