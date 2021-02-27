<script lang="ts">
  import RollStats from "./pages/RollStats.svelte";
  import type { RolledAbilities } from "./util/abilityModifiers";
  let rolledAbilities: RolledAbilities | null = null;

  $: abilitiesRolled =
    !!rolledAbilities && Object.entries(rolledAbilities).length === 6;
  $: console.log(abilitiesRolled);
</script>

<div class="flex flex-col justify-center items-center text-dark-gray h-screen">
  <div class="w-full flex-1 flex flex-col justify-center items-center ">
    <RollStats bind:rolledAbilities />
  </div>
  {#if abilitiesRolled}
    <button>Continue</button>
  {/if}
</div>

<style global lang="postcss">
  /* only apply purgecss on utilities, per Tailwind docs
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;
</style>
