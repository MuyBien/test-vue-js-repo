<template>
  <div class="team">
      <h2>
          <span v-if="home">🏠 Équipe à domicile</span>
          <span v-else>🛫 Équipe à l'extérieur</span>
      </h2>

      <h3>Titulaires</h3>
      <ul>
        <li v-for="starter in starters" :key="'starter' + starter.index">
            <MPGPlayer :index="starter.index" :position="starter.position" @select="selectStarter"></MPGPlayer>
        </li>
      </ul>

      <h3>Remplaçants</h3>
      <ul>
        <li v-for="substitute in substitutes" :key="'sub' + substitute.index">
            <MPGPlayer :index="substitute.index" :position="substitute.position" @select="selectSubstitute"></MPGPlayer>
        </li>
      </ul>

      <h3>Remplacements</h3>
      <ul>
        <li v-for="substitution in substitutions" :key="'substitution' + substitution.index">
            <MPGSubstitution :index="substitution.index" :substitution="substitution" @select="defineSubstitution"></MPGSubstitution>
        </li>
      </ul>

  </div>
</template>

<script>
import MPGPlayer from "@/components/MPGPlayer.vue";
import MPGSubstitution from "@/components/MPGSubstitution.vue";

export default {
    name: "MPGTeam",
    components: {
        MPGPlayer,
        MPGSubstitution,
    },
    props: {
        home: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data: function () {
        let starters = [];
        for (let i = 0; i < 11; i++) {
            starters.push({
                index: i,
                position: "",
                note: undefined,
                goals: 0,
                csc: 0,
            });
        }
        let substitutes = [];
        for (let i = 0; i < 7; i++) {
            substitutes.push({
                index: i,
                position: "",
                note: undefined,
                goals: 0,
                csc: 0,
            });
        }
        let substitutions = [];
        for (let i = 0; i < 5; i++) {
            substitutions.push({
                index: i,
                starter: "",
                substitute: "",
                note: undefined,
            });
        }
        return {
            starters: starters,
            substitutes: substitutes,
            substitutions: substitutions,
        };
    },
    methods: {
        selectStarter: function (index, player) {
            this.starters[index].position = player.position;
            this.starters[index].note = player.note;
            this.starters[index].goals = player.goals;
            this.starters[index].csc = player.csc;
        },
        selectSubstitute: function (index, player) {
            this.substitutes[index].position = player.position;
            this.substitutes[index].note = player.note;
            this.substitutes[index].goals = player.goals;
            this.substitutes[index].csc = player.csc;
        },
        defineSubstitution: function (index, substitution) {
            this.substitutions[index].starter = substitution.starter;
            this.substitutions[index].substitute = substitution.substitute;
            this.substitutions[index].note = substitution.note;
        },
        getGoals: function (finalTeam) {
            return finalTeam.reduce(function (teamGoals, player) {
                if (player.substitution) {
                    return teamGoals + parseInt(player.substitution.goals);
                } else {
                    return teamGoals + parseInt(player.goals);
                }
            }, 0);
        },
        getCsc: function (finalTeam) {
            return finalTeam.reduce(function (teamGoals, player) {
                if (player.substitution) {
                    return teamGoals + parseInt(player.substitution.csc);
                } else {
                    return teamGoals + parseInt(player.csc);
                }
            }, 0);
        },
        getGoalStop: function (goalkeeper) {
            const finalGoalkeeper = goalkeeper.substitution ? goalkeeper.substitution : goalkeeper;
            return finalGoalkeeper.note >= 8 ? 1 : 0;
        },
    },
    computed: {
        finalTeam: function () {
            let teamInfos = {};

            let finals = JSON.parse(JSON.stringify(this.starters));
            let availableSubstitutes = JSON.parse(JSON.stringify(this.substitutes));
            let positions = ["forward", "middle", "backer"];

            this.substitutions.forEach(function (substitution) {
                if (substitution.note) {
                    let starter = finals.find(function (starter) {
                        return starter.index === substitution.starter;
                    });
                    if (starter && starter.note && starter.note < substitution.note) {
                        starter.substitution = this.substitutes[substitution.substitute];
                        availableSubstitutes = availableSubstitutes.filter(function (availableSubstitute) {
                            return availableSubstitute.index !== substitution.substitute;
                        });
                    }
                }
            }, this);

            let rotaldos = 0;
            finals.forEach(function (starter) {
                if (!starter.note && !starter.substitution) {
                    let substitutePositionsAvailable = ["goalkeeper"];
                    if (starter.position != "goalkeeper") {
                        substitutePositionsAvailable = positions.slice(positions.indexOf(starter.position), 3);
                    }
                    let malus = 0;
                    let currentSubstitutePosition = 0;

                    while (currentSubstitutePosition < substitutePositionsAvailable.length) {
                        let neededPosition = substitutePositionsAvailable[currentSubstitutePosition];

                        let subIndex = availableSubstitutes.findIndex(function (availableSub) {
                            return availableSub.position === neededPosition && availableSub.note;
                        });

                        if (subIndex >= 0) {
                            starter.substitution = availableSubstitutes[subIndex];
                            availableSubstitutes.splice(subIndex, 1);
                            starter.substitution.note = starter.substitution.note - malus;
                            starter.substitution.bonus = -malus;
                            break;
                        }

                        currentSubstitutePosition ++;
                        malus ++;
                    }

                    if (!starter.substitution) {
                        rotaldos ++;
                        starter.substitution = {
                            position: starter.position,
                            note: 2.5,
                            bonus: 0,
                            goals: 0,
                            csc: rotaldos%3 === 0 ? 1 : 0,
                        };
                    }
                }
            });

            teamInfos.team = finals;
            teamInfos.csc = this.getCsc(finals);
            teamInfos.goals = this.getGoals(finals);
            teamInfos.goalStop = this.getGoalStop(finals[0]);
            return teamInfos;
        },
        averages: function () {
            let averages = {};
            let positions = ["forward", "middle", "backer", "goalkeeper"];
            positions.forEach(function (position) {
                let positionPlayers = this.finalTeam.team.filter(function (finalPlayer) {
                    return finalPlayer.position === position;
                });
                let positionNoteSum = positionPlayers.reduce(function (positionAverage, player) {
                    if (player.substitution) {
                        return positionAverage + parseFloat(player.substitution.note);
                    } else {
                        return positionAverage + parseFloat(player.note);
                    }
                }, 0);
                averages[position] = positionNoteSum / positionPlayers.length;
            }, this);
            return averages;
        },
    },
    watch: {
        finalTeam: {
            deep: true,
            handler: function () {
                this.$emit("team-change", this.finalTeam.team);
                this.$emit("own-score", this.finalTeam.csc);
                this.$emit("score", this.finalTeam.goals);
                this.$emit("goal-stop", this.finalTeam.goalStop);
            },
        },
        averages: {
            deep: true,
            handler: function () {
                this.$emit("averages", this.averages);
            },
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .team {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        h2 {
            align-self: center;
        }
        h3 {
            margin: 0;
        }
    }
    li {
        list-style-type: none;
        margin: 5px 0;
    }
    .substitued {
        color: #ababab;
    }
    td {
        &:first-child {
            text-align: left;
        }
        padding: 5px;
    }
    span.player-goal {
        margin-left: -3px;
        width: 13px;
        background: #fff;
    }
    span.player-csc svg {
        fill: rgb(232, 30, 41);
    }
    .substitued span.player-goal,
    .substitued span.player-csc {
        opacity: .5;
    }
</style>
