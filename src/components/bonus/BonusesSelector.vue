<template>
  <section class="bonus-swaper">
    <h3 class="bonus-swaper__title">
      Changement de bonus
    </h3>
    <h6 class="bonus-swaper__subtitle">
      Change le bonus de chaque équipe pour voir l'effet sur le résultat final
    </h6>

    <div class="row">
      <bonus-selector :team="updatedMatch.homeTeam" class="col-6" />
      <bonus-selector :team="updatedMatch.awayTeam" class="col-6" />
    </div>

    <score-display
      :home-team="updatedMatch.homeTeam"
      :away-team="updatedMatch.awayTeam"
      :score="updatedMatch.score"
      class="mt-5"
    />
  </section>
</template>

<script setup>
import { defineProps, computed, ref } from "vue";
import BonusSelector from "@/components/bonus/BonusSelector.vue";
import ScoreDisplay from "@/components/score/ScoreDisplay.vue";

import { calculateFinalMatch } from "@/utils/match/resultMatchCalculator.js";

import { Match } from "@/models/match/Match";

const props = defineProps({
  match: {
    type: Match,
    required: true,
  },
});

const updatedMatch = computed(() => {
  const newMatch = new Match(props.match);
  newMatch.homeTeam.bonus = homeTeamBonus.value;
  newMatch.awayTeam.bonus = awayTeamBonus.value;
  return calculateFinalMatch(newMatch);
});
const homeTeamBonus = ref(props.match.homeTeam.bonus);
const awayTeamBonus = ref(props.match.awayTeam.bonus);
</script>

<style lang="scss" scoped>
.bonus-swaper {

  &__title {
    font-size: 14px;
    text-align: left;
    margin-bottom: 0;
  }

  &__subtitle {
    margin-top: 0;
    margin-bottom: 2vh;
    font-size: 13px;
    text-align: left;
    color: var(--bs-gray);
  }
}
</style>