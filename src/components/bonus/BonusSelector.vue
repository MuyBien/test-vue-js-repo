<template>
  <section class="bonus-swaper">
    <ul class="available-bonuses">
      <li
        v-for="availableBonus in availableBonuses"
        :key="availableBonus.value"
        class="bonus"
      >
        <div class="bonus__logo" :style="{ 'backgroundImage': `url(${availableBonus.icon}`}" />
      </li>
    </ul>
  </section>
</template>

<script setup>
import { defineProps } from "vue";
import { Team } from "@/models/teams/Team";
import { BONUSES } from "@/constants/bonus";

const props = defineProps({
  team: {
    type: Team,
    required: true,
  },
});
const availableBonuses = Object.keys(props.team.availableBonuses)
  .filter(bonus => props.team.availableBonuses[bonus])
  .map(bonus => new BONUSES[bonus]());
</script>

<style lang="scss" scoped>
.available-bonuses {
  display: flex;
  list-style: none;
  gap: 1vw;

  .bonus {
    cursor: pointer;
    .bonus__logo {
      height: 57px ;
      width: 44px;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

}
</style>