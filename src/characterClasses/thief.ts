import type { CharacterClass } from "./types";

const halfling: CharacterClass = {
  name: "Thief",
  primeRequisites: ["DEX"],
  hitDice: "1d4",
  languages: ["Alignment", "Common"],
  armor: "Leather, no shields",
  weapons: "Any",
};

export default halfling;
