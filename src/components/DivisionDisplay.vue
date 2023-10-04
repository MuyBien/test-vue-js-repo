<template>
  <div>
    <h2 class="division">
      <span class="division__logo" :style="{ 'backgroundImage': `url(${division.imageUrl}`}"></span>
      <span class="division__name">{{ division.name }}</span>
    </h2>
    <ul>
      <li class="match">
        <suspense>
          <match-display :live-match="userMatch" />
        </suspense>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MatchDisplay from "@/components/MatchDisplay.vue";

/**
 * Props
 */
const props = defineProps({
  division: {
    type: Object,
    required: true,
  },
});

const userMatch = computed(() => {
  const userTeamId = props.division.userTeamId;
  const liveMatches = Object.values(props.division.liveState?.liveMatches || []);
  return liveMatches.find((match) => {
    return match.home.teamId === userTeamId || match.away.teamId === userTeamId;
  });
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
  }
}
</style>