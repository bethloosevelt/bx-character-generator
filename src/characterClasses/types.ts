type STR = "STR";
type INT = "INT";
type WIS = "WIS";
type DEX = "DEX";
type CON = "CON";
type CHA = "CHA";

export type Ability = STR | INT | WIS | DEX | CON | CHA;

export type HitDice = "1d4" | "1d6" | "1d8";

export interface CharacterClass {
  name: string;
  primeRequisites: Array<Ability>;
  hitDice: HitDice;
  languages: Array<string>;
  abilityMinimums?: Array<{ ability: Ability; minimum: number }>;
  weapons: string;
  armor: string;
}
