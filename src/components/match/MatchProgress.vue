<template>
  <section class="match-progress-wrapper">
    <team-progress :team="match.homeTeam " />
    <team-progress :team="match.awayTeam " />
  </section>
</template>

<script setup>
import TeamProgress from "@/components/team/TeamProgress.vue";
import { Match } from "@/models/match/Match";

defineProps({
  match: {
    type: Match,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.match-progress-wrapper {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}
</style>