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
        <tr v-for="possibleMatch in allPossiblesMatches" :key="possibleMatch[0]">
          <td scope="row">
            {{ getPlayerSubstituted(possibleMatch[0]) }}
          </td>
          <td scope="row">
            <score-display
              :home-team="possibleMatch[1].homeTeam"
              :away-team="possibleMatch[1].awayTeam"
              :score="possibleMatch[1].score"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
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
const allPossiblesMatches = Array.from(multipleResultMatchCalculator(props.match));
const getPlayerSubstituted = (data) => {
  const teamTarget = Object.keys(data)[0] === "home" ? props.match.homeTeam : props.match.awayTeam;
  const position = Object.values(data)[0];

  return teamTarget.pitchPlayers[position].lastName;
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