<template>
  <section class="match-progress-wrapper">
    <team-progress :team="match.homeTeam " :is-substitutions-blocked="match.awayTeam.bonus.value === 'blockTacticalSubs'" />
    <team-progress :team="match.awayTeam " :is-substitutions-blocked="match.homeTeam.bonus.value === 'blockTacticalSubs'" />
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