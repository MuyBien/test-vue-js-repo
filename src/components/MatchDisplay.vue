<template>
  <div class="accordion">
    <div class="accordion-item">
      <h2 id="headingOne" class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="`#${match.id}-live-players`"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <score-display :match="liveMatch" />
        </button>
      </h2>
      <div
        :id="`${match.id}-live-players`"
        class="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body row">
          <h3>Résultat après RT et calcul des buts MPG :</h3>
          <div class="score-display" @click="showMatchDetails = true">
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
        </div>
      </div>
    </div>

    <match-details-display :match="match" :show="showMatchDetails" @close="showMatchDetails = false">
      <template #title>
        <score-display :match="liveMatch" :score="match.getFinalScore()" @click="showMatchDetails = true" />
      </template>
    </match-details-display>
  </div>
</template>

<script setup>
import { useMPG } from "@/use/useMPG";
import { ref } from "vue";

import ScoreDisplay from "@/components/ScoreDisplay.vue";
import MatchDetailsDisplay from "@/components/MatchDetailsDisplay.vue";

const props = defineProps({
  liveMatch: {
    type: Object,
    required: true,
  },
});

const { getMatchData } = useMPG();

const match = ref("");
match.value = await getMatchData(props.liveMatch.id);

const showMatchDetails = ref(false);
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
  &__action {
    padding: 0;
  }
}
</style>