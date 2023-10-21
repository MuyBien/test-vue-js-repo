<template>
  <section class="tournament-match-winner">
    <h3>Équipe qualifiée pour le tour suivant :</h3>
    <p class="team">
      {{ match.getQualified()?.name || "??" }}
    </p>
  </section>
</template>

<script setup>
import { TournamentMatch } from "@/models/TournamentMatch";

defineProps({
  match: {
    type: TournamentMatch,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.tournament-match-winner {
  h3 {
    font-size: medium;
    text-align: left;
  }
  .team {
    font-size: 2em;
  }
}
</style>