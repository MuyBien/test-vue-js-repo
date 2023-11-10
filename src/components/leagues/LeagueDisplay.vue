<template>
  <div>
    <h2 class="league">
      <span class="league__logo" :style="{ 'backgroundImage': `url(${league.imageUrl}`}" />
      <span class="league__name">{{ league.name }}</span>
    </h2>
    <ul>
      <li v-for="matchData in matchesToDisplay" :key="matchData.id">
        <suspense>
          <match-display :live-data="matchData" />
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
  league: {
    type: Object,
    required: true,
  },
  showAll: {
    type: Boolean,
    default: true,
  },
});

const userMatch = computed(() => {
  const userTeamId = props.league.userTeamId;
  const liveMatches = Object.values(props.league.liveState?.liveMatches || []);
  return liveMatches.find((match) => {
    return match.home.teamId === userTeamId || match.away.teamId === userTeamId;
  });
});
const matchesToDisplay = computed(() => {
  if (props.showAll) {
    return Object.values(props.league.liveState?.liveMatches || []);
  }
  return [userMatch.value];
});
</script>

<style lang="scss" scoped>
.league {
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