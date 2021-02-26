<script lang="ts">
  import type { ResolvedAbilityModifiers } from "./abilityModifiersUtil";
  export let abilityModifiers: ResolvedAbilityModifiers;
</script>

<table class="table-auto">
  <tr class="bg-mint">
    <td class="font-bold">Initiative (Init)</td><td /><td
      >{abilityModifiers.DEX?.modifiers.initiative}</td
    >
  </tr>
  <tr>
    <td class="font-bold">CHA modifier to reaction rolls (+/-)</td>
    <td>{abilityModifiers.CHA?.modifiers.npcReactions}</td>
  </tr>
</table>

<style>
</style>
