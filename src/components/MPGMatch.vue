<template>
    <section class="match">
        <MPGTeam :home="true"
            @team-change="updateHomeTeam"
            @score="updateHomeGoals"
            @own-score="updateHomeCSC"></MPGTeam>
        <MPGTeam :home="false"
            @team-change="updateAwayTeam"
            @score="updateAwayGoals"
            @own-score="updateAwayCSC"></MPGTeam>
    </section>
</template>

<script>
import MPGTeam from "../components/MPGTeam.vue";

export default {
    name: "MPGMatch",
    data: function () {
        return {
            home: {
                team: [],
                goals: 0,
                csc: 0,
            },
            away: {
                team: [],
                goals: 0,
                csc: 0,
            },
        };
    },
    components: {
        MPGTeam,
    },
    methods: {
        updateHomeTeam: function (team) {
            this.home.team = team;
        },
        updateAwayTeam: function (team) {
            this.away.team = team;
        },
        updateHomeGoals: function (goals) {
            this.home.goals = goals;
        },
        updateAwayGoals: function (goals) {
            this.away.goals = goals;
        },
        updateHomeCSC: function (csc) {
            this.home.csc = csc;
        },
        updateAwayCSC: function (csc) {
            this.away.csc = csc;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .match {
        display: flex;
        justify-content: space-around;
    }
</style>
