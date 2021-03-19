<script lang="ts">
  import { roll3D6 } from "../util/dice";
  import type { RolledAbilities } from "../util/abilityModifiers";
  import type { Ability } from "../characterClasses/types";
  import D6Trio from "../icons/d6/RollableTrio.svelte";

  export let rolledAbilities: RolledAbilities;

  rolledAbilities = {
    STR: 0,
    INT: 0,
    WIS: 0,
    DEX: 0,
    CON: 0,
    CHA: 0,
  };
  $: abilityValues = Object.values(rolledAbilities || {});
  const abilities = ["STR", "INT", "WIS", "DEX", "CON", "CHA"];

  const getAnimationDelayStyle = (idx: number) =>
    `animation-delay: ${25 * idx}ms;`;
</script>

<div class="position w-full flex flex-col justify-center items-center ">
  <div>
    <h2 style="font-family: ScalaSans-Regular;" class="pb-2 text-3xl font-bold">
      Click to Roll Abilities
    </h2>
  </div>
  <div
    class="select-none pt-8 pb-16 w-full flex flex-row justify-center"
    style="font-family: ScalaSans-Regular;"
  >
    <div class="w-1/2 flex flex-row justify-between text-2xl">
      {#each abilities as ability, idx}
        <div
          class="slide-up flex flex-col items-center"
          style={getAnimationDelayStyle(idx)}
        >
          <div class="pb-4">
            <D6Trio
              onChange={(sum) => {
                rolledAbilities = {
                  ...rolledAbilities,
                  [ability]: sum,
                };
              }}
            />
          </div>
          <div>{ability}</div>
          <div>
            {abilityValues[idx] === 0 ? "_" : abilityValues[idx]}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }
  .slide-up {
    animation: slideUp;
    animation-duration: 150ms;
    animation-timing-function: cubic-bezier();
  }
</style>
