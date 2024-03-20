<template>
  <p class="player">
    <span class="player_infos__name">
      {{ player.lastName }}
    </span>
    <span class="player_infos__additionnal__goals">
      <goals-display :player="player" />
    </span>
    <span class="player__total_rating">
      {{ player.rating ? player.getTotalScore() : "-" }}
      <span v-if="player.isAverageRating" class="player__total_rating__status player__total_rating__status--average">M</span>
      <span v-if="player.isLiveRating" class="player__total_rating__status player__total_rating__status--live" />
    </span>
    <span class="player__substitution_icon">
      <substitution-icon is-out />
    </span>
  </p>
</template>

<script setup>
import GoalsDisplay from "@/components/goals/GoalsDisplay.vue";
import SubstitutionIcon from "@/components/icons/SubstitutionIcon.vue";
import { Player } from "@/models/players/Player";

defineProps({
  player: {
    type: Player,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.player {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  column-gap: 5px;
  font-size: .6em;

  &_infos__name {
    color: #959daf;
  }

  &_infos__additionnal__goals {
    margin-left: 10px;
  }

  &__total_rating {
    position: relative;
    display: inline-block;
    text-align: center;
    box-sizing: border-box;
    border-radius: 16px;
    height: 14px;
    min-width: 14px;
    padding: 0;
    color: #fff;
    background-color: #959daf;

    &__status {
      position: absolute;
      top: 0;
      right: - 5px;
      font-size: 0.6em;
      font-weight: bold;
      border-radius: 100%;
      width: 10px;
      height: 10px;
      line-height: 10px;
      text-align: center;
      padding: 0;

      &--average {
        background-color: var(--bs-yellow);
        color: #333;
        top: -5px;
      }

      &--live {
        background-color: var(--bs-red);
        color: #fff;
        width: 4px;
        height: 4px;
        animation: blink 2s infinite;
      }
    }

    @keyframes blink {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
  }

  &__substitution_icon {
    position: absolute;
    right:-17px;
  }

}
</style>