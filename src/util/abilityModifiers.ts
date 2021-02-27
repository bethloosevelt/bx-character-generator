import type { Ability } from "./characterClasses/types";

export interface StrengthModifiers {
  melee: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  openDoors: "1-in-6" | "2-in-6" | "3-in-6" | "4-in-6" | "5-in-6";
}

export interface IntelligenceModifiers {
  spokenLanguages:
    | "Native (broken speech)"
    | "Native"
    | "Native +1 additional"
    | "Native +2 additional"
    | "Native +3 additional";
  literacy: "Illiterate" | "Basic" | "Literate";
}

export interface DexterityModifiers {
  armorClass: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  missile: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  initiative: -2 | -1 | 0 | 1 | 2;
}

export interface CharismaModifiers {
  npcReactions: -2 | -1 | 0 | 1 | 2;
  maxRetainers: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  loyalty: 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export interface WisdomModifiers {
  magicSaves: -3 | -2 | -1 | 0 | 1 | 2 | 3;
}

export interface ConstitutionModifiers {
  hp: -3 | -2 | -1 | 0 | 1 | 2 | 3;
}

export interface PrimeRequisiteModifiers {
  xp: -0.2 | -0.1 | 0 | 0.05 | 0.1;
}

export type AbilityModifiers =
  | StrengthModifiers
  | IntelligenceModifiers
  | DexterityModifiers
  | CharismaModifiers
  | WisdomModifiers
  | ConstitutionModifiers
  | PrimeRequisiteModifiers;

export interface ModifierTableRow<M extends AbilityModifiers> {
  lowerBound: number;
  upperBound: number;
  modifiers: M;
}

type ModifierTable<M extends AbilityModifiers> = ReadonlyArray<
  ModifierTableRow<M>
>;

export const EXP_MODIFIER_TABLE: ModifierTable<PrimeRequisiteModifiers> = [
  {
    lowerBound: 3,
    upperBound: 5,
    modifiers: {
      xp: -0.2,
    },
  },
  {
    lowerBound: 6,
    upperBound: 8,
    modifiers: {
      xp: -0.1,
    },
  },
  {
    lowerBound: 9,
    upperBound: 12,
    modifiers: {
      xp: 0,
    },
  },
  {
    lowerBound: 13,
    upperBound: 15,
    modifiers: {
      xp: 0.05,
    },
  },
  {
    lowerBound: 16,
    upperBound: 18,
    modifiers: {
      xp: 0.1,
    },
  },
];

export const CON_MODIFIER_TABLE: ModifierTable<ConstitutionModifiers> = [
  {
    lowerBound: 3,
    upperBound: 3,
    modifiers: {
      hp: -3,
    },
  },
  {
    lowerBound: 4,
    upperBound: 5,
    modifiers: {
      hp: -2,
    },
  },
  {
    lowerBound: 6,
    upperBound: 8,
    modifiers: {
      hp: -1,
    },
  },
  {
    lowerBound: 9,
    upperBound: 12,
    modifiers: {
      hp: 0,
    },
  },
  {
    lowerBound: 13,
    upperBound: 15,
    modifiers: {
      hp: 1,
    },
  },
  {
    lowerBound: 16,
    upperBound: 17,
    modifiers: {
      hp: 2,
    },
  },
  {
    lowerBound: 18,
    upperBound: 18,
    modifiers: {
      hp: 3,
    },
  },
];

export const WIS_MODIFIER_TABLE: ModifierTable<WisdomModifiers> = [
  {
    lowerBound: 3,
    upperBound: 3,
    modifiers: {
      magicSaves: -3,
    },
  },
  {
    lowerBound: 4,
    upperBound: 5,
    modifiers: {
      magicSaves: -2,
    },
  },
  {
    lowerBound: 6,
    upperBound: 8,
    modifiers: {
      magicSaves: -1,
    },
  },
  {
    lowerBound: 9,
    upperBound: 12,
    modifiers: {
      magicSaves: 0,
    },
  },
  {
    lowerBound: 13,
    upperBound: 15,
    modifiers: {
      magicSaves: 1,
    },
  },
  {
    lowerBound: 16,
    upperBound: 17,
    modifiers: {
      magicSaves: 2,
    },
  },
  {
    lowerBound: 18,
    upperBound: 18,
    modifiers: {
      magicSaves: 3,
    },
  },
];

export const CHA_MODIFIER_TABLE: ModifierTable<CharismaModifiers> = [
  {
    lowerBound: 3,
    upperBound: 3,
    modifiers: {
      npcReactions: -2,
      maxRetainers: 1,
      loyalty: 4,
    },
  },
  {
    lowerBound: 4,
    upperBound: 5,
    modifiers: {
      npcReactions: -1,
      maxRetainers: 2,
      loyalty: 5,
    },
  },
  {
    lowerBound: 6,
    upperBound: 8,
    modifiers: {
      npcReactions: -1,
      maxRetainers: 3,
      loyalty: 6,
    },
  },
  {
    lowerBound: 9,
    upperBound: 12,
    modifiers: {
      npcReactions: 0,
      maxRetainers: 3,
      loyalty: 7,
    },
  },
  {
    lowerBound: 13,
    upperBound: 15,
    modifiers: {
      npcReactions: 1,
      maxRetainers: 5,
      loyalty: 8,
    },
  },
  {
    lowerBound: 16,
    upperBound: 17,
    modifiers: {
      npcReactions: 1,
      maxRetainers: 6,
      loyalty: 9,
    },
  },
  {
    lowerBound: 18,
    upperBound: 18,
    modifiers: {
      npcReactions: 2,
      maxRetainers: 7,
      loyalty: 10,
    },
  },
];

export const DEX_MODIFIER_TABLE: ModifierTable<DexterityModifiers> = [
  {
    lowerBound: 3,
    upperBound: 3,
    modifiers: {
      armorClass: -3,
      missile: -3,
      initiative: -2,
    },
  },
  {
    lowerBound: 4,
    upperBound: 5,
    modifiers: {
      armorClass: -2,
      missile: -2,
      initiative: -1,
    },
  },
  {
    lowerBound: 6,
    upperBound: 8,
    modifiers: {
      armorClass: -1,
      missile: -1,
      initiative: -1,
    },
  },
  {
    lowerBound: 9,
    upperBound: 12,
    modifiers: {
      armorClass: 0,
      missile: 0,
      initiative: 0,
    },
  },
  {
    lowerBound: 13,
    upperBound: 15,
    modifiers: {
      armorClass: 1,
      missile: 1,
      initiative: 1,
    },
  },
  {
    lowerBound: 16,
    upperBound: 17,
    modifiers: {
      armorClass: 2,
      missile: 2,
      initiative: 1,
    },
  },
  {
    lowerBound: 18,
    upperBound: 18,
    modifiers: {
      armorClass: 3,
      missile: 3,
      initiative: 2,
    },
  },
];

export const INT_MODIFIER_TABLE: ModifierTable<IntelligenceModifiers> = [
  {
    lowerBound: 3,
    upperBound: 3,
    modifiers: {
      spokenLanguages: "Native (broken speech)",
      literacy: "Illiterate",
    },
  },
  {
    lowerBound: 4,
    upperBound: 5,
    modifiers: {
      spokenLanguages: "Native",
      literacy: "Illiterate",
    },
  },
  {
    lowerBound: 6,
    upperBound: 8,
    modifiers: {
      spokenLanguages: "Native",
      literacy: "Basic",
    },
  },
  {
    lowerBound: 9,
    upperBound: 12,
    modifiers: {
      spokenLanguages: "Native",
      literacy: "Literate",
    },
  },
  {
    lowerBound: 13,
    upperBound: 15,
    modifiers: {
      spokenLanguages: "Native +1 additional",
      literacy: "Literate",
    },
  },
  {
    lowerBound: 16,
    upperBound: 17,
    modifiers: {
      spokenLanguages: "Native +2 additional",
      literacy: "Literate",
    },
  },
  {
    lowerBound: 18,
    upperBound: 18,
    modifiers: {
      spokenLanguages: "Native +3 additional",
      literacy: "Literate",
    },
  },
];

export const STR_MODIFIER_TABLE: ModifierTable<StrengthModifiers> = [
  {
    lowerBound: 3,
    upperBound: 3,
    modifiers: {
      melee: -3,
      openDoors: "1-in-6",
    },
  },
  {
    lowerBound: 4,
    upperBound: 5,
    modifiers: {
      melee: -2,
      openDoors: "1-in-6",
    },
  },
  {
    lowerBound: 6,
    upperBound: 8,
    modifiers: {
      melee: -1,
      openDoors: "1-in-6",
    },
  },
  {
    lowerBound: 9,
    upperBound: 12,
    modifiers: {
      melee: 0,
      openDoors: "2-in-6",
    },
  },
  {
    lowerBound: 13,
    upperBound: 15,
    modifiers: {
      melee: 1,
      openDoors: "3-in-6",
    },
  },
  {
    lowerBound: 16,
    upperBound: 17,
    modifiers: {
      melee: 2,
      openDoors: "4-in-6",
    },
  },
  {
    lowerBound: 18,
    upperBound: 18,
    modifiers: {
      melee: 3,
      openDoors: "5-in-6",
    },
  },
];

const getModifier = <T extends AbilityModifiers>(table: ModifierTable<T>) => (
  abilityScore: number
): ModifierTableRow<T> | undefined =>
  table.find(
    (row) => row.lowerBound <= abilityScore && row.upperBound >= abilityScore
  );

export const getSTRModifier = getModifier(STR_MODIFIER_TABLE);
export const getINTModifier = getModifier(INT_MODIFIER_TABLE);
export const getDEXModifier = getModifier(DEX_MODIFIER_TABLE);
export const getCHAModifier = getModifier(CHA_MODIFIER_TABLE);
export const getWISModifier = getModifier(WIS_MODIFIER_TABLE);
export const getCONModifier = getModifier(CON_MODIFIER_TABLE);

export type RolledAbilities = { [key in Ability]: number };
export interface ResolvedAbilityModifiers {
  STR: ModifierTableRow<StrengthModifiers> | undefined;
  INT: ModifierTableRow<IntelligenceModifiers> | undefined;
  WIS: ModifierTableRow<WisdomModifiers> | undefined;
  DEX: ModifierTableRow<DexterityModifiers> | undefined;
  CON: ModifierTableRow<ConstitutionModifiers> | undefined;
  CHA: ModifierTableRow<CharismaModifiers> | undefined;
}
