<template>
  <div>
    <h2>{{ division.name }}</h2>
    <ul>
      <li class="match">
        <match-display :match="userMatch" />
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
ul {
  padding: 0;
}
</style>