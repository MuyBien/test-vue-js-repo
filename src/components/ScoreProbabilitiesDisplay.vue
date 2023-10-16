<template>
  <section class="score_probabilities">
    <p class="score_probabilities__help">
      Le bonus Chapron Rouge enlève un joueur au hasard parmi les 20 joueurs de champ.
      Le score ne peut donc pas être prédit à 100%.
      Le score après remplacement de chaque joueur par un Rotaldo a été calculé et les scores possibles aisni que leur probabilité sont affichés.
    </p>
    <p>
      <span>Score le plus probable : </span>
      <span>{{ scoresProbabilities[0].score.join(" - ") }} ({{ scoresProbabilities[0].pourcentage }}%)</span>
    </p>
    <div class="progress-stacked">
      <div
        v-for="score in scoresProbabilities"
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
  </section>
</template>

<script setup>
defineProps({
  scoresProbabilities: {
    type: Object,
    required: true,
  },
});

const isWinning = (score) => {
  return score[0] > score[1];
};
const isLosing = (score) => {
  return score[0] < score[1];
};
</script>

<style lang="scss" scoped>
</style>