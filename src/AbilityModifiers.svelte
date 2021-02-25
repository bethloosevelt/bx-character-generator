<script lang="ts">
  import type { Ability } from "./characterClasses/types";
  export let abilityScores: { [key in Ability]: number };
  import {
    getSTRModifier,
    getINTModifier,
    getDEXModifier,
    getCHAModifier,
    getWISModifier,
    getCONModifier,
  } from "./abilityModifiers";
  const STR_MOD = getSTRModifier(abilityScores["STR"]);
  const INT_MOD = getINTModifier(abilityScores["INT"]);
  const DEX_MOD = getDEXModifier(abilityScores["DEX"]);
  const CHA_MOD = getCHAModifier(abilityScores["CHA"]);
  const WIS_MOD = getWISModifier(abilityScores["WIS"]);
  const CON_MOD = getCONModifier(abilityScores["CON"]);
</script>

<div>
  <div>
    STR
    <div>
      <span>Melee</span>
      <span>{STR_MOD?.modifiers.melee}</span>
    </div>
    <div>
      <span>Open Doors</span>
      <span>{STR_MOD?.modifiers.openDoors}</span>
    </div>
  </div>
  <div>
    INT
    <div>
      <span>Spoken Languages</span>
      <span>{INT_MOD?.modifiers.spokenLanguages}</span>
    </div>
    <div>
      <span>Literacy</span>
      <span>{INT_MOD?.modifiers.literacy}</span>
    </div>
  </div>
  <div>
    DEX
    <div>
      <span>AC</span>
      <span>{DEX_MOD?.modifiers.armorClass}</span>
    </div>
    <div>
      <span>Missile</span>
      <span>{DEX_MOD?.modifiers.missile}</span>
    </div>
    <div>
      <span>Initiative</span>
      <span>{DEX_MOD?.modifiers.initiative}</span>
    </div>
  </div>
  <div>
    CHA
    <div>
      <span>NPC Reactions</span>
      <span>{CHA_MOD?.modifiers.npcReactions}</span>
    </div>
    <div>
      <span>Max # of Retainers</span>
      <span>{CHA_MOD?.modifiers.maxRetainers}</span>
    </div>
    <div>
      <span>Loyalty</span>
      <span>{CHA_MOD?.modifiers.loyalty}</span>
    </div>
  </div>
  <div>
    WIS
    <div>
      <span>Magic Saves</span>
      <span>{WIS_MOD?.modifiers.magicSaves}</span>
    </div>
  </div>
  <div>
    CON
    <div>
      <span>HP</span>
      <span>{CON_MOD?.modifiers.hp}</span>
    </div>
  </div>
</div>

<style>
</style>
