<template>
  <tr class="player">
    <td class="player_infos">
      <p class="player_infos__number">
        {{ playerIndex + 1 }}
      </p>
      <div class="player_infos__club_jersey" />
      <p class="player_infos__name">
        {{ player.lastName }}
      </p>
      <div class="player_infos__additionnal">
        <p v-if="player.isCaptain" class="player_infos__additionnal__cap">
          C
        </p>
        <div v-if="player.isSubstitute" class="player_infos__additionnal__substitution">
          <substitution-icon />
        </div>
        <div class="player_infos__additionnal__goals">
          <template v-if="haveFinallyScored">
            <goal-icon v-for="goal in (player.goals - player.savedGoals - player.canceledGoals)" :key="goal" />
          </template>
          <goal-icon v-if="player.goals > 0 && player.canceledGoals > 0" is-canceled />
          <goal-icon v-for="ownGoal in player.ownGoals" :key="ownGoal" is-own-goal />
          <goal-icon v-if="player.mpgGoals" is-mpg-goal :is-canceled="!!player.canceledGoals" />
          <goal-icon v-if="player.savedGoals" is-saved />
        </div>
      </div>
    </td>
    <td class="player__position">
      {{ player.precisePosition }}
    </td>
    <td class="player__rating">
      {{ player.rating || "-" }}
    </td>
    <td class="player__bonus_rating">
      {{ player.bonusRating }}
    </td>
    <td class="player__total_rating" :class="ratingClass">
      {{ player.rating ? player.getTotalScore() : "-" }}
    </td>
  </tr>
</template>

<script setup>
import { computed } from "vue";
import { Player } from "@/models/players/Player";
import GoalIcon from "@/components/icons/GoalIcon.vue";
import SubstitutionIcon from "@/components/icons/SubstitutionIcon.vue";

const props = defineProps({
  player: {
    type: Player,
    required: true,
  },
  playerIndex: {
    type: Number,
    required: true,
  },
});

/**
 * Buts
 */
const haveFinallyScored = computed(() => {
  return props.player.goals - props.player.savedGoals - props.player.canceledGoals > 0;
});

/**
 * Notes
 */
const ratingClass = computed(() => {
  if (! props.player.rating) {
    return "not-played";
  }

  const playerScore = props.player.getTotalScore();
  switch (true) {
  case playerScore > 6.5:
    return "very-good";
  case playerScore > 5.5:
    return "good";
  case playerScore > 4.5:
    return "medium";
  case playerScore > 3.5:
    return "bad";
  default:
    return "very-bad";
  }
});

</script>

<style lang="scss" scoped>
.player_infos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 5px;

  p {
    margin-bottom: 0;
  }

  &__name {
    min-width: 50%;
    flex-grow: 2;
    text-align: left;
  }

  &__additionnal {
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: flex-end;

    &__cap {
      display: flex;
      box-sizing: border-box;
      background-color: rgba(105, 103, 115, 0.4);
      border-radius: 4px;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      font-size: 15px;
      color: rgb(255, 255, 255);
    }

    &__goals {
      margin-left: 10px;
      svg {
        margin-left: -10px;
      }
    }
  }

}

.player {

  &_infos__number,
  &__position,
  &__rating,
  &__bonus_rating {
    color: #959daf;
  }

  &__total_rating {
    display: inline-block;
    box-sizing: border-box;
    border-radius: 24px;
    height: 24px;
    min-width: 24px;
    padding: 0;
    color: #fff;

    &.not-played {
      background-color: #959daf;
    }
    &.very-good {
      background-color: rgb(120, 199, 61);
    }
    &.good {
      background-color: rgb(181, 224, 37);
    }
    &.medium {
      background-color: rgb(224, 201, 72);
    }
    &.bad {
      background-color: rgb(244, 149, 56);
    }
    &.very-bad {
      background-color: rgb(250, 111, 111);
    }
  }
}
</style>