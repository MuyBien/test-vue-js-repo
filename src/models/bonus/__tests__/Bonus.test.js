import { describe, expect, it } from "vitest";
import { Bonus } from "../Bonus.js";

describe("La classe abstraite de Bonus", () => {

  it("renvoi une erreur si il est instancié directement", () => {
    expect(() => new Bonus()).toThrow(TypeError);
  });

  it("renvoi une erreur si la méthode apply n'est pas implémentée", () => {
    expect(() => new Bonus().apply()).toThrow(Error);
  });
});