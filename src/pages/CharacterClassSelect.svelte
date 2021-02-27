<script lang="ts">
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
</script>

<div>
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
</div>
