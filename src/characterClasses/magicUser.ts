import type { CharacterClass } from "./types";

const magicUser: CharacterClass = {
  name: "Magic User",
  primeRequisites: ["INT"],
  hitDice: "1d4",
  languages: ["Alignment", "Common"],
  armor: "None",
  weapons: "Dagger",
};

export default magicUser;
