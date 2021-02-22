<script lang="ts">
  import Roll from "roll";

  import * as characterClasses from "./characterClasses";

  const roller = new Roll();
  const roll = (dice: string) => (): number => roller.roll(dice).result;
  const roll3D6 = roll("3d6");
  const rollD20 = roll("1d20");

  const rolledAbilities = {
    STR: roll3D6(),
    INT: roll3D6(),
    WIS: roll3D6(),
    DEX: roll3D6(),
    CON: roll3D6(),
    CHA: roll3D6(),
  };
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
  $: selectedCharacterClass = selectedCharacterClassName
    ? availableCharacterClasses.find(
        (cc) => cc.name === selectedCharacterClassName
      )
    : null;
</script>

<div>
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
  <div>
    available classes based on abilities: {availableCharacterClasses
      .map((cc) => cc.name)
      .join(", ")}
  </div>
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
  {/if}
</div>
