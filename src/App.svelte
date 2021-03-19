<script lang="ts">
  import RollStats from "./pages/RollStats.svelte";
  import type { RolledAbilities } from "./util/abilityModifiers";
  import type { PageName } from "./pages/pageNames";

  let rolledAbilities: RolledAbilities | null = null;
  let currentPage: PageName = "roll-abilities";

  $: abilitiesRolled =
    !!rolledAbilities && Object.entries(rolledAbilities).length === 6;
  $: console.log(abilitiesRolled);
</script>

<div class="flex flex-col align-center text-dark-gray h-screen">
  <div class="w-full flex-1 flex flex-col align-center">
    <div
      class={`position ${
        currentPage === "roll-abilities" ? "h-full" : "h-auto"
      } flex flex-col justify-center`}
    >
      <RollStats bind:rolledAbilities />
    </div>
    <div class="w-1/2 flex flex-row justify-end">
      <button
        class={`${
          abilitiesRolled && currentPage === "roll-abilities" ? "" : "invisible"
        } bg-mint hover:bg-black hover:text-white text-black font-bold py-2 px-4 rounded`}
        on:click={() => {
          currentPage = "select-class";
        }}>Continue</button
      >
    </div>
  </div>
</div>

<style global lang="postcss">
  /* only apply purgecss on utilities, per Tailwind docs
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;
  .position {
    transition: height 2s ease-in-out;
  }
</style>
