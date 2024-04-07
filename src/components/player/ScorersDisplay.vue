<template>
  <section class="scorers">
    <div class="scorers__team scorers__team--home">
      <div v-for="player in homeScorers" :key="player.playerId" class="player">
        <p class="player__name" :class="{ 'player__name--removed': isNotScorerAnymore(player) }">
          {{ player.lastName }}
        </p>
        <div class="goals">
          <goals-display :player="player" />
        </div>
      </div>
    </div>
    <div class="scorers__team scorers__team--away">
      <div v-for="player in awayScorers" :key="player.playerId" class="player">
        <p class="player__name" :class="{ 'player__name--removed': isNotScorerAnymore(player) }">
          {{ player.lastName }}
        </p>
        <div class="goals">
          <goals-display :player="player" reverse-display />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import GoalsDisplay from "@/components/goals/GoalsDisplay.vue";
import { Match } from "@/models/match/Match";
import { computed } from "vue";

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

/**
 * Vérifie si tous les buts du joueurs ont été annulés ou arrêtés
 */
const isNotScorerAnymore = (player) => {
  return player.goals + player.mpgGoals - player.canceledGoals - player.savedGoals + player.ownGoals === 0 ;
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
          margin-left: 20px;
        }
      }
    }

    &--away {
      padding-left: 2vw;
      .player {
        flex-direction: row-reverse;
        justify-content: start;

        .goals {
          margin-right: 20px;
        }
      }
    }

    .player {
      display: flex;
      align-items: center;

      &__name {
        &--removed {
          text-decoration: line-through;
          text-decoration-color: rgb(232, 30, 41);
          text-decoration-thickness: 0.1rem;
        }
      }

      p {
        margin-bottom: 0;
      }
    }
  }
}
  </style>