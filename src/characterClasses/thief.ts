import type { CharacterClass } from "./types";

const halfling: CharacterClass = {
  name: "Thief",
  primeRequisites: ["DEX"],
  hitDice: "1d4",
  languages: ["Alignment", "Common"],
  armor: "Leather, no shields",
  weapons: "Any",
  specialAbilities: [
    "Backstab",
    "Climb Sheer Surfaces",
    "Find or Remove Treasure Traps",
    "Hear Noise",
    "Move Silently",
    "Open Locks",
    "Pick Pockets",
    "Read Languages (level 4+)",
    "Scroll Use (level 10+)",
  ],
};

export default halfling;
