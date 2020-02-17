<template>
  <div class="team">
      <h2>
          <span v-if="home">🏠 Équipe à domicile</span>
          <span v-else>🛫 Équipe à l'extérieur</span>
      </h2>

      <TeamSave :team="completeTeam" @team-loaded="loadTeam"></TeamSave>

      <MPGFormations @formation="setFormation"></MPGFormations>

      <h3>Titulaires</h3>
      <ul>
        <li v-for="starter in starters" :key="'starter' + starter.index">
            <MPGPlayer :index="starter.index" :player="starter" @select="selectStarter"></MPGPlayer>
        </li>
      </ul>

      <h3>Remplaçants</h3>
      <ul>
        <li v-for="substitute in substitutes" :key="'sub' + substitute.index">
            <MPGPlayer :index="substitute.index" :player="substitute" @select="selectSubstitute"></MPGPlayer>
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
import MPGFormations from "@/components/MPGFormations.vue";
import TeamSave from "@/components/TeamSave.vue";

export default {
    name: "MPGTeam",
    components: {
        MPGPlayer,
        MPGSubstitution,
        MPGFormations,
        TeamSave,
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
        setFormation: function (formation) {
            let players = [{
                index: 0,
                position: "goalkeeper",
                note: this.starters[0].note,
                goals: this.starters[0].goals,
                csc: this.starters[0].csc,
            }];
            let playerIndex = 1;
            Object.keys(formation).forEach(function (position){
                for(let i = 1; i <= formation[position]; i++) {
                    players.push({
                        index: playerIndex,
                        position: position,
                        note: this.starters[playerIndex].note,
                        goals: this.starters[playerIndex].goals,
                        csc: this.starters[playerIndex].csc,
                    });
                    playerIndex ++;
                }
            }, this);
            this.starters = players;
        },
        loadTeam: function (team) {
            this.starters = team.starters;
            this.substitutes = team.substitutes;
            this.substitutions = team.substitutions;
        },
        setDefenseBonus: function (finalTeam) {
            const backers = finalTeam.filter(function (player) {
                return player.position === "backer";
            });
            if (backers.length > 3) {
                let defenseBonus = backers.length > 4 ? 1 : 0.5;
                finalTeam.forEach(function (player) {
                    if (player.position === "backer") {
                        player.bonus = defenseBonus;
                        if (player.note) {
                            player.note = player.note + defenseBonus;
                        }
                    }
                });
            }
            return finalTeam;
        },
    },
    computed: {
        completeTeam: function () {
            return {
                starters: this.starters,
                substitutes: this.substitutes,
                substitutions: this.substitutions,
            };
        },
        finalTeam: function () {
            let teamInfos = {};

            let finals = JSON.parse(JSON.stringify(this.starters));
            let availableSubstitutes = JSON.parse(JSON.stringify(this.substitutes));
            let positions = ["forward", "middle", "backer"];

            finals = this.setDefenseBonus(finals);

            this.substitutions.forEach(function (substitution) {
                if (substitution.note) {
                    let starter = finals.find(function (starter) {
                        return starter.index === substitution.starter;
                    });
                    let substitute = this.substitutes[substitution.substitute];
                    if (starter && starter.note && starter.note < substitution.note && substitute.note) {
                        starter.substitution = substitute;
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
                    let bonus = 0;
                    let currentSubstitutePosition = 0;

                    while (currentSubstitutePosition < substitutePositionsAvailable.length) {
                        let neededPosition = substitutePositionsAvailable[currentSubstitutePosition];

                        let subIndex = availableSubstitutes.findIndex(function (availableSub) {
                            return availableSub.position === neededPosition && availableSub.note;
                        });

                        if (subIndex >= 0) {
                            starter.substitution = availableSubstitutes[subIndex];
                            availableSubstitutes.splice(subIndex, 1);
                            starter.substitution.note = starter.substitution.note + bonus;
                            starter.substitution.bonus = bonus;
                            break;
                        }

                        currentSubstitutePosition ++;
                        bonus --;
                    }

                    if (!starter.substitution) {
                        rotaldos ++;
                        starter.substitution = {
                            position: starter.position,
                            note: 2.5,
                            bonus: "",
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
