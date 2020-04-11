<template>
    <div class="main">
        <section class="match">
            <MPGTeam :home="true"
                @team-change="updateHomeTeam"
                @score="updateHomeGoals"
                @own-score="updateHomeCSC"
                @averages="updateHomeAverages"
                @goal-stop="updateHomeGoalStop"
                @team-bonus="updateHomeBonus"
                :opponent-bonus="home.opponentBonus"
                :chapron-index="home.chapronIndex"></MPGTeam>
            <MPGTeam :home="false"
                @team-change="updateAwayTeam"
                @score="updateAwayGoals"
                @own-score="updateAwayCSC"
                @averages="updateAwayAverages"
                @goal-stop="updateAwayGoalStop"
                @team-bonus="updateAwayBonus"
                :opponent-bonus="away.opponentBonus"
                :chapron-index="away.chapronIndex"></MPGTeam>
        </section>

        <div class="result">
            <div class="score-probs" v-if="home.bonus.id === 5 || away.bonus.id === 5">
                <p>Pour obtenir les scores probables en appliquand le bonus Chapron Rouge à chacun des joueurs possibles, parametrez les équipes puis cliquez sur le bouton de calcul</p>
                <button @click="applyChapronBonus(undefined)">Calculer les probabilités</button>
                <div class="score-prob" v-if="possibleResults">
                    <p v-for="(resultProb, index) in possibleResults" :key="index">
                        <span>{{resultProb.homeGoals}} - {{resultProb.awayGoals}} ({{resultProb.probability}}%)</span>
                        <span v-for="playerTarget in resultProb.chapronTarget" :key="playerTarget">
                            {{home.team[playerTarget].name}}
                        </span>
                    </p>
                </div>
            </div>
            <div class="score" v-else>
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
                bonus: {
                    id: undefined,
                    target: undefined,
                },
                opponentBonus: {
                    id: undefined,
                    target: undefined,
                },
                chapronIndex: [],
            },
            away: {
                team: [],
                goals: 0,
                csc: 0,
                goalStop: 0,
                averages: [],
                bonus: {
                    id: undefined,
                    target: undefined,
                },
                opponentBonus: {
                    id: undefined,
                    target: undefined,
                },
                chapronIndex: [],
            },
            possibleResults: {},
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
            const valise = this.away.bonus.id === 0 ? 1 : 0;
            return Math.max(0, (this.home.goals - this.away.goalStop - valise)) + this.away.csc + this.mpgGoals.home.length;
        },
        awayGoals: function () {
            const valise = this.home.bonus.id === 0 ? 1 : 0;
            return Math.max(0, (this.away.goals - this.home.goalStop - valise)) + this.home.csc + this.mpgGoals.away.length;
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
        updateHomeBonus: function (bonus) {
            this.home.bonus = bonus;
            this.away.opponentBonus = bonus;
        },
        updateAwayBonus: function (bonus) {
            this.away.bonus = bonus;
            this.home.opponentBonus = bonus;
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
                        const bonus = this.getDribbleMalus(index);
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
        getDribbleMalus: function (index) {
            let bonus = 0;
            if (index === 1) {
                bonus = -1;
            } else if (index > 1) {
                bonus = -((index + 1) * parseFloat(0.5));
            }
            return bonus;
        },
        applyChapronBonus: function (chapronIndex, teamTarget) {
            if (!chapronIndex) {
                this.possibleResults = {};
                teamTarget = "home";
                chapronIndex = 1;
            }
            let self = this;
            if (teamTarget === "home") {
                this.home.chapronIndex = [chapronIndex];
            } else {
                this.away.chapronIndex = [chapronIndex];
            }
            let playerTarget = self[teamTarget].team[chapronIndex].name;

            this.$nextTick().then(function () {
                let probability = 5;
                let score = self.homeGoals + "-" + self.awayGoals;
                if (self.possibleResults[score]) {
                    self.possibleResults[score].chapronTarget.push(playerTarget);
                    self.possibleResults[score].probability += probability;
                } else {
                    self.$set(self.possibleResults, score, {
                        homeGoals: self.homeGoals,
                        awayGoals: self.awayGoals,
                        chapronTarget: [playerTarget],
                        probability: probability,
                    });
                }
                if (chapronIndex < 10) {
                    chapronIndex ++;
                    self.applyChapronBonus(chapronIndex, teamTarget);
                } else if (chapronIndex === 10 && teamTarget === "home") {
                    self.home.chapronIndex = [];
                    chapronIndex = 1;
                    self.applyChapronBonus(chapronIndex, "away");
                } else {
                    self.home.chapronIndex = [];
                    self.away.chapronIndex = [];
                }
            });
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .main {
        padding: 0 5vw;
    }
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
            align-items: center;
        }
    }
</style>
