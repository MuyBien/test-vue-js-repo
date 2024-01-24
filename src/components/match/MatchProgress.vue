<template>
  <div
    class="progress"
    role="progressbar"
    aria-label="Progression dans le match"
    :aria-valuenow="matchProgress"
    aria-valuemin="0"
    aria-valuemax="100"
    style="height: 2px"
  >
    <div class="progress-bar" :class="progressClass" :style="{ width: matchProgress + '%' }" />
  </div>
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

// firstHalf pour la 1ere mi-temps
</script>

<style lang="scss" scoped>
.progress-bar {
  &.finished {
    background-color: rgb(120, 199, 61);
  }
  &.almost-finished {
    background-color: rgb(181, 224, 37);
  }
  &.almost-started {
    background-color: rgb(224, 201, 72);
  }
  &.just-started {
    background-color: rgb(244, 149, 56);
  }
}
</style>