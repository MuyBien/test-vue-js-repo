<template>
  <section class="progress-wrapper">
    <p class="progress-wrapper__title" :class="progressClass">
      Progression : {{ matchProgress }}%
    </p>
    <div
      class="progress progress-wrapper__bar-wrapper"
      role="progressbar"
      aria-label="Progression dans le match"
      :aria-valuenow="matchProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      style="height: 1px"
    >
      <div class="progress-bar progress-wrapper__bar-wrapper__bar" :class="progressClass" :style="{ width: matchProgress + '%' }" />
    </div>
  </section>
</template>

<script setup>
import { Match } from "@/models/match/Match";
import { computed } from "vue";

const props = defineProps({
  match: {
    type: Match,
    required: true,
  },
});

/**
 * Joueurs
 */
const matchProgress = computed(() => {
  const allHomePlayers = props.match.homeTeam.pitchPlayers.concat(props.match.homeTeam.benchPlayers);
  const allAwayPlayers = props.match.awayTeam.pitchPlayers.concat(props.match.awayTeam.benchPlayers);
  const allPlayers = allHomePlayers.concat(allAwayPlayers);

  const playersNotPlayed = allPlayers.filter((player) => player.isAverageRating);
  return Math.round(100 - (playersNotPlayed.length / allPlayers.length) * 100);
});

/**
 * Couleur de la barre de progression
 */
const progressClass = computed(() => {
  if (matchProgress.value === 100) {
    return "finished";
  }
  if (matchProgress.value >= 75) {
    return "almost-finished";
  }
  if (matchProgress.value >= 25) {
    return "almost-started";
  }
  return "just-started";
});
</script>

<style lang="scss" scoped>
.progress-wrapper {
  --var-finished-color: rgb(120, 199, 61);
  --var-almost-finished-color: rgb(181, 224, 37);
  --var-almost-started-color: rgb(224, 201, 72);
  --var-just-started-color: rgb(244, 149, 56);

  &__title {
    font-size: .6rem;
    font-weight: bold;
    margin: 0;

    &.finished {
      color: var(--var-finished-color);
    }
    &.almost-finished {
      color: var(--var-almost-finished-color);
    }
    &.almost-started {
      color: var(--var-almost-started-color);
    }
    &.just-started {
      color: var(--var-just-started-color);
    }
  }

  &__bar-wrapper__bar {
    &.finished {
      background-color: var(--var-finished-color);
    }
    &.almost-finished {
      background-color: var(--var-almost-finished-color);
    }
    &.almost-started {
      background-color: var(--var-almost-started-color);
    }
    &.just-started {
      background-color: var(--var-just-started-color);
    }
  }
}
</style>