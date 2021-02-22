import type { CharacterClass } from "./types";

const fighter: CharacterClass = {
  name: "Fighter",
  primeRequisites: ["STR"],
  hitDice: "1d8",
  languages: ["Alignment", "Common"],
  armor: "Any, including shields",
  weapons: "Any",
};

export default fighter;
