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

type AbilityModifiers = StrengthModifiers | IntelligenceModifiers;

interface ModifierTableRow<M extends AbilityModifiers> {
  lowerBound: number;
  upperBound: number;
  modifiers: M;
}

type ModifierTable<M extends AbilityModifiers> = ReadonlyArray<
  ModifierTableRow<M>
>;

const STR_MODIFIER_TABLE: ModifierTable<StrengthModifiers> = [
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
