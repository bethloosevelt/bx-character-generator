import type { CharacterClass } from "./types";
import { defaultPrimeRequisiteModifierTableForAbility } from "./types";

const dwarf: CharacterClass = {
  name: "Dwarf",
  primeRequisites: ["STR"],
  primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("STR"),
  hitDice: "1d8",
  languages: ["Alignment", "Common", "Dwarvish", "Gnomish", "Goblin", "Kobold"],
  abilityMinimums: [{ ability: "CON", minimum: 9 }],
  armor: "Any, including shields",
  weapons: "Small or normal sized",
  specialAbilities: [
    "Detect Construction Tricks",
    "Detect Room Traps",
    "Infravision",
    "Listening at Doors",
    "Establish Underground Stronghold (level 9+)",
  ],
  savingThrows: {
    d: 8,
    w: 9,
    p: 10,
    b: 13,
    s: 12,
  },
  expToNextLevel: 2200,
};

export default dwarf;
