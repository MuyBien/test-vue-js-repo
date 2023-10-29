<template>
  <div>
    <h2 class="tournament">
      <!-- <span class="tournament__logo" :style="{ 'backgroundImage': `url(${tournament.imageUrl}`}" /> -->
      <span class="tournament__name">{{ tournament.name }}</span>
    </h2>
    <ul>
      <li>
        <suspense>
          <match-display :live-match="match" is-tournament />
        </suspense>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";
import MatchDisplay from "@/components/match/MatchDisplay.vue";

/**
 * Props
 */
const props = defineProps({
  tournament: {
    type: Object,
    required: true,
  },
});

const match = computed(() => {
  return props.tournament.liveState?.tournamentMatch;
});
</script>

<style lang="scss" scoped>
.division {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  &__logo {
    width: 50px;
    height: 50px;
    display: block;
    background-size: cover;
  }
}

ul {
  padding: 0;

  li {
    list-style: none;
    margin-bottom: 10px;
  }
}
</style>