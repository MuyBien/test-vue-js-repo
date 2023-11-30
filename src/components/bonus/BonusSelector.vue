<template>
  <section class="bonus-swaper">
    <ul class="available-bonuses">
      <li
        v-for="availableBonus in availableBonuses"
        :key="availableBonus.value"
        class="bonus"
        :class="{
          'bonus--selected': selectedBonusValue === availableBonus.value,
          'bonus--disabled': notManagedBonus.includes(availableBonus.value),
        }"
        @click="selectBonus(availableBonus)"
      >
        <div class="bonus__logo" :style="{ 'backgroundImage': `url(${availableBonus.icon}`}" />
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { Team } from "@/models/teams/Team";
import { BONUSES } from "@/constants/bonus";

const props = defineProps({
  team: {
    type: Team,
    required: true,
  },
});
const notManagedBonus = ["boostOnePlayer", "removeRandomPlayer"];
const availableBonuses = Object.keys(props.team.availableBonuses)
  .filter(bonus => props.team.availableBonuses[bonus])
  .map(bonus => new BONUSES[bonus]());
availableBonuses.push(new BONUSES["none"]());

/**
 * Gestion du bonus sélectionné
 */
const selectedBonusValue = computed(() => props.team.bonus.value);
const emit = defineEmits(["change-bonus"]);
const selectBonus = (bonus) => {
  if (notManagedBonus.includes(bonus.value)) {
    return;
  }
  emit("change-bonus", bonus);
};
</script>

<style lang="scss" scoped>
.available-bonuses {
  display: flex;
  list-style: none;
  gap: 1vw;

  .bonus {
    cursor: pointer;
    transition: filter 0.2s ease-in-out;
    filter: grayscale(100%);

    &--selected,
    &:hover {
      filter: grayscale(0%);
    }

    &--disabled {
      cursor: not-allowed;
      filter: grayscale(100%);

      &:hover {
        filter: grayscale(100%);
      }
    }
    .bonus__logo {
      height: 57px ;
      width: 44px;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

}
</style>