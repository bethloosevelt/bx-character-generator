<script lang="ts">
  import One from "./One.svelte";
  import Two from "./Two.svelte";
  import Three from "./Three.svelte";
  import Four from "./Four.svelte";
  import Five from "./Five.svelte";
  import Six from "./Six.svelte";
  import { roll1D6 } from "../../util/dice";

  export let onChange: (sum: number) => void;

  const rollDice = () => [roll1D6(), roll1D6(), roll1D6()];

  let shownDice: Array<number> = rollDice();
  let rolling: boolean = false;
  let rollInterval: number | undefined;

  const updateDice = () => {
    shownDice = rollDice();
  };
  const onClick = () => {
    if (!rolling) {
      rolling = true;
      updateDice();
      rollInterval = setInterval(updateDice, 75);
    } else {
      updateDice();
      clearInterval(rollInterval);
      rolling = false;
      onChange(shownDice.reduce((soFar, curr) => soFar + curr, 0));
    }
  };
</script>

<div id="container" class="relative flex flex-col justify-between slide-up-1">
  <div class={`${rolling ? "rolling-1" : ""} p-1`}>
    <div>
      {#if shownDice[0] === 1}
        <One />
      {/if}
      {#if shownDice[0] === 2}
        <Two />
      {/if}
      {#if shownDice[0] === 3}
        <Three />
      {/if}
      {#if shownDice[0] === 4}
        <Four />
      {/if}
      {#if shownDice[0] === 5}
        <Five />
      {/if}
      {#if shownDice[0] === 6}
        <Six />
      {/if}
    </div>
  </div>
  <div class={`${rolling ? "rolling-2" : ""} p-1`}>
    <div>
      {#if shownDice[1] === 1}
        <One />
      {/if}
      {#if shownDice[1] === 2}
        <Two />
      {/if}
      {#if shownDice[1] === 3}
        <Three />
      {/if}
      {#if shownDice[1] === 4}
        <Four />
      {/if}
      {#if shownDice[1] === 5}
        <Five />
      {/if}
      {#if shownDice[1] === 6}
        <Six />
      {/if}
    </div>
  </div>
  <div class={`${rolling ? "rolling-3" : ""} p-1`}>
    <div>
      {#if shownDice[2] === 1}
        <One />
      {/if}
      {#if shownDice[2] === 2}
        <Two />
      {/if}
      {#if shownDice[2] === 3}
        <Three />
      {/if}
      {#if shownDice[2] === 4}
        <Four />
      {/if}
      {#if shownDice[2] === 5}
        <Five />
      {/if}
      {#if shownDice[2] === 6}
        <Six />
      {/if}
    </div>
  </div>
  <div class="absolute w-full h-full cursor-pointer" on:click={onClick} />
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
  .slide-up-1 {
    animation: slideUp;
    animation-duration: 150ms;
    animation-timing-function: cubic-bezier();
  }
  .slide-up-2 {
    animation: slideUp;
    animation-duration: 225ms;
    animation-delay: 32.5ms;
    animation-timing-function: cubic-bezier();
  }
  .slide-up-3 {
    animation: slideUp;
    animation-duration: 300ms;
    animation-delay: 75ms;
    animation-timing-function: cubic-bezier();
  }
  @keyframes rolling {
    0% {
      transform: translate(0px, 0px) rotate(0deg);
    }
    25% {
      transform: translate(4px, 2px) rotate(15deg);
    }
    50% {
      transform: translate(0px, 0px) rotate(0deg);
    }
    75% {
      transform: translate(-4px, 2px) rotate(-15deg);
    }
    100% {
      transform: translate(0px, 0px) rotate(0deg);
    }
  }
  .rolling-1 {
    animation: rolling 300ms infinite;
    animation-timing-function: cubic-bezier();
  }
  .rolling-2 {
    animation: rolling 300ms infinite reverse;
    animation-timing-function: cubic-bezier();
  }
  .rolling-3 {
    animation: rolling 300ms infinite;
    animation-timing-function: linear;
  }
  #container {
    height: 168px;
  }
</style>
