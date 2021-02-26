import type { CharacterClass } from "./types";
import { defaultPrimeRequisiteModifierTableForAbility } from "./types";

const magicUser: CharacterClass = {
  name: "Magic User",
  primeRequisites: ["INT"],
  primeRequisiteModifier: defaultPrimeRequisiteModifierTableForAbility("INT"),
  hitDice: "1d4",
  languages: ["Alignment", "Common"],
  armor: "None",
  weapons: "Dagger",
  specialAbilities: ["Arcane Magic", "Establish Stronghold (level 11+)"],
  savingThrows: {
    d: 13,
    w: 14,
    p: 13,
    b: 16,
    s: 15,
  },
  expToNextLevel: 2500,
};

export default magicUser;
