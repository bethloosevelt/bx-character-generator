import Roll from "roll";

const roller = new Roll();
export const roll = (dice: string) => (): number => roller.roll(dice).result;
export const roll3D6 = roll("3d6");
