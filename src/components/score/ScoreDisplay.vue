<template>
  <section class="result" :class="{ 'result--clickable': isClickable }">
    <p class="result__team">
      <span class="result__team__name">{{ homeTeam.name || homeTeam.abbreviation }}</span>
      <span class="result__team__jersey" :style="{ 'backgroundImage': `url(${homeTeam.jerseyUrl}`}" />
    </p>
    <p class="result__score">
      {{ score.join(" - ") }}
    </p>
    <p class="result__team">
      <span class="result__team__jersey" :style="{ 'backgroundImage': `url(${awayTeam.jerseyUrl}`}" />
      <span class="result__team__name">{{ awayTeam.name || awayTeam.abbreviation }}</span>
    </p>
  </section>
</template>

<script setup>
defineProps({
  homeTeam: {
    type: Object,
    required: true,
  },
  awayTeam: {
    type: Object,
    required: true,
  },
  score: {
    type: Array,
    default: undefined,
  },
  isClickable: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.result {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;

  &--clickable {
    cursor: pointer;

    .result__score {
      transition: transform .3s ease-out;
      &:hover {
        transform: scale(1.2);
      }
    }
  }

  &__team {
    display: flex;
    align-items: center;
    flex: 1;
    width: 40%;
    margin: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    font-size: 15px;

    &:first-child {
      justify-content: end;
    }

    &__name {
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;

      &:first-child {
        text-align: end;
      }
    }

    &__jersey {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      background-size: cover;
      margin: 0 1vw;
    }
  }

  &__score {
    min-width: 30px;
    display: flex;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    color: rgb(232, 30, 41);
    background: rgba(232, 30, 41, 0.08);
    margin: 0;
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;
  }
}
</style>