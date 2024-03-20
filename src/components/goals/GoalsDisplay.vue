<template>
  <section
    :class="{'reverse': reverseDisplay}"
  >
    <template v-if="haveFinallyScored">
      <goal-icon v-for="goal in (player.goals - player.savedGoals - player.canceledGoals)" :key="goal" :small-icon="smallIcons" />
    </template>
    <goal-icon v-if="player.goals > 0 && player.canceledGoals > 0" is-canceled />
    <goal-icon v-for="ownGoal in player.ownGoals" :key="ownGoal" is-own-goal />
    <goal-icon v-if="player.mpgGoals" is-mpg-goal :is-canceled="!!player.canceledGoals" />
    <goal-icon v-if="player.savedGoals" is-saved />
  </section>
</template>

<script setup>
import GoalIcon from "@/components/icons/GoalIcon.vue";
import { Player } from "@/models/players/Player";
import { computed } from "vue";

const props = defineProps({
  player: {
    type: Player,
    required: true,
  },
  reverseDisplay: {
    type: Boolean,
    default: false,
  },
  smallIcons: {
    type: Boolean,
    default: false,
  },
});

const haveFinallyScored = computed(() => {
  return props.player.goals - props.player.savedGoals - props.player.canceledGoals > 0;
});
</script>

<style lang="scss" scoped>
svg {
  margin-left: -10px;
}
.reverse {
  svg {
    margin-left: 0;
    margin-right: -10px;
  }
}
</style>