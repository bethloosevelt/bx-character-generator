import type { CharacterClass } from "./types";

const dwarf: CharacterClass = {
  name: "Dwarf",
  primeRequisites: ["STR"],
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
};

export default dwarf;
