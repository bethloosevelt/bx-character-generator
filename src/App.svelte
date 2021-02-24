<script lang="ts">
  import Roll from "roll";
  import { claim_component } from "svelte/internal";

  import * as characterClasses from "./characterClasses";
  import type { Alignment, Ability } from "./characterClasses/types";

  const roller = new Roll();
  const roll = (dice: string) => (): number => roller.roll(dice).result;
  const roll3D6 = roll("3d6");

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

  const buttonClasses =
    "focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-green-500 hover:bg-green-600 hover:shadow-lg";
  const selectClasses = "w-full border bg-white rounded px-3 py-2 outline-none";
</script>

<div class="text-center">
  <h1 class="text-5xl pt-8 pb-7" style="font-family: BungeeShade;">
    BX D&D Character Generator
  </h1>
  <div class="pt-8 pb-16 w-full flex flex-row justify-center">
    <div class="w-1/3 flex flex-row justify-between text-2xl">
      <div class="flex flex-col align-middle">
        <div>STR</div>
        <div>
          {rolledAbilities.STR}
        </div>
      </div>
      <div>
        <div>INT</div>
        <div>
          {rolledAbilities.INT}
        </div>
      </div>
      <div>
        <div>
          <div>WIS</div>
          <div>
            {rolledAbilities.WIS}
          </div>
        </div>
      </div>
      <div>
        <div>DEX</div>
        <div>
          {rolledAbilities.DEX}
        </div>
      </div>
      <div>
        <div>CON</div>
        <div>
          {rolledAbilities.CON}
        </div>
      </div>
      <div>
        <div>CHA</div>
        <div>{rolledAbilities.CHA}</div>
      </div>
    </div>
  </div>
  <h2 style="font-family: FuturaCondensed-Bold;" class="pb-2 text-2xl">
    Choose Available Class
  </h2>
  <div class="pr-16 pl-16 pb-8">
    <table class="table-auto">
      <thead>
        <tr>
          <th class="p-4">Class</th>
          <th class="p-4">Armor</th>
          <th class="p-4">Weapons</th>
          <th class="p-4">HD</th>
          <th class="p-4">Languages</th>
          <th class="p-4">Special Abilities</th>
        </tr>
      </thead>
      {#each availableCharacterClasses as cc, idx}
        <tr style={`${idx % 2 === 0 ? "background: #d4e8cf;" : ""}`}>
          <td class="p-4">{cc.name}</td>
          <td class="p-4">{cc.armor}</td>
          <td class="p-4">{cc.weapons}</td>
          <td class="p-4">{cc.hitDice}</td>
          <td class="p-4">{cc.languages.join(", ")}</td>
          <td class="p-4">{cc.specialAbilities.join(", ")}</td>
        </tr>
      {/each}
    </table>
  </div>

  <h2>Alignment</h2>
  <select
    bind:value={selectedAlignment}
    name="alignment"
    id="alignment"
    class={selectClasses}
  >
    <option class="py-1" value={null}>Select Alginment</option>
    <option class="py-1" value={"Chaotic"}>{"Chaotic"}</option>
    <option class="py-1" value={"Neutral"}>{"Neutral"}</option>
    <option class="py-1" value={"Lawful"}>{"Lawful"}</option>
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
        {#if abilityKey === "STR" || abilityKey === "INT" || abilityKey === "WIS" || (selectedCharacterClass?.primeRequisites || []).includes(abilityKey)}
          <span
            style={(selectedCharacterClass?.primeRequisites || []).includes(
              abilityKey
            )
              ? "background: blue; color: white"
              : ""}
            >{abilityKey}:
          </span><span>{adjustedAbilities[abilityKey]}</span>
        {/if}
        {#if abilityKey === "STR" || abilityKey === "INT" || abilityKey === "WIS"}
          <button
            class={buttonClasses}
            disabled={adjustedAbilities[abilityKey] <= 9}
            on:click={() => {
              adjustedAbilities[abilityKey] = adjustedAbilities[abilityKey] - 1;
              const rawAdjustmentAmount = (
                selectedCharacterClass?.primeRequisites || []
              ).includes(abilityKey)
                ? 2
                : 1;
              rawAdjustmentPointPoolCounter =
                rawAdjustmentPointPoolCounter + rawAdjustmentAmount;
            }}>-</button
          >
        {/if}
        {#if (selectedCharacterClass?.primeRequisites || []).includes(abilityKey)}
          <button
            class={buttonClasses}
            disabled={adjustmentPointPool < 1}
            on:click={() => {
              adjustedAbilities[abilityKey] = adjustedAbilities[abilityKey] + 1;
              rawAdjustmentPointPoolCounter = rawAdjustmentPointPoolCounter - 2;
            }}>+</button
          >
        {/if}
      </div>
    {/each}
  {/if}
</div>

<style global lang="postcss">
  /* only apply purgecss on utilities, per Tailwind docs */
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;
</style>
