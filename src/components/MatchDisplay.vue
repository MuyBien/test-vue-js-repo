<template>
  <div :id="`${match.id}-parent`" class="accordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="`#${match.id}-more-infos`"
          aria-expanded="true"
          :aria-controls="`${match.id}-more-infos`"
        >
          <score-display :match="liveMatch" />
        </button>
      </h2>
      <div :id="`${match.id}-more-infos`" class="accordion-collapse collapse" :data-bs-parent="`#${match.id}-parent`">
        <div class="accordion-body row">
          <h3>Résultat après RT et calcul des buts MPG :</h3>
          <div v-if="! isResultProbabilities" class="score-display" @click="showMatchDetails = true">
            <score-display :match="liveMatch" :score="match.getFinalScore()" />
            <info-icon />
          </div>
          <div v-else>
            <score-probabilities-display :scores-probabilities="match.getScoreProbabilities()" />
          </div>
          <display-tournament-result v-if="isTournament" :match="match" class="mt-3" />
        </div>
      </div>
    </div>
  </div>

  <match-details-display :match="match" :show="showMatchDetails" @close="showMatchDetails = false">
    <template #title>
      <score-display :match="liveMatch" :score="match.getFinalScore()" @click="showMatchDetails = true" />
    </template>
  </match-details-display>
</template>

<script setup>
import { useMPG } from "@/use/useMPG";
import { computed, ref } from "vue";

import ScoreDisplay from "@/components/ScoreDisplay.vue";
import MatchDetailsDisplay from "@/components/MatchDetailsDisplay.vue";
import DisplayTournamentResult from "@/components/tournaments/DisplayTournamentResult.vue";
import ScoreProbabilitiesDisplay from "@/components/ScoreProbabilitiesDisplay.vue";
import InfoIcon from "@/components/icons/InfoIcon.vue";

const props = defineProps({
  liveMatch: {
    type: Object,
    required: true,
  },
  isTournament: {
    type: Boolean,
    default: false,
  },
});

/**
 * Match
 */
const { getMatchData, getTournamentMatch } = useMPG();

const match = ref("");
match.value = props.isTournament ? await getTournamentMatch(props.liveMatch.id) : await getMatchData(props.liveMatch.id);

/**
 * Gestion de la modale des détails du match
 */
const showMatchDetails = ref(false);

/**
 * Propriétés du score
 */
const isResultProbabilities = computed(() => {
  return match.value.homeTeam.bonus.value === "removeRandomPlayer" || match.value.awayTeam.bonus.value === "removeRandomPlayer";
});
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}
h3 {
  font-size: medium;
  text-align: left;
}
.score-display {
  display: flex;

  &__action {
    padding: 0;
  }
}
</style>