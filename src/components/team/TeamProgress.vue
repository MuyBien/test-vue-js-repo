<template>
  <section v-if="! team.isLiveSubstitutesEnabled" class="team-progress-wrapper">
    <p class="team-progress-wrapper__title" :class="progressClass">
      Progression : {{ teamProgress }}%
    </p>
    <div
      class="progress team-progress-wrapper__bar-wrapper"
      role="progressbar"
      aria-label="Progression de l'équipe à domicile"
      :aria-valuenow="teamProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      style="height: 1px"
    >
      <div class="progress-bar team-progress-wrapper__bar-wrapper__bar" :class="progressClass" :style="{ width: teamProgress + '%' }" />
    </div>
  </section>
  <section v-else class="team-progress-wrapper">
    <p class="team-progress-wrapper__title" :class="progressClass">
      {{ team.substitutions.length }} / {{ liveSubstitutionsAllowedNumber }} {{ team.substitutions.length > 1 ? "remplacements effectués" : "remplacement effectué" }}
    </p>
  </section>
</template>

<script setup>
import { Team } from "@/models/teams/Team";
import { getTeamProgress } from "@/utils/progress/teamProgress";
import { computed } from "vue";

const props = defineProps({
  team: {
    type: Team,
    required: true,
  },
  isSubstitutionsBlocked: {
    type: Boolean,
    default: false,
  },
});

/**
 * Progress
 */
const liveSubstitutionsAllowedNumber = computed(() => {
  return props.isSubstitutionsBlocked ? 2 : 10;
});

const teamProgress = computed(() => {
  if (props.team.isLiveSubstitutesEnabled) {
    return Math.round((props.team.substitutions.length / liveSubstitutionsAllowedNumber.value) * 100);
  }
  return getTeamProgress(props.team);
});

/**
 * Couleur de la barre de progression
 */
const progressClass = computed(() => {
  if (teamProgress.value === 100) {
    return "finished";
  }
  if (teamProgress.value >= 75) {
    return "almost-finished";
  }
  if (teamProgress.value >= 25) {
    return "almost-started";
  }
  return "just-started";
});
</script>

<style lang="scss" scoped>
.team-progress-wrapper {
  --var-finished-color: hsl(100, 60%, 50%);
  --var-almost-finished-color: hsl(75, 60%, 50%);
  --var-almost-started-color: hsl(50, 60%, 50%);
  --var-just-started-color: hsl(25, 60%, 50%);

  &__title {
    font-size: .6rem;
    font-weight: bold;
    margin: 0;

    &.finished {
      color: var(--var-finished-color);
    }
    &.almost-finished {
      color: var(--var-almost-finished-color);
    }
    &.almost-started {
      color: var(--var-almost-started-color);
    }
    &.just-started {
      color: var(--var-just-started-color);
    }
  }

  &__bar-wrapper__bar {
    &.finished {
      background-color: var(--var-finished-color);
    }
    &.almost-finished {
      background-color: var(--var-almost-finished-color);
    }
    &.almost-started {
      background-color: var(--var-almost-started-color);
    }
    &.just-started {
      background-color: var(--var-just-started-color);
    }
  }
}
</style>