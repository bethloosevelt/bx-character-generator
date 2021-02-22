<script lang="ts">
  import Roll from "roll";

  import * as characterClasses from "./characterClasses";
  import type { Alignment, Ability } from "./characterClasses/types";

  const roller = new Roll();
  const roll = (dice: string) => (): number => roller.roll(dice).result;
  const roll3D6 = roll("3d6");
  const rollD20 = roll("1d20");

  let abilitiesList: Array<Ability> = [
    "STR",
    "INT",
    "WIS",
    "DEX",
    "CON",
    "CHA",
  ];
  type RolledAbilities = { [key in Ability]: number };
  const rolledAbilities: RolledAbilities = {
    STR: roll3D6(),
    INT: roll3D6(),
    WIS: roll3D6(),
    DEX: roll3D6(),
    CON: roll3D6(),
    CHA: roll3D6(),
  };
  let adjustedAbilities = { ...rolledAbilities };
  let rawAdjustmentPointPoolCounter = 0;
  $: adjustmentPointPool = Math.floor(rawAdjustmentPointPoolCounter / 2);

  interface RolledHitDice {
    "1d4": number;
    "1d6": number;
    "1d8": number;
  }
  const d4 = roll("1d4")();
  const firstD2 = roll("1d2")();
  const secondD2 = roll("1d2")();
  const rolledHitDice: RolledHitDice = {
    "1d4": d4,
    "1d6": d4 + firstD2,
    "1d8": d4 + firstD2 + secondD2,
  };

  const availableCharacterClasses = characterClasses.all.filter((cc) =>
    cc.abilityMinimums
      ? cc.abilityMinimums.reduce(
          (soFar: boolean, curr) =>
            soFar && rolledAbilities[curr.ability] >= curr.minimum,
          true
        )
      : true
  );

  let selectedCharacterClassName: string | null = null;
  let selectedAlignment: Alignment | null = null;
  $: selectedCharacterClass = selectedCharacterClassName
    ? availableCharacterClasses.find(
        (cc) => cc.name === selectedCharacterClassName
      )
    : null;
</script>

<div>
  <h3>Rolled Base Ability Stats</h3>
  <div>
    STR | {rolledAbilities.STR}
  </div>
  <div>
    INT | {rolledAbilities.INT}
  </div>
  <div>
    WIS | {rolledAbilities.WIS}
  </div>
  <div>
    DEX | {rolledAbilities.DEX}
  </div>
  <div>
    CON | {rolledAbilities.CON}
  </div>
  <div>
    CHA | {rolledAbilities.CHA}
  </div>
  <h3>Available Classes Based on Rolled Ability Stats</h3>
  <div>
    available classes based on abilities: {availableCharacterClasses
      .map((cc) => cc.name)
      .join(", ")}
  </div>
  <h3>Class and Alignment</h3>
  <select
    bind:value={selectedCharacterClassName}
    name="characterClass"
    id="character-class"
  >
    <option value={null}>Select Available Class</option>
    {#each availableCharacterClasses as cc}
      <option value={cc.name}>{cc.name}</option>
    {/each}
  </select>

  {#if selectedCharacterClass !== null && selectedCharacterClassName !== undefined}
    <h3>Selected Class Info</h3>
    <div>{selectedCharacterClass?.name}</div>
    <div>HD: {selectedCharacterClass?.hitDice}</div>
    <div>
      HP: {selectedCharacterClass
        ? rolledHitDice[selectedCharacterClass.hitDice]
        : 0}
    </div>
    <div>Available Armor: {selectedCharacterClass?.armor}</div>
    <div>Available Weapons: {selectedCharacterClass?.weapons}</div>
    <div>Languages Spoken: {selectedCharacterClass?.languages}</div>
    <h3>Class Abilities</h3>
    <div>
      Special Abilities: {selectedCharacterClass?.specialAbilities?.join(", ")}
    </div>

    <h3>Alignment</h3>
    <select bind:value={selectedAlignment} name="alignment" id="alignment">
      <option value={null}>Select Alginment</option>
      <option value={"Chaotic"}>{"Chaotic"}</option>
      <option value={"Neutral"}>{"Neutral"}</option>
      <option value={"Lawful"}>{"Lawful"}</option>
    </select>

    {#if selectedAlignment !== null && selectedCharacterClass !== null}
      <div>Alignment: {selectedAlignment}</div>
      <h3>Ability Class Adjustments</h3>
      <div>adjustment point pool: {adjustmentPointPool}</div>
      <button
        on:click={() => {
          rawAdjustmentPointPoolCounter = 0;
          adjustmentPointPool = 0;
          adjustedAbilities = { ...rolledAbilities };
        }}>reset</button
      >
      {#each abilitiesList as abilityKey}
        <div>
          <span>{abilityKey}: </span><span>{adjustedAbilities[abilityKey]}</span
          >
          {#if abilityKey === "STR" || abilityKey === "INT" || abilityKey === "WIS"}
            <button
              disabled={adjustedAbilities[abilityKey] <= 9}
              on:click={() => {
                adjustedAbilities[abilityKey] =
                  adjustedAbilities[abilityKey] - 1;
                rawAdjustmentPointPoolCounter =
                  rawAdjustmentPointPoolCounter + 1;
              }}>-</button
            >
          {/if}
          {#if adjustmentPointPool > 0 && (selectedCharacterClass?.primeRequisites || []).includes(abilityKey)}
            <button
              on:click={() => {
                adjustedAbilities[abilityKey] =
                  adjustedAbilities[abilityKey] + 1;
                rawAdjustmentPointPoolCounter =
                  rawAdjustmentPointPoolCounter - 2;
              }}>+</button
            >
          {/if}
        </div>
      {/each}
    {/if}
  {/if}
</div>
