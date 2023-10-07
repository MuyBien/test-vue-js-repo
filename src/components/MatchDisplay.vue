<template>
  <div class="accordion">
    <div class="accordion-item">
      <h2 id="headingOne" class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="`#${match.id}-live-players`"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <span>Résultat en live :</span>
          <span class="team home">
            {{ liveMatch.home.name }}
          </span>
          <span class="score">
            {{ liveMatch.home.score }}
            -
            {{ liveMatch.away.score }}
          </span>
          <span class="team home">{{ liveMatch.away.name }}</span>
        </button>
      </h2>
      <div
        :id="`${match.id}-live-players`"
        class="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body row">
          <div class="col-6">
            <team-display :players="match.homeTeam.starters" />
          </div>
          <div class="col-6">
            <team-display :players="match.awayTeam.starters" />
          </div>
        </div>
      </div>
    </div>

    <div class="accordion-item">
      <h2 id="headingTwo" class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="`#${match.id}-calculated-players`"
          aria-expanded="false"
          aria-controls="collapseTwo"
        >
          <span>Résultat après RT et calcul des buts MPG :</span>
          <span class="team home">
            {{ liveMatch.home.name }}
          </span>
          <span class="score">
            {{ match.getFinalScore().join(" - ") }}
          </span>
          <span class="team home">{{ liveMatch.away.name }}</span>
        </button>
      </h2>
      <div
        :id="`${match.id}-calculated-players`"
        class="accordion-collapse collapse"
        aria-labelledby="headingTwo"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body row">
          <div class="col-6">
            <team-display :players="match.homeTeam.getFinalPlayers()" :mpg-goals="match.mpgGoals.homeTeam" :goalkeeper-saves="match.goalkeeperSaves.homeTeam" />
          </div>
          <div class="col-6">
            <team-display :players="match.awayTeam.getFinalPlayers()" :mpg-goals="match.mpgGoals.awayTeam" :goalkeeper-saves="match.goalkeeperSaves.awayTeam" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMPG } from "@/use/useMPG";
import { ref } from "vue";

import TeamDisplay from "@/components/TeamDisplay.vue";

const props = defineProps({
  liveMatch: {
    type: Object,
    required: true,
  },
});

const { getMatchData } = useMPG();

const match = ref("");
match.value = await getMatchData(props.liveMatch.id);
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}

.match {
  display: flex;
  width: 100%;
  align-items: center;
  cursor: pointer;
  .team {
    display: flex;
    margin: 0 10px;
    white-space: pre-wrap;
    font-size: 15px;
  }
  .score {
    display: flex;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    color: rgb(232, 30, 41);
    background: rgba(232, 30, 41, 0.08);
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;;
  }
}</style>