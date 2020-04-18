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
            <MPGScore
                :home-goals="homeGoals"
                :away-goals="awayGoals"
                :home-bonus="home.bonus.id"
                :away-bonus="away.bonus.id"
                :possible-results="possibleResults"
                @computeChapron="applyChapronBonus"
                @computeMultipleChapron="applyMultipleChapronBonus">
            </MPGScore>
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
import MPGScore from "../components/MPGScore.vue";

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
            chapronPromiseResolve: undefined,
        };
    },
    components: {
        MPGTeam,
        MPGResultTeam,
        MPGScore,
    },
    computed: {
        mpgGoals: function () {
            return {
                home: this.getTeamMpgGoals(this.home.team, this.away.averages, true),
                away: this.getTeamMpgGoals(this.away.team, this.home.averages, false),
            };
        },
        homeGoals: function () {
            const valise = (this.away.bonus.id === 6 && this.home.bonus.id === 0) || (this.away.bonus.id === 0 && this.home.bonus.id !== 6) ? 1 : 0;
            return Math.max(0, (this.home.goals - this.away.goalStop - valise)) + this.away.csc + this.mpgGoals.home.length;
        },
        awayGoals: function () {
            const valise = (this.home.bonus.id === 6 && this.away.bonus.id === 0) || (this.home.bonus.id === 0 && this.away.bonus.id !== 6) ? 1 : 0;
            return Math.max(0, (this.away.goals - this.home.goalStop - valise)) + this.home.csc + this.mpgGoals.away.length;
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
            return new Promise((resolve) => {
                if (!chapronIndex) {
                    this.possibleResults = {};
                    teamTarget = "home";
                    chapronIndex = 1;
                    this.chapronPromiseResolve = resolve;
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
                        self.chapronPromiseResolve();
                    }
                });
            });
        },
        applyMultipleChapronBonus: function (chapronIndex, teamTarget, chapronIndex2, teamTarget2) {
            return new Promise((resolve) => {
                if (!chapronIndex) {
                    this.possibleResults = {};
                    teamTarget = "home";
                    chapronIndex = 1;
                    teamTarget2 = "home";
                    chapronIndex2 = 2;
                    this.chapronPromiseResolve = resolve;
                }
                this[teamTarget].chapronIndex = [chapronIndex];
                if (teamTarget === teamTarget2) {
                    this[teamTarget2].chapronIndex.push(chapronIndex2);
                } else {
                    this[teamTarget2].chapronIndex = [chapronIndex2];
                }

                let impossibleState = false;
                let playerTarget = this[teamTarget].team[chapronIndex];
                let playerTarget2 = this[teamTarget2].team[chapronIndex2];
                if (playerTarget.name === "Rotaldo" || (typeof playerTarget.substitution !== "undefined" && playerTarget.substitution.name === "Rotaldo")) {
                    impossibleState = true;
                }
                if (playerTarget2.name === "Rotaldo" || (typeof playerTarget2.substitution !== "undefined" && playerTarget2.substitution.name === "Rotaldo")) {
                    impossibleState = true;
                }
                if (playerTarget === playerTarget2) {
                    impossibleState = true;
                }

                let self = this;
                this.$nextTick().then(function () {
                    if (!impossibleState) {
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
                                self.chapronPromiseResolve();
                            }
                        }
                    });
                });
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
