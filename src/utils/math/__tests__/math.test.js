import { describe, expect, it } from "vitest";
import { roundFloat } from "../math";

describe("La méthode roundFloat", () => {

  it("arrondi un chiffre à virgule", () => {
    expect(roundFloat(2.5699, 2)).toBe(2.57);
    expect(roundFloat(2.5639, 1)).toBe(2.6);
    expect(roundFloat(2.5600, 3)).toBe(2.560);
    expect(roundFloat(2.56, 2)).toBe(2.56);
    expect(roundFloat(2.5, 2)).toBe(2.5);
  });

  it("renvoi une erreur si aucun chiffre à arrondir n'est donné", () => {
    expect(() => roundFloat()).toThrow("Parameter is not a number!");
    expect(() => roundFloat("toto")).toThrow("Parameter is not a number!");
  });

  it("renvoi une erreur si le nombre de chiffre après la virgule à garder n'est pas un nombre", () => {
    expect(() => roundFloat(2.566, "2")).toThrow("Parameter is not a number!");
    expect(() => roundFloat(2.566, "deux")).toThrow("Parameter is not a number!");
  });

  it("arrondi par défaut à 2 chiffres après la virgule", () => {
    expect(roundFloat(2.559)).toBe(2.56);
  });

});