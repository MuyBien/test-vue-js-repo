import { roundFloat } from "../math";
import { describe, it, expect } from "vitest";

describe("La méthode roundFloat", () => {

  it("Arrondi un chiffre à virgule", () => {
    expect(roundFloat(2.5699, 2)).toBe(2.57);
    expect(roundFloat(2.5639, 2)).toBe(2.56);
    expect(roundFloat(2.5600, 2)).toBe(2.56);
    expect(roundFloat(2.56, 2)).toBe(2.56);
    expect(roundFloat(2.5, 2)).toBe(2.5);
  });

  it("Renvoi une erreur si aucun chiffre n'est donné", () => {
    expect(() => roundFloat()).toThrowError();
    expect(() => roundFloat("toto")).toThrowError();
  });

  it("Arrondi par défaut à 2 chiffres après la virgule", () => {
    expect(roundFloat(2.559)).toBe(2.56);
  });

});