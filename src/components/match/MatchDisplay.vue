<template>
  <div :id="`${liveData.id}-parent`" class="accordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="`#${liveData.id}-more-infos`"
          aria-expanded="true"
          :aria-controls="`${liveData.id}-more-infos`"
        >
          <score-display :home-team="liveData.home" :away-team="liveData.away" :score="[liveData.home.score, liveData.away.score]" />
        </button>
      </h2>
      <div
        :id="`${liveData.id}-more-infos`"
        ref="collapseElement"
        class="accordion-collapse collapse"
        :data-bs-parent="`#${liveData.id}-parent`"
      >
        <div class="accordion-body row">
          <match-placeholder v-if="!match" />
          <div v-else>
            <h3 class="title">
              Résultat calculé :
            </h3>
            <h6 class="subtitle">
              Après réalisation des remplacements tactiques et obligatoires, calcul des buts MPG et application de votre bonus.
            </h6>
            <div class="score-display" @click="openModal">
              <score-display
                :home-team="match.homeTeam"
                :away-team="match.awayTeam"
                :score="match.score"
                is-clickable
              />
              <info-icon />
            </div>

            <div v-if="isResultProbabilities && initialMatch" class="mt-3">
              <scores-list-display :match="initialMatch" />
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
    @close="closeModal"
  >
    <template #title>
      <score-display
        :home-team="liveData.home"
        :away-team="liveData.away"
        :score="match.score"
      />
    </template>
  </match-details-display>
</template>

<script setup>
import { useMPG } from "@/use/useMPG";
import { ref, computed, onMounted } from "vue";
import { Collapse } from "bootstrap";

import { calculateFinalMatch } from "@/utils/match/resultMatchCalculator.js";

import ScoreDisplay from "@/components/score/ScoreDisplay.vue";
import MatchPlaceholder from "@/components/match/MatchPlaceholder.vue";
import MatchDetailsDisplay from "@/components/match/MatchDetailsDisplay.vue";
import DisplayTournamentResult from "@/components/tournaments/DisplayTournamentResult.vue";
import ScoresListDisplay from "@/components/score/ScoresListDisplay.vue";
import InfoIcon from "@/components/icons/InfoIcon.vue";

const props = defineProps({
  liveData: {
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
const { getLeagueMatch, getTournamentMatch } = useMPG();

const initialMatch = ref();
const match = ref();
const fetchMatch = async () => {
  initialMatch.value = props.isTournament ? await getTournamentMatch(props.liveData.id) : await getLeagueMatch(props.liveData.id);
  match.value = calculateFinalMatch(initialMatch.value);
};

/**
 * Gestion de la modale des détails du match
 */
const showMatchDetails = ref(false);
const openModal = () => {
  showMatchDetails.value = true;
  history.pushState({ modalOpen: true }, null);
};
const closeModal = () => {
  showMatchDetails.value = false;
};
onMounted(() => {
  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.modalOpen) {
      closeModal();
    }
  });
});

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