import type { CharacterClass } from "./types";
import { defaultPrimeRequisiteModifierTableForAbility } from "./types";

const fighter: CharacterClass = {
  name: "Fighter",
  primeRequisites: ["STR"],
  primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("STR"),
  hitDice: "1d8",
  languages: ["Alignment", "Common"],
  armor: "Any, including shields",
  weapons: "Any",
  specialAbilities: ["Stronghold", "Become Baron/Baroness (level 9+)"],
  savingThrows: {
    d: 12,
    w: 13,
    p: 14,
    b: 15,
    s: 16,
  },
  expToNextLevel: 2000,
};

export default fighter;
