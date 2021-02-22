import type { CharacterClass } from "./types";

const fighter: CharacterClass = {
  name: "Fighter",
  primeRequisites: ["STR"],
  hitDice: "1d8",
  languages: ["Alignment", "Common"],
  armor: "Any, including shields",
  weapons: "Any",
  specialAbilities: ["Stronghold", "Become Baron/Baroness (level 9+)"],
};

export default fighter;
