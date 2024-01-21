<template>
  <section class="legends">
    <div class="average-legend">
      <span class="average-legend__icon">M</span> : Note moyenne du joueur (attribué aux joueurs dont le match n'a pas commencé)
    </div>
  </section>
</template>

<style lang="scss" scoped>
.legends {
  .average-legend {
    &__icon {
      display: inline-block;
      width: 15px;
      height: 15px;
      line-height: 15px;
      background-color: var(--bs-yellow);
      color: #333;
      font-size: 9px;
      font-weight: bold;
      border-radius: 50%;
      text-align: center;
    }
  }
}
</style>