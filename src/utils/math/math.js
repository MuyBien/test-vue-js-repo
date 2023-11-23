/**
 * Permet d'arrondir un chiffre à virgule
 * @param { Number } float Le nombre à arrondir
 * @param { Number } [decimalNumber=2] Le nombre de chiffre après la virgule à garder
 * @returns { Number } Le nouveau nombre arrondi
 */
const roundFloat = (float, decimalNumber = 2) => {
  if (typeof float !== "number" || typeof decimalNumber !== "number") {
    throw new Error("Parameter is not a number!");
  }
  return parseFloat(float.toFixed(decimalNumber));
};

export { roundFloat };