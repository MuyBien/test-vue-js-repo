<template>
  <div :id="`${liveMatch.id}-parent`" class="accordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="`#${liveMatch.id}-more-infos`"
          aria-expanded="true"
          :aria-controls="`${liveMatch.id}-more-infos`"
        >
          <score-display :match="liveMatch" />
        </button>
      </h2>
      <div
        :id="`${liveMatch.id}-more-infos`"
        ref="collapseElement"
        class="accordion-collapse collapse"
        :data-bs-parent="`#${liveMatch.id}-parent`"
      >
        <div class="accordion-body row">
          <match-placeholder v-if="!match" />
          <p v-else-if="isLiveSubMatch" class="alert alert-danger mt-3" role="alert">
            Désolé, les remplacements live ne sont pas encore gérés dans MPG Calculator.
          </p>
          <div v-else>
            <h3 class="title">
              Résultat calculé :
            </h3>
            <h6 class="subtitle">
              Après réalisation des remplacements tactiques et obligatoires, calcul des buts MPG et application de votre bonus.
            </h6>
            <div v-if="! isResultProbabilities" class="score-display" @click="showMatchDetails = true">
              <score-display :match="liveMatch" :score="match.getFinalScore()" is-clickable />
              <info-icon />
            </div>
            <div v-else>
              <score-probabilities-display :scores-probabilities="match.getScoreProbabilities()" />
            </div>
            <display-tournament-result v-if="isTournament" :match="match" class="mt-3" />

            <p class="rating-disclaimer alert alert-warning mt-3" role="alert">
              Attention, les notes des joueurs peuvent varier jusqu'à 7h après la fin de leur match et donc faire évoluer le résultat.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <match-details-display
    v-if="match"
    :match="match"
    :show="showMatchDetails"
    @close="showMatchDetails = false"
  >
    <template #title>
      <score-display :match="liveMatch" :score="match.getFinalScore()" @click="showMatchDetails = true" />
    </template>
  </match-details-display>
</template>

<script setup>
import { useMPG } from "@/use/useMPG";
import { computed, ref, onMounted } from "vue";
import { Collapse } from "bootstrap";

import ScoreDisplay from "@/components/score/ScoreDisplay.vue";
import MatchPlaceholder from "@/components/match/MatchPlaceholder.vue";
import MatchDetailsDisplay from "@/components/match/MatchDetailsDisplay.vue";
import DisplayTournamentResult from "@/components/tournaments/DisplayTournamentResult.vue";
import ScoreProbabilitiesDisplay from "@/components/score/ScoreProbabilitiesDisplay.vue";
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
 * Gestion du toggle
 */
const collapseElement = ref(null);
onMounted(() => {
  Collapse.getOrCreateInstance(collapseElement.value, { toggle: false });
  collapseElement.value.addEventListener("shown.bs.collapse", () => {
    fetchMatch();
  });
});

/**
 * Match
 */
const { getMatchData, getTournamentMatch } = useMPG();

const match = ref(undefined);
const fetchMatch = async () => {
  match.value = props.isTournament ? await getTournamentMatch(props.liveMatch.id) : await getMatchData(props.liveMatch.id);
};
const isLiveSubMatch = computed(() => {
  return match.value ? match.value.homeTeam.isLiveSubstitutesEnabled || match.value.awayTeam.isLiveSubstitutesEnabled : true;
});

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
.title {
  font-size: 14px;
  text-align: left;
  margin-bottom: 0;
}
.subtitle {
  margin-top: 0;
  margin-bottom: 2vh;
  font-size: 13px;
  text-align: left;
  color: var(--bs-gray);
}
.score-display {
  display: flex;

  &__action {
    padding: 0;
  }
}

.rating-disclaimer {
  font-size: 13px;
}
</style>