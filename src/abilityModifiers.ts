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
  hp: -0.2 | -0.1 | 0 | 0.05 | 0.1;
}

type AbilityModifiers =
  | StrengthModifiers
  | IntelligenceModifiers
  | DexterityModifiers
  | CharismaModifiers
  | WisdomModifiers
  | ConstitutionModifiers
  | PrimeRequisiteModifiers;

interface ModifierTableRow<M extends AbilityModifiers> {
  lowerBound: number;
  upperBound: number;
  modifiers: M;
}

type ModifierTable<M extends AbilityModifiers> = ReadonlyArray<
  ModifierTableRow<M>
>;

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
