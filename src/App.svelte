<script lang="ts">
  import Roll from "roll";
  import { adjust, difference, reduce } from "ramda";

  import * as characterClasses from "./characterClasses";
  import type {
    Alignment,
    Ability,
    CharacterClass,
  } from "./characterClasses/types";
  import { calculatePrimeRequisiteModifierDisplay } from "./derivedStatisticUtil";

  const roller = new Roll();
  const roll = (dice: string) => (): number => roller.roll(dice).result;
  const roll3D6 = roll("3d6");

  let selectedCharacterClass: CharacterClass | null = null;
  let selectedAlignment: Alignment | null = null;

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

  const availableCharacterClasses = characterClasses.all.filter((cc) =>
    cc.abilityMinimums
      ? cc.abilityMinimums.reduce(
          (soFar: boolean, curr) =>
            soFar && rolledAbilities[curr.ability] >= curr.minimum,
          true
        )
      : true
  );

  const onSelectCharacterClass = (name: string) => () => {
    selectedCharacterClass =
      availableCharacterClasses.find((cc) => cc.name === name) || null;
  };

  const adjustableAbilities: Array<Ability> = ["STR", "INT", "WIS"];

  $: adjustedAbilities = { ...rolledAbilities };
  let adjustmentPointPool = 0;

  const decrementBaseAbility = (ability: Ability) => () => {
    if (adjustedAbilities[ability] > 10) {
      adjustedAbilities[ability] -= 2;
      adjustmentPointPool += 1;
    }
  };
  const incrementBaseAbility = (ability: Ability) => () => {
    if (
      adjustedAbilities[ability] < rolledAbilities[ability] - 1 &&
      adjustmentPointPool >= 1
    ) {
      adjustedAbilities[ability] += 2;
      adjustmentPointPool -= 1;
    }
  };
  const incrementPrimeAbility = (ability: Ability) => () => {
    if (adjustmentPointPool >= 1) {
      adjustedAbilities[ability] += 1;
      adjustmentPointPool -= 1;
    }
  };
  const decrementPrimeAbility = (ability: Ability) => () => {
    if (adjustedAbilities[ability] > rolledAbilities[ability]) {
      adjustedAbilities[ability] -= 1;
      adjustmentPointPool += 1;
    }
  };
</script>

<div class="text-center text-dark-gray">
  <h1 class="text-5xl pt-8 pb-7" style="font-family: BungeeShade;">
    BX D&D Character Generator
  </h1>
  <div
    class="pt-8 pb-16 w-full flex flex-row justify-center"
    style="font-family: ScalaSans-Regular;"
  >
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
  <h2 style="font-family: ScalaSans-Regular;" class="pb-2 text-2xl font-bold">
    {selectedCharacterClass !== null
      ? "Character Class"
      : "Choose Available Class"}
  </h2>
  <div class="pr-16 pl-16 pb-8 flex flex-row justify-center">
    <table class="w-full table-auto" style="font-family: ScalaSans-Regular">
      <thead>
        <tr>
          <th class="p-4">Class</th>
          <th class="p-4">Armor</th>
          <th class="p-4">Weapons</th>
          <th class="p-4">HD</th>
          <th class="p-4">Languages</th>
          <th class="p-4">Special Abilities</th>
          <th class="p-4">EXP modifier</th>
        </tr>
      </thead>
      {#each selectedCharacterClass === null ? availableCharacterClasses : [selectedCharacterClass] as cc, idx}
        <tr
          class={`${idx % 2 === 0 ? "bg-mint" : ""} ${
            selectedCharacterClass === null
              ? "cursor-pointer hover:bg-dark-gray text-dark-gray hover:text-white"
              : ""
          }`}
          on:click={onSelectCharacterClass(cc.name)}
        >
          <td class="p-4 font-bold" style="font-family: ScalaSans-Regular;"
            >{cc.name}</td
          >
          <td class="p-4" style="margin-top: 2px;">{cc.armor}</td>
          <td class="p-4">{cc.weapons}</td>
          <td class="p-4">{cc.hitDice}</td>
          <td class="p-4">{cc.languages.join(", ")}</td>
          <td class="p-4">{cc.specialAbilities.join(", ")}</td>
          <td class="p-4"
            >{calculatePrimeRequisiteModifierDisplay(
              cc.primeRequisiteModifier,
              rolledAbilities
            )}</td
          >
        </tr>
      {/each}
    </table>
  </div>

  {#if selectedCharacterClass !== null}
    <h2 style="font-family: ScalaSans-Regular;" class="pb-2 text-2xl font-bold">
      {selectedCharacterClass !== null && selectedAlignment === null
        ? "Choose Alignment"
        : "Alignment"}
    </h2>
    {#if selectedAlignment === null}
      <select bind:value={selectedAlignment} name="alignment" id="alignment">
        <option class="py-1" value={null}>Select Alignment</option>
        <option class="py-1" value={"Chaotic"}>{"Chaotic"}</option>
        <option class="py-1" value={"Neutral"}>{"Neutral"}</option>
        <option class="py-1" value={"Lawful"}>{"Lawful"}</option>
      </select>
    {:else}
      <div class="pb-6">
        {selectedAlignment}
      </div>
    {/if}
  {/if}
  {#if selectedCharacterClass !== null && selectedAlignment !== null}
    <h2 style="font-family: ScalaSans-Regular;" class="pb-2 text-2xl font-bold">
      Adjust Prime Requisite Abilities
    </h2>
    <div class="w-full flex justify-center">
      <div class="w-auto flex justify-between">
        <div class="flex p-4">
          {#each difference(adjustableAbilities, selectedCharacterClass.primeRequisites) as ba}
            <div class="p-2 flex flex-col align-middle">
              <div
                class="select-none text-center bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold"
                on:click={incrementBaseAbility(ba)}
              >
                ^
              </div>
              <div class="text-xl">{ba}</div>
              <div class="text-xl">{adjustedAbilities[ba]}</div>
              <div
                class="select-none text-center bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold"
                style="transform: rotate(180deg);"
                on:click={decrementBaseAbility(ba)}
              >
                ^
              </div>
            </div>
          {/each}
        </div>
        <div class="p-2 text-xl flex flex-col align-middle justify-center">
          <div>Ability Points</div>
          <div class="font-bold">{adjustmentPointPool}</div>
        </div>
        <div class="flex p-4">
          {#each selectedCharacterClass.primeRequisites as pr}
            <div class="p-2 flex flex-col align-middle">
              <div
                class="select-none text-center bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold"
                on:click={incrementPrimeAbility(pr)}
              >
                ^
              </div>
              <div class="text-xl">{pr}</div>
              <div class="text-xl">{adjustedAbilities[pr]}</div>
              <div
                class="select-none text-center bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold"
                style="transform: rotate(180deg);"
                on:click={decrementPrimeAbility(pr)}
              >
                ^
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
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
