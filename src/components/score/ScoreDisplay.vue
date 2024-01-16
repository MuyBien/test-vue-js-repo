<template>
  <section class="score">
    <p class="score__team_name">
      {{ match.homeTeam.name }}
    </p>
    <p class="score__team_score">
      {{ match.score[0] }}
    </p>
    <p class="score__team_score">
      {{ match.score[1] }}
    </p>
    <p class="score__team_name">
      {{ match.awayTeam.name }}
    </p>
  </section>
</template>

<script setup>
import { Match } from "@/models/match/Match";

defineProps({
  match: {
    type: Match,
    required: true,
  },
});
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
      margin-bottom: 0;
      border: 1px solid rgb(232, 30, 41);
      border-radius: 5px;
      padding: 15px;
      color: rgb(232, 30, 41);
      font-weight: bold;
      background-color: rgba(232, 30, 41, 0.08);
      font-size: 1.3em;
    }
  }
</style>