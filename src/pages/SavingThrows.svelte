<script lang="ts">
  import type { ResolvedAbilityModifiers } from "./abilityModifiersUtil";
  import type { CharacterClass } from "./characterClasses/types";

  export let abilityModifiers: ResolvedAbilityModifiers;
  export let characterClass: CharacterClass;
</script>

<table class="table-auto">
  <tr class="bg-mint">
    <td class="font-bold">Death, poison (D)</td>
    <td>{characterClass.savingThrows.d}</td>
  </tr>
  <tr>
    <td class="font-bold">Magic wands (W)</td>
    <td>{characterClass.savingThrows.w}</td>
  </tr>
  <tr class="bg-mint">
    <td class="font-bold">Paralysis, petrification (P)</td>
    <td>{characterClass.savingThrows.p}</td>
  </tr>
  <tr>
    <td class="font-bold">Breath attacks (B)</td>
    <td>{characterClass.savingThrows.b}</td>
  </tr>
  <tr class="bg-mint">
    <td class="font-bold">Spells, magic rods, magic staves (S)</td>
    <td>{characterClass.savingThrows.s}</td>
  </tr>
  <tr>
    <td class="font-bold">+/-</td>
    <td
      >{characterClass.savingThrows.s +
        (abilityModifiers.WIS?.modifiers.magicSaves || 0)}</td
    >
  </tr>
</table>

<style>
</style>
