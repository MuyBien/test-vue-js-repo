<template>
  <section class="match-wrapper">
    <div class="match-wrapper__jersey home-team" :style="{ 'backgroundImage': `url(${jerseyHome}`}" />
    <div class="match-wrapper__jersey away-team" :style="{ 'backgroundImage': `url(${jerseyAway}`}" />

    <header class="match-wrapper__score">
      <p class="match-wrapper__score__team_name">
        {{ match.homeTeam.name }}
      </p>
      <p class="match-wrapper__score__team_score">
        {{ match.score[0] }}
      </p>
      <p class="match-wrapper__score__team_score">
        {{ match.score[1] }}
      </p>
      <p class="match-wrapper__score__team_name">
        {{ match.awayTeam.name }}
      </p>
    </header>

    <main class="match-wrapper__teams">
      <div class="home-team goals">
        <div v-for="player in homeScorers" :key="player.playerId">
          <p>
            {{ player.lastName }}
          </p>
          <div class="player__goals">
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
      <div class="home-team bonus">
        <bonus-display :bonus="match.homeTeam.bonus" />
      </div>
      <div class="away-team goals">
        <div v-for="player in awayScorers" :key="player.playerId">
          <p>
            {{ player.lastName }}
          </p>
          <div class="player__goals">
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
      <div class="away-team bonus">
        <bonus-display :bonus="match.awayTeam.bonus" class="away-bonus" />
      </div>
    </main>

    <footer>
      <img alt="Logo MPG" src="/src/assets/logo.png">
      Calculé par mpg-calculator.fr
    </footer>
  </section>
</template>

<script setup>
import { computed } from "vue";
import GoalIcon from "@/components/icons/GoalIcon.vue";
import BonusDisplay from "@/components/bonus/BonusDisplay.vue";
import { Match } from "@/models/match/Match";

const props = defineProps({
  match: {
    type: Match,
    required: true,
  },
  jerseyHome: {
    type: String,
    default: "",
  },
  jerseyAway: {
    type: String,
    default: "",
  },
});

/**
 * Buteurs
 */
const homeScorers = computed(() => {
  return props.match.homeTeam.pitchPlayers.filter(({ goals, mpgGoals, ownGoals }) => goals + mpgGoals + ownGoals > 0);
});
const awayScorers = computed(() => {
  return props.match.awayTeam.pitchPlayers.filter(({ goals, mpgGoals, ownGoals }) => goals + mpgGoals + ownGoals > 0);
});
const haveFinallyScored = (player) => {
  return player.goals - player.savedGoals - player.canceledGoals > 0;
};
</script>

<style scoped lang="scss">
.match-wrapper {
  width: 100%;
  border-radius: 10px;
  padding: 1vh 1vw;
  position: relative;
  overflow: hidden;

  &__jersey {
    position: absolute;
    top: -4vh;
    width: 30vw;
    height: 100vh;
    background-repeat: no-repeat;
    background-position: top right;
    z-index: 0;
    opacity: 0.1;

    &.home-team {
      left: -15vw;
      background-image: url("https://s3-eu-west-3.amazonaws.com/jersey.mpg.football/back/jersey_0_1562598725887_temp.png");
    }
    &.away-team {
      right: -10vw;
      background-image: url("https://s3.eu-west-3.amazonaws.com/jersey.mpg.football/prod/8da067d4-0c2c-4abd-8b87-987c02210afe.png");
    }
  }

  &__score {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;

    &__team_name {
      width: 15vw;
      margin-bottom: 0;
      font-size: 1.2em;
    }

    &__team_score {
      margin-bottom: 0;
      border: 1px solid rgb(232, 30, 41);
      border-radius: 5px;
      padding: 15px;
      color: rgb(232, 30, 41);
      font-weight: bold;
      background-color: rgba(232, 30, 41, 0.08);
      font-size: 1.3em;
    }
  }

  &__teams {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(2, 1fr);
    position: relative;
    z-index: 1;

    .home-team.goals { grid-area: 1 / 1 / 2 / 2; }
    .home-team.bonus { grid-area: 2 / 1 / 3 / 2; }
    .away-team.goals {
      grid-area: 1 / 2 / 2 / 3;
      div {
        flex-direction: row-reverse;
        justify-content: start;
      }
    }
    .away-team.bonus {
      grid-area: 2 / 2 / 3 / 3;
      section {
        flex-direction: row-reverse !important;
      }
    }

    .goals {
      margin: 20px;

      div {
        display: flex;
        justify-content: end;
        align-items: center;
        margin: 0 5px;

        p {
          margin-bottom: 0;
        }
      }
    }
  }

  footer {
    display: flex;
    justify-content: end;
    align-items: center;
    font-size: 0.7em;
    color: grey;
    margin-top: 20px;

    img {
      width: 20px;
      margin-right: 5px;
    }
  }
}
</style>