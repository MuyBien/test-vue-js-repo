import { describe, expect, it } from "vitest";
import { LiveAppliedBonus } from "../LiveAppliedBonus.js";

describe("La classe abstraite de LiveAppliedBonus", () => {

  it("renvoi une erreur si il est instancié directement", () => {
    expect(() => new LiveAppliedBonus()).toThrow(TypeError);
  });

  it("renvoi une erreur si la méthode apply n'est pas implémentée", () => {
    expect(() => new LiveAppliedBonus().apply()).toThrow(Error);
  });

  it("renvoi une erreur si la méthode revert n'est pas implémentée", () => {
    expect(() => new LiveAppliedBonus().revert()).toThrow(Error);
  });
});