<template>
  <section class="bonus-swaper">
    <div v-if="team.bonus" class="initial-bonus">
      <bonus-display
        :bonus="team.bonus"
        :reverse-display="reverseDisplay"
        :class="{
          'bonus--selected': selectedBonusValue === team.bonus.value,
        }"
        title="Bonus initial"
        @click="showBonusList = !showBonusList"
      />
      <button class="btn btn-link btn-sm do-not-share" data-bs-toggle="button" @click="showBonusList = !showBonusList">
        Changer le bonus
      </button>
    </div>

    <div v-if="showBonusList" class="do-not-share">
      <p v-if="initialBonus.value === 'fourStrikers'" class="rating-disclaimer alert alert-warning mt-3" role="alert">
        Le bonus 4-Decat ne peut pas être supprimé. Il n'est pas possible d'imaginer le match avec un autre bonus.
      </p>
      <ul v-else class="available-bonuses mt-3">
        <li
          class="bonus initial-bonus"
          :class="{
            'bonus--selected': selectedBonusValue === initialBonus.value,
          }"
          @click="selectBonus(initialBonus)"
        >
          <div class="bonus__logo" :style="{ 'backgroundImage': `url(${initialBonus.icon}`}" />
        </li>
        <div class="vr" />
        <li
          v-for="availableBonus in availableBonuses"
          :key="availableBonus.value"
          class="bonus"
          :class="{
            'bonus--selected': selectedBonusValue === availableBonus.value,
            'bonus--disabled': notManagedBonus.includes(availableBonus.value),
          }"
          @click="selectBonus(availableBonus)"
        >
          <div class="bonus__logo" :style="{ 'backgroundImage': `url(${availableBonus.icon}`}" />
        </li>
      </ul>

      <div v-if="choosePlayer" class="mt-2">
        <select
          v-model="targetPlayer"
          class="form-select"
          aria-label="Default select example"
          @change="selectBonus(new BONUSES['boostOnePlayer'])"
        >
          <option selected>
            Choisissez un joueur cible
          </option>
          <option v-for="player in players" :key="player.playerId" :value="player.playerId">
            {{ player.lastName }}
          </option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Team } from "@/models/teams/Team";
import { BONUSES } from "@/constants/bonus";
import BonusDisplay from "@/components/bonus/BonusDisplay.vue";

const props = defineProps({
  team: {
    type: Team,
    required: true,
  },
  reverseDisplay: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["change-bonus"]);

/**
 * Bonus initial
 */
const initialBonus = ref();
onMounted(() => {
  initialBonus.value = new BONUSES[props.team.bonus.value || "none"]();
});

/**
 * Liste des bonus
 */
const notManagedBonus = ["fourStrikers"];
const availableBonuses = computed(() => {
  const bonuses = Object.keys(props.team.availableBonuses);
  bonuses.push("none");
  return bonuses.filter(bonus => props.team.availableBonuses[bonus] || bonus === "none")
    .filter(bonus => initialBonus.value.value !== bonus)
    .map(bonus => new BONUSES[bonus]());
});
const showBonusList = ref(false);

/**
 * Gestion du bonus UberEat
 */
const choosePlayer = ref(props.team.bonus.value === "boostOnePlayer");
const players = computed(() => {
  const pitchPlayersCopy = [...props.team.pitchPlayers];
  return pitchPlayersCopy.splice(1, 10).filter(player => ! player.isCaptain);
});
const targetPlayer = ref(props.team.bonus.playerId);

/**
 * Gestion du bonus sélectionné
 */
const selectedBonusValue = computed(() => props.team.bonus.value);
const selectBonus = (bonus) => {

  if (notManagedBonus.includes(bonus.value)) {
    return;
  }

  choosePlayer.value = false;
  if (bonus.value === "boostOnePlayer") {
    choosePlayer.value = true;
    if (targetPlayer.value) {
      bonus.playerId = targetPlayer.value;
    } else {
      targetPlayer.value = initialBonus.value.bonus.playerId;
      return;
    }
  }

  emits("change-bonus", bonus);
};
</script>

<style lang="scss" scoped>
.initial-bonus {
    flex-direction: column;
}
.initial-bonus,
.available-bonuses {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style: none;
  gap: 1vw;

  .bonus {
    cursor: pointer;
    transition: filter 0.2s ease-in-out;
    filter: grayscale(100%);

    &--selected,
    &:hover {
      filter: grayscale(0%);
    }

    &--disabled {
      cursor: not-allowed;
      filter: grayscale(100%);

      &:hover {
        filter: grayscale(100%);
      }
    }

    .bonus__logo {
      height: 57px ;
      width: 44px;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
</style>