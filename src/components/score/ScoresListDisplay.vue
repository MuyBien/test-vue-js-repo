<template>
  <section class="score_probabilities">
    <p class="score_probabilities__help">
      Le bonus Chapron Rouge enlève un joueur au hasard parmi les 20 joueurs de champ.
      Le score ne peut donc pas être prédit à 100%.
      Le score après remplacement de chaque joueur par un Rotaldo a été calculé et les scores possibles aisni que leur probabilité sont affichés.
    </p>

    <scores-probabilities-display :matches="allPossiblesMatches" />

    <table class="table table-striped table-hover mt-3">
      <caption>Liste des résultats possibles selon le joueur ciblé par le bonus Chapron Rouge</caption>
      <thead>
        <tr>
          <th scope="col">
            Rotaldo appliqué à
          </th>
          <th scope="col">
            Score
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(possibleMatch, index) in allPossiblesMatches" :key="possibleMatch.id + index">
          <td scope="row">
            {{ getPlayerSubstituted(possibleMatch) }}
          </td>
          <td scope="row">
            <score-display
              :home-team="possibleMatch.homeTeam"
              :away-team="possibleMatch.awayTeam"
              :score="possibleMatch.score"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed } from "vue";
import ScoresProbabilitiesDisplay from "@/components/score/ScoresProbabilitiesDisplay.vue";

import { Match } from "@/models/match/Match";
import { multipleResultMatchCalculator } from "@/utils/match/multipleResultMatchCalculator";

import ScoreDisplay from "@/components/score/ScoreDisplay.vue";

const props = defineProps({
  match: {
    type: Match,
    required: true,
  },
});

/**
 * Gestion des différents scénarios
 */
const allPossiblesMatches = computed(() => {
  return multipleResultMatchCalculator(props.match);
});

const getPlayerSubstituted = (match) => {
  const players = [];

  if (match.homeTeam.bonus.value === "removeRandomPlayer") {
    const targetTeam = match.homeTeam.bonus.team === "team" ? match.homeTeam : match.awayTeam;
    players.push(targetTeam.pitchPlayers[match.homeTeam.bonus.position].substitued.lastName);
  }

  if (match.awayTeam.bonus.value === "removeRandomPlayer") {
    const targetTeam = match.awayTeam.bonus.team === "team" ? match.awayTeam : match.homeTeam;
    players.push(targetTeam.pitchPlayers[match.awayTeam.bonus.position].substitued.lastName);
  }

  return players.join(" et ");
};
</script>

<style scoped lang="scss">
.score_probabilities__help {
  font-size: .8em;
}
th {
  font-weight: bold;
}
</style>