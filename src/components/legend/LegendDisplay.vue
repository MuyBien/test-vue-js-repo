<template>
  <section class="legends">
    <div class="average-legend">
      <span class="average-legend__icon">M</span> :
      <span v-if="forPlayers">Note moyenne du joueur (attribuée aux joueurs dont le match n'a pas commencé)</span>
      <span v-else>Score calculé avec des notes moyennes de joueurs (attribuée aux joueurs dont le match n'a pas commencé)</span>
    </div>
    <div v-if="forPlayers" class="live-legend">
      <span class="live-legend__icon" /> :
      <span>Match du joueur en cours</span>
    </div>
  </section>
</template>

<script setup>

defineProps({
  forPlayers: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.legends {
  font-size: 0.8rem;
  display:flex;
  column-gap: 10px;
  flex-wrap: wrap;
  text-align: left;

  .average-legend {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 5px;

    &__icon {
      display: inline-block;
      min-width: 15px;
      min-height: 15px;
      line-height: 15px;
      background-color: var(--bs-yellow);
      color: #333;
      font-size: 9px;
      font-weight: bold;
      border-radius: 50%;
      text-align: center;
    }
  }

  .live-legend {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 5px;

    &__icon {
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: var(--bs-red);
      color: #fff;
      font-weight: bold;
      border-radius: 50%;
      text-align: center;
    }
  }
}
</style>