<template>
  <section class="result">
    <p class="result__team">
      <span class="result__team__name">{{ match.home.name }}</span>
      <span class="result__team__jersey" :style="{ 'backgroundImage': `url(${match.home.jerseyUrl}`}" />
    </p>
    <p class="result__score">
      {{ scoreToDisplay }}
    </p>
    <p class="result__team">
      <span class="result__team__jersey" :style="{ 'backgroundImage': `url(${match.away.jerseyUrl}`}" />
      <span class="result__team__name">{{ match.away.name }}</span>
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
  score: {
    type: Array,
    default: undefined,
  },
});

const scoreToDisplay = computed(() => {
  if (props.score) {
    return props.score.join(" - ");
  }
  return [props.match.home.score, props.match.away.score].join(" - ");
});
</script>

<style lang="scss" scoped>
.result {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &__team {
    display: flex;
    align-items: center;
    width: 40%;
    margin: 0 10px;
    white-space: pre-wrap;
    font-size: 15px;

    &:first-child {
      justify-content: end;
    }

    &__jersey {
      width: 32px;
      height: 32px;
      background-size: cover;
      margin: 0 1vw;
    }
  }

  &__score {
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