<template>
  <div>
    <h2 class="division">
      <span class="division__logo" :style="{ 'backgroundImage': `url(${division.imageUrl}`}" />
      <span class="division__name">{{ division.name }}</span>
    </h2>
    <ul>
      <li v-for="match in matchesToDisplay" :key="match.id">
        <suspense>
          <match-display :live-match="match" />
        </suspense>
      </li>
    </ul>
  </div>
</template>

<script setup>
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
  showAll: {
    type: Boolean,
    default: true,
  },
});

const userMatch = computed(() => {
  const userTeamId = props.division.userTeamId;
  const liveMatches = Object.values(props.division.liveState?.liveMatches || []);
  return liveMatches.find((match) => {
    return match.home.teamId === userTeamId || match.away.teamId === userTeamId;
  });
});
const matchesToDisplay = computed(() => {
  if (props.showAll) {
    return Object.values(props.division.liveState?.liveMatches || []);
  }
  return [userMatch.value];
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