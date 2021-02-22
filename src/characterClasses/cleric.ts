import type { CharacterClass } from "./types";

const cleric: CharacterClass = {
  name: "Cleric",
  primeRequisites: ["WIS"],
  hitDice: "1d6",
  languages: ["Alignment", "Common"],
  weapons: "Any blunt weapons",
  armor: "Any, including shields",
};

export default cleric;
