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
                <div class="chapron-help">
                    <p>Pour obtenir les scores possibles, paramétrez les équipes puis cliquez sur le bouton de calcul.</p>
                    <p>Les probabilités doivent être recalculées à chaque changement !</p>
                </div>
                <button v-if="home.bonus.id === 5 && away.bonus.id === 5"  @click="applyMultipleChapronBonus(undefined)">Calculer les probabilités</button>
                <button v-else @click="applyChapronBonus(undefined)">Calculer les probabilités</button>
                <div class="score-prob" v-if="possibleResults">
                    <div class="score most-probable" v-if="mostProbResult">
                        <p class="team-score" :class="{winner: mostProbResult.homeGoals > mostProbResult.awayGoals}">{{mostProbResult.homeGoals}}</p>
                        <p class="team-score" :class="{winner: mostProbResult.awayGoals > mostProbResult.homeGoals}">{{mostProbResult.awayGoals}}</p>
                        <p class="score-probability" :title="mostProbResult.chapronTarget.join(', ')">{{getScoreProbability(mostProbResult.score)}}%</p>
                    </div>
                    <div class="other-scores">
                        <div class="score" v-for="(resultProb, index) in otherPossibleResults" :key="index">
                            <p class="team-score" :class="{winner: resultProb.homeGoals > resultProb.awayGoals}">{{resultProb.homeGoals}}</p>
                            <p class="team-score" :class="{winner: resultProb.awayGoals > resultProb.homeGoals}">{{resultProb.awayGoals}}</p>
                            <p class="score-probability" :title="resultProb.chapronTarget.join(', ')">{{getScoreProbability(resultProb.score)}}%</p>
                        </div>
                    </div>
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
        orderedPossibleResults: function () {
            return Object.values(this.possibleResults).sort(function (a, b) {
                return b.chapronTarget.length - a.chapronTarget.length;
            });
        },
        mostProbResult: function () {
            if (this.orderedPossibleResults.length) {
                return this.orderedPossibleResults[0];
            }
            return;
        },
        otherPossibleResults: function () {
            if (this.orderedPossibleResults.length) {
                return this.orderedPossibleResults.slice(1, this.orderedPossibleResults.length);
            }
            return;
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

            this[teamTarget].chapronIndex = [chapronIndex];
            let isRotaldo = false;
            let playerTarget = this[teamTarget].team[chapronIndex];
            if (playerTarget.name === "Rotaldo" || (typeof playerTarget.substitution !== "undefined" && playerTarget.substitution.name === "Rotaldo")) {
                isRotaldo = true;
            }

            let self = this;
            this.$nextTick().then(function () {
                if (!isRotaldo) {
                    let score = self.homeGoals + "-" + self.awayGoals;
                    if (self.possibleResults[score]) {
                        self.possibleResults[score].chapronTarget.push(playerTarget.name);
                    } else {
                        self.$set(self.possibleResults, score, {
                            homeGoals: self.homeGoals,
                            awayGoals: self.awayGoals,
                            score: score,
                            chapronTarget: [playerTarget.name],
                        });
                    }
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
        applyMultipleChapronBonus: function (chapronIndex, teamTarget, chapronIndex2, teamTarget2) {
            if (!chapronIndex) {
                this.possibleResults = {};
                teamTarget = "home";
                chapronIndex = 1;
                teamTarget2 = "home";
                chapronIndex2 = 2;
            }

            this[teamTarget].chapronIndex = [chapronIndex];
            if (teamTarget === teamTarget2) {
                this[teamTarget2].chapronIndex.push(chapronIndex2);
            } else {
                this[teamTarget2].chapronIndex = [chapronIndex2];
            }
            let isRotaldo = false;
            let playerTarget = this[teamTarget].team[chapronIndex];
            let playerTarget2 = this[teamTarget2].team[chapronIndex2];
            if (playerTarget.name === "Rotaldo" || (typeof playerTarget.substitution !== "undefined" && playerTarget.substitution.name === "Rotaldo")) {
                isRotaldo = true;
            }
            if (playerTarget2.name === "Rotaldo" || (typeof playerTarget2.substitution !== "undefined" && playerTarget2.substitution.name === "Rotaldo")) {
                isRotaldo = true;
            }

            let self = this;
            this.$nextTick().then(function () {
                if (!isRotaldo) {
                    let score = self.homeGoals + "-" + self.awayGoals;
                    if (self.possibleResults[score]) {
                        self.possibleResults[score].chapronTarget.push([playerTarget.name, playerTarget2.name].join(" et "));
                    } else {
                        self.$set(self.possibleResults, score, {
                            homeGoals: self.homeGoals,
                            awayGoals: self.awayGoals,
                            score: score,
                            chapronTarget: [[playerTarget.name, playerTarget2.name].join(" et ")],
                        });
                    }
                }

                self.home.chapronIndex = [];
                self.away.chapronIndex = [];
                self.$nextTick().then(function () {
                    if (chapronIndex2 < 10) {
                        chapronIndex2 ++;
                        self.applyMultipleChapronBonus(chapronIndex, teamTarget, chapronIndex2, teamTarget2);
                    } else if (chapronIndex2 === 10 && teamTarget2 === "home") {
                        chapronIndex2 = 1;
                        self.applyMultipleChapronBonus(chapronIndex, teamTarget, chapronIndex2, "away");
                    } else {
                        if (chapronIndex < 10) {
                            chapronIndex ++;
                            self.applyMultipleChapronBonus(chapronIndex, teamTarget, 1, "home");
                        } else if (chapronIndex === 10 && teamTarget === "home") {
                            chapronIndex = 1;
                            self.applyMultipleChapronBonus(chapronIndex, "away", 1, "home");
                        } else {
                            self.home.chapronIndex = [];
                            self.away.chapronIndex = [];
                        }
                    }
                });
            });
        },
        getScoreProbability: function (score) {
            let scoreOccurences = this.possibleResults[score].chapronTarget.length;
            let scoreTotal = 0;
            for (let obj of Object.entries(this.possibleResults)) {
                scoreTotal += obj[1].chapronTarget.length;
            }
            return Math.round((scoreOccurences * 100) / scoreTotal);
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

    button {
        margin: 0 5px;
        border: none;
        background-color: #4054cc;
        padding: 5px 10px;
        outline: none;
        border-radius: 3px;
        color: #fff;
        font-size: .8rem;
        cursor: pointer;
    }
    button:hover {
        background-color: #4460a0;
    }

    .score {
        position: relative;
        display: flex;
        justify-content: center;
        .team-score {
            border: 1px solid #333;
            display: inline-block;
            padding: 20px 25px;
            margin: 15px 5px 15px 0px;
            border-radius: 5px;
            font-size: 2em;
            font-weight: bold;
            &.winner {
                border-bottom: 10px solid #45c945;
            }
        }

        p.score-probability {
            position: absolute;
            bottom: calc(50% - 20px);
            margin: 0;
            padding: 5px;
            border-radius: 50%;
            font-size: .8em;
            text-align: center;
            line-height: 20px;
            background-color: #4054cb;
            color: #fff;
            font-weight: bold;
            cursor: help;
        }
    }

    .other-scores {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .score {
            margin: 0 20px;
            p.team-score {
                font-size: 1em;
                padding: 15px 18px;
            }
            p.score-probability {
                font-size: 0.6em;
                bottom: calc(50% - 15px);
                line-height: 15px;
            }
        }
    }

    .chapron-help {
        width: 60%;
        margin: 5px auto;
        background-color: #4054cc78;
        color: #fff;
        border-radius: 5px;
        padding: 5px 2px;
        font-size: .8em;
        line-height: .6em;
        p:last-child {
            font-weight: bold;
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
