<template>
  <section class="bonus">
    <div class="bonus__logo" :style="{ 'backgroundImage': `url(${bonus.icon}`}" />
    <div class="bonus__description">
      <p class="bonus__description__name">
        {{ bonus.name }}
      </p>
      <p class="bonus__description__explanations">
        {{ bonus.description }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { BONUSES } from "@/constants/bonus";

defineProps({
  bonus: {
    type: Object,
    default: () => {
      return BONUSES.none;
    },
  },
});
</script>

<style lang="scss" scoped>
.bonus {
  display: flex;
  column-gap: 1vw;

  &__logo {
    height: 57px ;
    width: 44px;
    background-size: contain;
    background-repeat: no-repeat;
    flex-shrink: 0;
  }

  &__description {
    display: flex;
    flex-direction: column;
    text-align: left;

    &__name {
      color: var(--bs-primary);
      margin-bottom: 0;
    }

    &__explanations {
      color: var(--bs-tertiary-color);
      margin-bottom: 0;
      font-size: .8em;;
    }
  }

}
</style>