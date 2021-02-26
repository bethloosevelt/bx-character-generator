<script lang="ts">
  import type { ResolvedAbilityModifiers } from "./abilityModifiersUtil";
  export let abilityModifiers: ResolvedAbilityModifiers;
</script>

<table class="table-auto">
  <tr class="bg-mint">
    <td class="font-bold">HP CON modifier (+/-)</td>
    <td>{abilityModifiers.CON?.modifiers.hp}</td>
  </tr>
  <tr>
    <td class="font-bold">Unarmored AC (UN)</td>
    <td>{10 + (abilityModifiers.DEX?.modifiers.armorClass || 0)}</td>
  </tr>
  <tr class="bg-mint">
    <td class="font-bold">AC DEX modifier (+/-)</td>
    <td>{abilityModifiers.DEX?.modifiers.armorClass || 0}</td>
  </tr>
  <tr>
    <td class="font-bold">Melee STR modifier (Mel)</td>
    <td>{abilityModifiers.STR?.modifiers.melee}</td>
  </tr>
  <tr class="bg-mint">
    <td class="font-bold">Missile DEX modifier (Mis)</td>
    <td>{abilityModifiers.DEX?.modifiers.missile}</td>
  </tr>
</table>

<style>
</style>
