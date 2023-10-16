<template>
  <div
    :id="`${match.id}-details`"
    class="modal fade modal-xl"
    tabindex="-1"
    aria-labelledby="match-details"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            <slot name="title">
              Détail du match
            </slot>
          </h1>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          />
        </div>
        <div class="modal-body row">
          <div class="col-6">
            <bonus-display :bonus="match.homeTeam.bonus" class="mb-3" />
            <team-display v-if="!isResultProbabilities" :players="match.homeTeam.getFinalPlayers()" :goalkeeper-saves="match.goalkeeperSaves.homeTeam" />
          </div>
          <div class="col-6">
            <bonus-display :bonus="match.awayTeam.bonus" class="mb-3" />
            <team-display v-if="!isResultProbabilities" :players="match.awayTeam.getFinalPlayers()" :goalkeeper-saves="match.goalkeeperSaves.awayTeam" />
          </div>
          <div v-if="isResultProbabilities">
            <score-probabilities-display :scores-probabilities="match.getScoreProbabilities()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, ref } from "vue";

import TeamDisplay from "@/components/TeamDisplay.vue";
import BonusDisplay from "@/components/BonusDisplay.vue";
import ScoreProbabilitiesDisplay from "@/components/ScoreProbabilitiesDisplay.vue";

import { Modal } from "bootstrap";

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["close"]);

/**
 * Propriétés du score
 */
const isResultProbabilities = computed(() => {
  return props.match.homeTeam.bonus.value === "removeRandomPlayer" || props.match.awayTeam.bonus.value === "removeRandomPlayer";
});

/**
 * Affichage de la modale
 */
const modal = ref();
onMounted(() => {
  modal.value = Modal.getOrCreateInstance(`#${props.match.id}-details`);
});
watch(() => props.show, (show) => {
  if (show) {
    modal.value.show();
  } else {
    modal.value.hide();
  }
});
const closeModal = () => {
  emits("close");
};
</script>