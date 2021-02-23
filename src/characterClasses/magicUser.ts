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
};

export default magicUser;
