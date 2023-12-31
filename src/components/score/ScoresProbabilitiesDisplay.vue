<template>
  <p>
    <span>Score le plus probable : </span>
    <span>{{ allPossiblesScores[0].score.join(" - ") }} ({{ allPossiblesScores[0].pourcentage }}%)</span>
  </p>
  <div class="progress-stacked">
    <div
      v-for="score in allPossiblesScores"
      :key="score"
      class="progress"
      role="progressbar"
      :aria-valuenow="score.pourcentage"
      aria-valuemin="0"
      aria-valuemax="100"
      :title="score.pourcentage + '%'"
      :style="{ width: `${ score.pourcentage }%` }"
    >
      <div class="progress-bar" :class="{ 'bg-success': isWinning(score.score), 'bg-danger': isLosing(score.score) }">
        {{ score.score.join(" - ") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  matches: {
    type: Array,
    required: true,
  },
});

/**
 * Utilitaires sur le score
 */
const isWinning = (score) => {
  return score[0] > score[1];
};
const isLosing = (score) => {
  return score[0] < score[1];
};

/**
 * Renvoi la probabilité d'un score unqiue dans une liste de scores
 * @param { Array } scores les scores à calculer
 * @returns { Object } tous les scores uniques et leurs pourcentages
*/
const getScoresPoucentages = (scores) => {
  const uniqueScores = Array.from(new Set(scores.map(JSON.stringify)), JSON.parse);
  const pourcentages = uniqueScores.map(uniqueScore => {
    const occurences = scores.filter(score => JSON.stringify(score) === JSON.stringify(uniqueScore)).length;
    const pourcentage = (occurences / scores.length) * 100;
    return {
      score: uniqueScore,
      pourcentage,
    };
  });
  pourcentages.sort((a, b) => b.pourcentage - a.pourcentage);
  return pourcentages;
};

const allPossiblesScores = computed(() => {
  return getScoresPoucentages(props.matches.map(match => match.score));
});
</script>