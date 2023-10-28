<template>
  <section class="matches-live">
    <no-live-disclaimer v-if="!liveLeagues.length && !liveTournaments.length" />
    <section v-else>
      <h2>Matchs en live</h2>
      <header>
        <button
          type="button"
          class="btn"
          :class="{ active: !showAllMatches }"
          data-bs-toggle="button"
          aria-pressed="true"
          @click="toggleDisplayMode"
        >
          Mes matchs
        </button>
      </header>
      <ul>
        <li v-for="liveLeague in liveLeagues" :key="liveLeague.leagueId" class="division">
          <league-display :league="liveLeague" :show-all="showAllMatches" />
        </li>
      </ul>
      <ul>
        <li v-for="liveTournament in liveTournaments" :key="liveTournament.tournamentId" class="division">
          <tournament-display :tournament="liveTournament" />
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";

import TournamentDisplay from "@/components/tournaments/TournamentDisplay.vue";
import NoLiveDisclaimer from "@/components/disclaimers/NoLiveDisclaimer.vue";
import LeagueDisplay from "@/components/leagues/LeagueDisplay.vue";

import { useMPG } from "@/use/useMPG";

/**
 * Matches
 */
const { liveLeagues, liveTournaments } = useMPG();

/**
 * Options
 */
const showAllMatches = ref(true);
const toggleDisplayMode = () => {
  showAllMatches.value = ! showAllMatches.value;
};
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