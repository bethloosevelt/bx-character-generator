import type { CharacterClass } from "./types";

const elf: CharacterClass = {
  name: "Elf",
  primeRequisites: ["INT", "STR"],
  hitDice: "1d6",
  languages: ["Alignment", "Common", "Elvish", "Gnoll", "Hobgoblin", "Orcish"],
  abilityMinimums: [{ ability: "INT", minimum: 9 }],
  armor: "Any, including shields",
  weapons: "Any",
};

export default elf;
