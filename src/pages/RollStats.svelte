<script lang="ts">
  import { roll3D6 } from "../util/dice";
  import D20 from "../icons/D20.svelte";
  import type { RolledAbilities } from "../util/abilityModifiers";
  import type { Ability } from "../characterClasses/types";
  import D6One from "../icons/d6/One.svelte";
  import D6Two from "../icons/d6/Two.svelte";
  import D6Three from "../icons/d6/Three.svelte";
  import D6Four from "../icons/d6/Four.svelte";
  import D6Five from "../icons/d6/Five.svelte";
  import D6Six from "../icons/d6/Six.svelte";

  export let rolledAbilities: RolledAbilities | null;

  let diceRollingInProgress: { [k in Ability]: boolean } = {
    STR: false,
    INT: false,
    WIS: false,
    DEX: false,
    CON: false,
    CHA: false,
  };
  const rollDie = (ability: Ability) => () => {
    if (diceRollingInProgress[ability]) {
      rolledAbilities = {
        ...rolledAbilities,
        [ability]: roll3D6(),
      };
      diceRollingInProgress = {
        ...diceRollingInProgress,
        [ability]: false,
      };
    } else {
      diceRollingInProgress = {
        ...diceRollingInProgress,
        [ability]: true,
      };
    }
  };

  const abilities: Array<Ability> = ["STR", "INT", "WIS", "DEX", "CON", "CHA"];
  const getAnimationDelayStyle = (idx: number) =>
    `animation-delay: ${25 * idx}ms;`;
</script>

<div class="position w-full flex flex-col justify-center items-center ">
  <D6One />
  <D6Two />
  <D6Three />
  <D6Four />
  <D6Five />
  <D6Six />
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
          <div
            class={`${
              diceRollingInProgress[ability] ? "rolling" : ""
            } flex justify-center items-center h-14 w-16 cursor-pointer`}
            on:click={rollDie(ability)}
          >
            <D20 />
          </div>
          <div>{ability}</div>
          <div>
            {rolledAbilities?.[ability] || "_"}
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
  @keyframes roll {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .slide-up {
    animation: slideUp;
    animation-duration: 150ms;
    animation-timing-function: cubic-bezier();
  }
  .rolling {
    animation: roll 500ms infinite;
    animation-timing-function: linear;
  }
</style>
