import type { CharacterClass } from "./types";

const halfling: CharacterClass = {
  name: "Halfling",
  primeRequisites: ["DEX", "STR"],
  primeRequisiteModifier: [
    {
      condition: {
        type: "AND",
        first: { type: "IN_RANGE", ability: "DEX", min: 16, max: 18 },
        second: { type: "IN_RANGE", ability: "STR", min: 16, max: 18 },
      },
      result: 0.1,
    },
    {
      condition: {
        type: "OR",
        first: { type: "IN_RANGE", ability: "DEX", min: 13, max: 15 },
        second: { type: "IN_RANGE", ability: "STR", min: 13, max: 15 },
      },
      result: 0.05,
    },
  ],
  hitDice: "1d6",
  languages: ["Alignment", "Common", "Halfling"],
  abilityMinimums: [
    { ability: "CON", minimum: 9 },
    { ability: "DEX", minimum: 9 },
  ],
  armor: "Any appropriate to size, including shields",
  weapons: "Any appropriate to size",
  specialAbilities: [
    "Defensive Bonus",
    "Hiding",
    "Initiative Bonus",
    "Listening at Doors",
    "Missle Attack Bonus",
    "Stronghold",
  ],
  savingThrows: {
    d: 8,
    w: 9,
    p: 10,
    b: 13,
    s: 12,
  },
  expToNextLevel: 2000,
};

export default halfling;
