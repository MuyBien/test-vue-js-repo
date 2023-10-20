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
            <button type="button" class="btn btn-link score-display__action">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-info-square"
                viewBox="0 0 16 16"
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </button>
          </div>
          <div v-else>
            <score-probabilities-display :scores-probabilities="match.getScoreProbabilities()" />
          </div>
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
import ScoreProbabilitiesDisplay from "@/components/ScoreProbabilitiesDisplay.vue";

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