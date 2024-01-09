<template>
  <section class="scorers">
    <div class="scorers__team scorers__team--home">
      <div v-for="player in homeScorers" :key="player.playerId" class="player">
        <p>
          {{ player.lastName }}
        </p>
        <div class="goals">
          <template v-if="haveFinallyScored(player)">
            <goal-icon v-for="goal in (player.goals - player.savedGoals - player.canceledGoals)" :key="goal" />
          </template>
          <goal-icon v-if="player.goals.length && player.canceledGoals" is-canceled />
          <goal-icon v-for="ownGoal in player.ownGoals" :key="ownGoal" is-own-goal />
          <goal-icon v-if="player.mpgGoals" is-mpg-goal :is-canceled="!!player.canceledGoals" />
          <goal-icon v-if="player.savedGoals" is-saved />
        </div>
      </div>
    </div>
    <div class="scorers__team scorers__team--away">
      <div v-for="player in awayScorers" :key="player.playerId" class="player">
        <p>
          {{ player.lastName }}
        </p>
        <div class="goals">
          <template v-if="haveFinallyScored(player)">
            <goal-icon v-for="goal in (player.goals - player.savedGoals - player.canceledGoals)" :key="goal" />
          </template>
          <goal-icon v-if="player.goals.length && player.canceledGoals" is-canceled />
          <goal-icon v-for="ownGoal in player.ownGoals" :key="ownGoal" is-own-goal />
          <goal-icon v-if="player.mpgGoals" is-mpg-goal :is-canceled="!!player.canceledGoals" />
          <goal-icon v-if="player.savedGoals" is-saved />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { Match } from "@/models/match/Match";
import GoalIcon from "@/components/icons/GoalIcon.vue";

const props = defineProps({
  match: {
    type: Match,
    required: true,
  },
});

/**
 * Buteurs
 */
const homeScorers = computed(() => {
  const homeScorers = props.match.homeTeam.pitchPlayers.filter(({ goals, mpgGoals }) => goals + mpgGoals > 0);
  const awayScorers = props.match.awayTeam.pitchPlayers.filter(({ ownGoals }) => ownGoals > 0);
  return homeScorers.concat(awayScorers);
});
const awayScorers = computed(() => {
  const awayScorers = props.match.awayTeam.pitchPlayers.filter(({ goals, mpgGoals }) => goals + mpgGoals > 0);
  const homeScorers = props.match.homeTeam.pitchPlayers.filter(({ ownGoals }) => ownGoals > 0);
  return awayScorers.concat(homeScorers);
});
const haveFinallyScored = (player) => {
  return player.goals - player.savedGoals - player.canceledGoals > 0;
};
</script>

<style lang="scss" scoped>
.scorers {
  display: flex;
  position: relative;
  z-index: 1;

  &__team {
    display: flex;
    flex-direction: column;
    width: 50%;

    &--home {
      padding-right: 2vw;
      .player {
        flex-direction: row;
        justify-content: flex-end;

        .goals {
          margin-left: 1vw;
          svg {
            margin-left: -10px;
          }
        }
      }
    }

    &--away {
      padding-left: 2vw;
      .player {
        flex-direction: row-reverse;
        justify-content: start;

        .goals {
          margin-right: 1vw;
          svg {
            margin-right: -10px;
          }
        }
      }
    }

    .player {
      display: flex;
      align-items: center;

      p {
        margin-bottom: 0;
      }
    }
  }
}
  </style>