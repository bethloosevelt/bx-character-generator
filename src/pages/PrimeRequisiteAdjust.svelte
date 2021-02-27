<script lang="ts">
  import ChevronUp24 from "carbon-icons-svelte/lib/ChevronUp24";
  import ChevronDown24 from "carbon-icons-svelte/lib/ChevronDown24";
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
  $: abilityModifiers = {
    STR: getSTRModifier(adjustedAbilities["STR"]),
    INT: getINTModifier(adjustedAbilities["INT"]),
    WIS: getWISModifier(adjustedAbilities["WIS"]),
    DEX: getDEXModifier(adjustedAbilities["DEX"]),
    CON: getCONModifier(adjustedAbilities["CON"]),
    CHA: getCHAModifier(adjustedAbilities["CHA"]),
  };
</script>

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
      <div class="w-48 justify-end flex p-4">
        {#each difference(adjustableAbilities, selectedCharacterClass.primeRequisites) as ba}
          <div class="p-2 flex flex-col align-middle">
            <div
              class="w-10 h-10 select-none flex justify-center align-middle bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold"
              on:click={incrementBaseAbility(ba)}
            >
              <ChevronUp24 />
            </div>
            <div class="text-xl">{ba}</div>
            <div class="text-xl">{adjustedAbilities[ba]}</div>
            <div
              class="w-10 h-10 select-none flex justify-center align-middle bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold"
              style="transform: rotate(180deg);"
              on:click={decrementBaseAbility(ba)}
            >
              <ChevronDown24 />
            </div>
          </div>
        {/each}
      </div>
      <div class="p-2 text-xl flex flex-col align-middle justify-center">
        <div>Ability Points</div>
        <div class="font-bold">{adjustmentPointPool}</div>
      </div>
      <div class="w-48 flex justify-start p-4">
        {#each selectedCharacterClass.primeRequisites as pr}
          <div class="p-2 flex flex-col align-middle">
            <div
              class="w-10 h-10 select-none flex justify-center align-middle bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold"
              on:click={incrementPrimeAbility(pr)}
            >
              <ChevronUp24 />
            </div>
            <div class="text-xl">{pr}</div>
            <div class="text-xl">{adjustedAbilities[pr]}</div>
            <div
              class="w-10 h-10 select-none flex justify-center align-middle bg-mint hover:bg-dark-gray hover:text-white rounded cursor-pointer text-2xl font-bold"
              style="transform: rotate(180deg);"
              on:click={decrementPrimeAbility(pr)}
            >
              <ChevronDown24 />
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div />
  <div class="w-full flex flex-row justify-center">
    <div class="p-8">
      <div>Combat</div>
      <Combat {abilityModifiers} />
    </div>
    <div class="p-8">
      <div>Saving Throws</div>
      <SavingThrows
        {abilityModifiers}
        characterClass={selectedCharacterClass}
      />
    </div>
  </div>
  <div class="w-full flex flex-row justify-center">
    <div class="p-8">
      <div>Encounters</div>
      <Encounters {abilityModifiers} />
    </div>
    <div class="p-8">
      <div>Exploration</div>
      <Exploration {abilityModifiers} characterClass={selectedCharacterClass} />
    </div>
  </div>
{/if}
