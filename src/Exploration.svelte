<script lang="ts">
  import type { ResolvedAbilityModifiers } from "./abilityModifiersUtil";
  import type { CharacterClass } from "./characterClasses/types";

  export let abilityModifiers: ResolvedAbilityModifiers;
  export let characterClass: CharacterClass;
</script>

<table class="table-auto">
  <tr class="bg-mint">
    <td class="font-bold">Listen at door (LD)</td>
    <td>{characterClass.exploration?.ld || "1-in-6"}</td>
  </tr>
  <tr>
    <td class="font-bold">Open stuck door (OD)</td>
    <td>{abilityModifiers.STR?.modifiers.openDoors}</td>
  </tr>
  <tr class="bg-mint">
    <td class="font-bold">Find secret door (SD)</td>
    <td>{characterClass.exploration?.sd || "1-in-6"}</td>
  </tr>
  <tr>
    <td class="font-bold">Find room trap (FT)</td>
    <td>{characterClass.exploration?.ft || "1-in-6"}</td>
  </tr>
</table>

<style>
</style>
