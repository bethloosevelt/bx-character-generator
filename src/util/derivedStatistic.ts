import { find } from "ramda";

import type {
  PrimeRequisiteModifier,
  PrimeRequisiteModifierCalculation,
  AbilityBlock,
  Condition,
  ConditionResult,
} from "./characterClasses/types";

export const calculatePrimeRequisiteModifierDisplay = (
  calculation: PrimeRequisiteModifierCalculation,
  abilityBlock: AbilityBlock
): string =>
  displayPrimeRequisite(
    calculatePrimeRequisiteModifier(calculation, abilityBlock)
  );

export const displayPrimeRequisite = (
  modifier: PrimeRequisiteModifier
): string => {
  switch (modifier) {
    case -0.2:
      return "-20%";
    case -0.1:
      return "-10%";
    case 0:
      return "None";
    case 0.05:
      return "+5%";
    case 0.1:
      return "+10%";
  }
};

export const calculatePrimeRequisiteModifier = (
  calculation: PrimeRequisiteModifierCalculation,
  abilityBlock: AbilityBlock
): PrimeRequisiteModifier => {
  const firstMatchingCondition:
    | ConditionResult
    | undefined = find((x: ConditionResult) =>
    evaluateCondition(abilityBlock, x.condition)
  )(calculation);
  if (firstMatchingCondition) {
    return firstMatchingCondition.result;
  }
  return 0;
};

const evaluateCondition = (
  abilityBlock: AbilityBlock,
  condition: Condition
): boolean => {
  switch (condition.type) {
    case "IN_RANGE":
      const ability = abilityBlock[condition.ability];
      return ability >= condition.min && ability <= condition.max;
    case "AND":
      return (
        evaluateCondition(abilityBlock, condition.first) &&
        evaluateCondition(abilityBlock, condition.second)
      );
    case "OR":
      return (
        evaluateCondition(abilityBlock, condition.first) ||
        evaluateCondition(abilityBlock, condition.second)
      );
  }
};
