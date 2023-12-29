<template>
  <section class="bonus-swaper">
    <div v-if="initialBonus" class="initial-bonus">
      <bonus-display
        :bonus="initialBonus"
        :class="{
          'bonus--selected': selectedBonusValue === initialBonus.value,
        }"
      />
      <button class="btn btn-link btn-sm" data-bs-toggle="button" @click="showBonusList = !showBonusList">
        Changer le bonus
      </button>
    </div>
    <ul v-if="showBonusList" class="available-bonuses mt-3">
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
import { ref, computed, defineProps, onMounted } from "vue";
import { Team } from "@/models/teams/Team";
import { BONUSES } from "@/constants/bonus";
import BonusDisplay from "@/components/bonus/BonusDisplay.vue";

const props = defineProps({
  team: {
    type: Team,
    required: true,
  },
});

/**
 * Liste des bonus
 */
const notManagedBonus = ["boostOnePlayer", "fourStrikers"];
const availableBonuses = Object.keys(props.team.availableBonuses)
  .filter(bonus => props.team.availableBonuses[bonus])
  .map(bonus => new BONUSES[bonus]());
availableBonuses.push(new BONUSES["none"]());
const showBonusList = ref(false);

/**
 * Bonus initial
 */
const initialBonus = ref();
onMounted(() => {
  initialBonus.value = new BONUSES[props.team.bonus.value || "none"]();
});

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
.initial-bonus {
    flex-direction: column;
}
.initial-bonus,
.available-bonuses {
  display: flex;
  flex-wrap: wrap;
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