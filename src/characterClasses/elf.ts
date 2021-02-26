import type { CharacterClass } from "./types";

const elf: CharacterClass = {
  name: "Elf",
  primeRequisites: ["INT", "STR"],
  primeRequisiteModifier: [
    {
      condition: {
        type: "AND",
        first: { type: "IN_RANGE", ability: "INT", min: 16, max: 18 },
        second: { type: "IN_RANGE", ability: "STR", min: 13, max: 18 },
      },
      result: 0.1,
    },
    {
      condition: {
        type: "AND",
        first: { type: "IN_RANGE", ability: "INT", min: 15, max: 15 },
        second: { type: "IN_RANGE", ability: "STR", min: 13, max: 18 },
      },
      result: 0.05,
    },
  ],
  hitDice: "1d6",
  languages: ["Alignment", "Common", "Elvish", "Gnoll", "Hobgoblin", "Orcish"],
  abilityMinimums: [{ ability: "INT", minimum: 9 }],
  armor: "Any, including shields",
  weapons: "Any",
  specialAbilities: [
    "Arcane Magic",
    "Detect Secret Doors",
    "Immunity to Ghoul Paralysis",
    "Infravision",
    "Listening at Doors",
  ],
  savingThrows: {
    d: 12,
    w: 13,
    p: 13,
    b: 15,
    s: 15,
  },
  exploration: {
    sd: "2-in-6",
  },
  expToNextLevel: 4000,
};

export default elf;
