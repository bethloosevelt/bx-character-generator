type STR = "STR";
type INT = "INT";
type WIS = "WIS";
type DEX = "DEX";
type CON = "CON";
type CHA = "CHA";

export type Ability = STR | INT | WIS | DEX | CON | CHA;

export type AbilityBlock = { [key in Ability]: number };

export type HitDice = "1d4" | "1d6" | "1d8";

export type Alignment = "Chaotic" | "Neutral" | "Lawful";

export type PrimeRequisiteModifier = -0.2 | -0.1 | 0 | 0.05 | 0.1;

export type Condition =
  | { type: "IN_RANGE"; ability: Ability; min: number; max: number }
  | { type: "AND"; first: Condition; second: Condition }
  | { type: "OR"; first: Condition; second: Condition };

export type ConditionResult = {
  condition: Condition;
  result: PrimeRequisiteModifier;
};

export type PrimeRequisiteModifierCalculation = Array<ConditionResult>;

export const defaultPrimeRequisiteModifierTableForAbility = (
  ability: Ability
): PrimeRequisiteModifierCalculation => [
  { condition: { type: "IN_RANGE", ability, min: 3, max: 5 }, result: -0.2 },
  { condition: { type: "IN_RANGE", ability, min: 6, max: 8 }, result: -0.1 },
  { condition: { type: "IN_RANGE", ability, min: 13, max: 15 }, result: 0.05 },
  { condition: { type: "IN_RANGE", ability, min: 16, max: 18 }, result: 0.1 },
];

export interface CharacterClass {
  name: string;
  primeRequisites: Array<Ability>;
  primeRequisiteModifier: PrimeRequisiteModifierCalculation;
  hitDice: HitDice;
  languages: Array<string>;
  abilityMinimums?: Array<{ ability: Ability; minimum: number }>;
  weapons: string;
  armor: string;
  specialAbilities: Array<string>;
  savingThrows: {
    d: number;
    w: number;
    p: number;
    b: number;
    s: number;
  };
  exploration?: {
    ld?: string;
    sd: string;
    ft?: string;
  };
  expToNextLevel: number;
}
