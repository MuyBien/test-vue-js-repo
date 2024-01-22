<template>
  <section class="score">
    <p class="score__team_name">
      {{ match.homeTeam.name }}
    </p>
    <p class="score__team_score">
      {{ match.score[0] }}
      <span v-if="isHomeTeamAverage" class="home score--averaged do-not-share">M</span>
    </p>
    <p class="score__team_score">
      {{ match.score[1] }}
      <span v-if="isHomeTeamAverage" class="away score--averaged do-not-share">M</span>
    </p>
    <p class="score__team_name">
      {{ match.awayTeam.name }}
    </p>
  </section>
</template>

<script setup>
import { Match } from "@/models/match/Match";
import { ref, watch } from "vue";

const props = defineProps({
  match: {
    type: Match,
    required: true,
  },
});

/**
 * Caractéristiques du match
 */
const isHomeTeamAverage = ref(false);
const isAwayTeamAverage = ref(false);
watch(() => props.match, (match) => {
  isHomeTeamAverage.value = match.homeTeam.pitchPlayers.concat(match.homeTeam.benchPlayers).some(
    (player) => player.isAverageRating,
  );
  isAwayTeamAverage.value = match.awayTeam.pitchPlayers.concat(match.awayTeam.benchPlayers).some(
    (player) => player.isAverageRating,
  );
}, { immediate: true });
</script>

<style lang="scss" scoped>
.score {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;

    &__team_name {
      width: calc(100% - 90px);
      margin-bottom: 0;
      font-size: 1.2em;
    }

    &__team_score {
      position: relative;
      margin-bottom: 0;
      border: 1px solid rgb(232, 30, 41);
      border-radius: 5px;
      padding: 15px;
      color: rgb(232, 30, 41);
      font-weight: bold;
      background-color: rgba(232, 30, 41, 0.08);
      font-size: 1.3em;
    }

    &--averaged {
      position: absolute;
      top: -9px;
      left: -9px;
      background-color: var(--bs-yellow);
      color: #333;
      font-size: 9px;
      font-weight: bold;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      padding: 0;

      &.away {
        left: auto;
        right: -9px;
      }
    }
  }
</style>