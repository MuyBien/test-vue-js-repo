<template>
  <section class="matches-live">
    <h2>Matchs en live</h2>
    <section v-if="!liveDivisions.length">
      <p class="no-live-disclaimer">
        Aucun match live
      </p>
    </section>
    <ul>
      <li v-for="liveDivision in liveDivisions" :key="liveDivision.leagueId" class="division">
        <division-display :division="liveDivision" />
      </li>
    </ul>
  </section>
</template>

<script setup>
import DivisionDisplay from "@/components/DivisionDisplay.vue";
import { useMPG } from "@/use/useMPG";

/**
 * Matches
 */
const { liveDivisions } = useMPG();
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
}
ul {
  padding: 0;
  text-align: center;
}
.division {
  list-style: none;
  margin: 5vh;
}
</style>