<template>
  <section class="tournament-match-winner">
    <h3>Équipe qualifiée pour le tour suivant :</h3>
    <p class="team">
      <span class="team__name">{{ match.getQualified().name }}</span>
    </p>
    <section class="teams-averages">
      <p class="teams-averages__description">
        En cas de match nul, l’équipe avec la meilleure moyenne remporte le match
      </p>
      <div class="teams-averages__team" :class="getRatingClass(homeTeamAverage)">
        {{ homeTeamAverage }}
      </div>
      <hr>
      <div class="teams-averages__team" :class="getRatingClass(awayTeamAverage)">
        {{ awayTeamAverage }}
      </div>
    </section>
  </section>
</template>

<script setup>
import { TournamentMatch } from "@/models/TournamentMatch";

const props = defineProps({
  match: {
    type: TournamentMatch,
    required: true,
  },
});

const homeTeamAverage = props.match.homeTeam.getTeamAverage();
const awayTeamAverage = props.match.awayTeam.getTeamAverage();
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
  }

  .teams-averages {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    --dot-size: 80px;

  &__description {
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