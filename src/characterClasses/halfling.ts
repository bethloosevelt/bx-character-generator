import type { CharacterClass } from "./types";

const halfling: CharacterClass = {
  name: "Halfling",
  primeRequisites: ["DEX", "STR"],
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
};

export default halfling;
