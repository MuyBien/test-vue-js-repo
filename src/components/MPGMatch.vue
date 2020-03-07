<template>
    <div class="main">
        <section class="match">
            <MPGTeam :home="true"
                @team-change="updateHomeTeam"
                @score="updateHomeGoals"
                @own-score="updateHomeCSC"
                @averages="updateHomeAverages"
                @goal-stop="updateHomeGoalStop"></MPGTeam>
            <MPGTeam :home="false"
                @team-change="updateAwayTeam"
                @score="updateAwayGoals"
                @own-score="updateAwayCSC"
                @averages="updateAwayAverages"
                @goal-stop="updateAwayGoalStop"></MPGTeam>
        </section>

        <div class="result">
            <div class="score">
                <p class="team-score" :class="{winner: homeWinner}">{{homeGoals}}</p>
                <p class="team-score" :class="{winner: awayWinner}">{{awayGoals}}</p>
            </div>
            <div class="final-teams">
                <MPGResultTeam :final-team="home.team" :team-goals="home.goals" :opponent-csc="away.csc" :mpg-goals="mpgGoals.home"></MPGResultTeam>
                <MPGResultTeam :final-team="away.team" :team-goals="away.goals" :opponent-csc="home.csc" :mpg-goals="mpgGoals.away"></MPGResultTeam>
            </div>
        </div>

    </div>
</template>

<script>
import MPGTeam from "../components/MPGTeam.vue";
import MPGResultTeam from "../components/MPGResultTeam.vue";

export default {
    name: "MPGMatch",
    data: function () {
        return {
            home: {
                team: [],
                goals: 0,
                csc: 0,
                goalStop: 0,
                averages: [],
            },
            away: {
                team: [],
                goals: 0,
                csc: 0,
                goalStop: 0,
                averages: [],
            },
        };
    },
    components: {
        MPGTeam,
        MPGResultTeam,
    },
    computed: {
        mpgGoals: function () {
            return {
                home: this.getTeamMpgGoals(this.home.team, this.away.averages, true),
                away: this.getTeamMpgGoals(this.away.team, this.home.averages, false),
            };
        },
        homeGoals: function () {
            return Math.max(0, (this.home.goals - this.away.goalStop)) + this.away.csc + this.mpgGoals.home.length;
        },
        awayGoals: function () {
            return Math.max(0, (this.away.goals - this.home.goalStop)) + this.home.csc + this.mpgGoals.away.length;
        },
        homeWinner: function () {
            return this.homeGoals > this.awayGoals;
        },
        awayWinner: function () {
            return this.homeGoals < this.awayGoals;
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
        updateHomeGoalStop: function (goalStop) {
            this.home.goalStop = goalStop;
        },
        updateAwayGoalStop: function (goalStop) {
            this.away.goalStop = goalStop;
        },
        getTeamMpgGoals: function (team, averages, isHome) {
            const linesToPass = {
                forward: ["backer", "goalkeeper"],
                middle: ["middle", "backer", "goalkeeper"],
                backer: ["forward", "middle", "backer", "goalkeeper"],
            };

            let mpgGoals = [];
            team.forEach(function (player) {
                let mpgGoal = false;
                const finalPlayer = player.substitution ? player.substitution : player;
                if (finalPlayer.position && finalPlayer.note >= 5 && finalPlayer.position !== "goalkeeper" && finalPlayer.goals < 1) {
                    mpgGoal = linesToPass[finalPlayer.position].every(function (lineToPass, index) {
                        const bonus = this.getBonus(index);
                        const playerNote = finalPlayer.note + bonus;
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
        getBonus: function (index) {
            let bonus = 0;
            if (index === 1) {
                bonus = -1;
            } else if (index > 1) {
                bonus = -((index + 1) * parseFloat(0.5));
            }
            return bonus;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .match {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
    }
    .score {
        display: flex;
        justify-content: center;
        .team-score {
            border: 1px solid #333;
            display: inline-block;
            padding: 20px 25px;
            margin-right: 5px;
            border-radius: 5px;
            font-size: 2em;
            font-weight: bold;
            &.winner {
                border-bottom: 10px solid #45c945;
            }
        }
    }
    .final-teams {
        display: flex;
        justify-content: space-around;
        margin-bottom: 50px;
    }

    @media screen and (max-width: 1300px) {
        .match {
            flex-direction: column;
        }
    }
</style>
