<template>
  <section class="matches-live">
    <no-live-disclaimer v-if="!liveDivisions.length && !liveTournaments.length" />
    <section v-else>
      <h2>Matchs en live</h2>
      <ul>
        <li v-for="liveTournament in liveTournaments" :key="liveTournament.tournamentId" class="division">
          <tournament-display :tournament="liveTournament" />
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import TournamentDisplay from "@/components/tournaments/TournamentDisplay.vue";
import NoLiveDisclaimer from "@/components/disclaimers/NoLiveDisclaimer.vue";
import { useMPG } from "@/use/useMPG";

/**
 * Matches
 */
const { liveDivisions, liveTournaments } = useMPG();
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
}
ul {
  padding: 0;
  text-align: center;
}

.matches-live {
  width: 95%;
  max-width: 800px;
}
.division {
  list-style: none;
  margin: 5vh;
}
</style>