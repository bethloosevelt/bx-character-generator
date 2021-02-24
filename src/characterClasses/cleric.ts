import type { CharacterClass } from "./types";
import { defaultPrimeRequisiteModifierTableForAbility } from "./types";

const cleric: CharacterClass = {
  name: "Cleric",
  primeRequisites: ["WIS"],
  primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("WIS"),
  hitDice: "1d6",
  languages: ["Alignment", "Common"],
  weapons: "Any blunt weapons",
  armor: "Any, including shields",
  specialAbilities: [
    "Divine Magic",
    "Turning the Undead",
    "Spell Casting (level 2+)",
  ],
};

export default cleric;
