<template>
    <section class="match">
        <MPGTeam :home="true"
            @team-change="updateHomeTeam"
            @score="updateHomeGoals"
            @own-score="updateHomeCSC"
            @averages="updateHomeAverages"></MPGTeam>
        <MPGTeam :home="false"
            @team-change="updateAwayTeam"
            @score="updateAwayGoals"
            @own-score="updateAwayCSC"
            @averages="updateAwayAverages"></MPGTeam>
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
                averages: [],
            },
            away: {
                team: [],
                goals: 0,
                csc: 0,
                averages: [],
            },
        };
    },
    components: {
        MPGTeam,
    },
    computed: {
        mpgGoals: function () {
            return {
                home: this.getTeamMpgGoals(this.home.team, this.away.averages, true),
                away: this.getTeamMpgGoals(this.away.team, this.home.averages, false),
            };
        },
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
        updateHomeAverages: function (averages) {
            this.home.averages = averages;
        },
        updateAwayAverages: function (averages) {
            this.away.averages = averages;
        },
        getTeamMpgGoals: function (team, averages, isHome) {
            const linesToPass = {
                forward: ["backer", "goalkeeper",],
                middle: ["middle", "backer", "goalkeeper",],
                backer: ["forward", "middle", "backer", "goalkeeper",],
            };

            let mpgGoals = [];
            team.forEach(function (player) {
                let mpgGoal = false;
                const finalPlayer = player.substitution ? player.substitution : player;
                if (finalPlayer.position && finalPlayer.position !== "goalkeeper" && finalPlayer.goals < 1 && finalPlayer.csc < 1) {
                    mpgGoal = linesToPass[finalPlayer.position].every(function (lineToPass, index) {
                        const malus = this.getMalus(index);
                        const playerNote = finalPlayer.note - malus;
                        if (isHome) {
                            return playerNote >= averages[lineToPass];
                        } else {
                            return playerNote > averages[lineToPass];
                        }
                    }, this);
                }
                if (mpgGoal) {
                    mpgGoals.push(player.index);
                }
            }, this);
            return mpgGoals;
        },
        getMalus: function (index) {
            let malus = 0;
            if (index === 1) {
                malus = 1;
            } else if (index > 1) {
                malus = 1 + (index - 1) * parseFloat(0.5);
            }
            return malus;
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
