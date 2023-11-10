<template>
  <section class="tournament-match-winner">
    <h3>Équipe qualifiée pour le tour suivant :</h3>
    <p class="team">
      <span class="team__emoji--left">🎉</span>
      <span class="team__name">{{ match.getQualified()?.name || "Par tirage au sort" }}</span>
      <span class="team__emoji--right">🎉</span>
    </p>
    <section v-if="needTeamAverageComparaison" class="teams-averages">
      <p class="teams-averages__description">
        En cas de match nul, l’équipe avec la meilleure moyenne remporte le match (les bonus défensifs ne sont pas pris en compte dans ce calcul).
      </p>
      <div class="teams-averages__team" :class="getRatingClass(homeTeamAverage)">
        {{ homeTeamAverage }}
      </div>
      <hr>
      <div class="teams-averages__team" :class="getRatingClass(awayTeamAverage)">
        {{ awayTeamAverage }}
      </div>
    </section>
    <section v-if="needLineAverageComparaison">
      <p class="teams-averages__description mb-3">
        En cas d'égalité à la moyenne générale, les moyennes ligne par ligne sont comparées depuis l'attaque jusqu'au gardien.
      </p>
      <ul class="averages-list">
        <li v-for="(average, index) in homeTeamLinesAverages" :key="average" class="teams-averages">
          <template v-if="averageNeeded(index)">
            <p class="teams-averages__description">
              Moyenne {{ lines[index] }}
            </p>
            <div class="teams-averages__team" :class="getRatingClass(average)">
              {{ average }}
            </div>
            <hr>
            <div class="teams-averages__team" :class="getRatingClass(awayTeamLinesAverages[index])">
              {{ awayTeamLinesAverages[index] }}
            </div>
          </template>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { Match } from "@/models_refactored/match/Match";
import { calculateTournamentTeamAverage, calculatePositionsAverages } from "@/utils/averages/averageCalculator";

const props = defineProps({
  match: {
    type: Match,
    required: true,
  },
});

/**
 * Global average comparaison
 */
const needTeamAverageComparaison = props.match.score[0] === props.match.score[1];
const homeTeamAverage = calculateTournamentTeamAverage(props.match.homeTeam, true);
const awayTeamAverage = calculateTournamentTeamAverage(props.match.awayTeam, true);

/**
 * Line to line average comparaison
 */
const needLineAverageComparaison = homeTeamAverage === awayTeamAverage;
const lines = ["de l'attaque", "du milieu", "de la défense", "du gardien"];
const homeTeamLinesAverages = calculatePositionsAverages(props.match.homeTeam).reverse();
const awayTeamLinesAverages = calculatePositionsAverages(props.match.awayTeam).reverse();
const averageNeeded = (index) => {
  if (index) {
    return homeTeamLinesAverages[index - 1] === awayTeamLinesAverages[index - 1];
  }
  return true;
};

/**
 * Average colors
 */
const getRatingClass = (average) => {
  switch (true) {
  case average > 6.5:
    return "very-good";
  case average > 5.5:
    return "good";
  case average > 4.5:
    return "medium";
  case average > 3.5:
    return "bad";
  default:
    return "very-bad";
  }
};
</script>

<style scoped lang="scss">
.tournament-match-winner {
  h3 {
    font-size: medium;
    text-align: left;
  }
  .team {
    font-size: 2em;
    &__name {
      margin: 0 10px;
    }
    &__emoji {
      &--right {
        display: inline-block;
        transform: scale(-1, 1);
      }
    }
  }

  .averages-list {
    padding: 0;
  }

  .teams-averages {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-bottom: 3vh;
    --dot-size: 80px;

  &__description {
    margin-bottom: 0;
    width: 100%;
    font-size: .8em;
  }

  &__team {
      width: var(--dot-size);
      height: var(--dot-size);
      line-height: var(--dot-size);
      color: #fff;
      font-size: large;
      font-weight: bold;
      border-radius: 50px;
      margin: 0 15px;

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

    hr {
      height: calc(var(--dot-size) + 10px);
      border: 1px dashed #333;
    }
  }
}
</style>