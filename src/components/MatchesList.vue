<template>
  <section class="matches-live">
    <h2>Matchs en live</h2>
    <section v-if="!liveDivisions.length && !liveTournaments.length">
      <p class="no-live-disclaimer">
        Aucun match live
      </p>
    </section>
    <section v-else>
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
        <li v-for="liveDivision in liveDivisions" :key="liveDivision.leagueId" class="division">
          <division-display :division="liveDivision" :show-all="showAllMatches" />
        </li>
      </ul>
      <ul>
        <li v-for="liveTournament in liveTournaments" :key="liveTournament.tournamentId" class="division">
          <tournament-display :division="liveTournament" />
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";
import DivisionDisplay from "@/components/DivisionDisplay.vue";
import TournamentDisplay from "@/components/TournamentDisplay.vue";
import { useMPG } from "@/use/useMPG";

/**
 * Matches
 */
const { liveDivisions, liveTournaments } = useMPG();

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