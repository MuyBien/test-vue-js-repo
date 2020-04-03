<template>
  <div class="team">
      <h2>
          <span v-if="home">🏠 Équipe à domicile</span>
          <span v-else>🛫 Équipe à l'extérieur</span>
      </h2>

      <TeamSave :team="completeTeam" @team-loaded="loadTeam"></TeamSave>

      <MPGFormations @formation="setFormation"></MPGFormations>

      <h3>Titulaires</h3>
      <div class="actions">
          <button @click="resetStarters(true)">Réinitaliser les titulaires</button>
          <button @click="resetStarters(false)">Réinitaliser seulement leur notes</button>
      </div>
      <ul>
        <li v-for="starter in starters" :key="'starter' + starter.index">
            <MPGPlayer :index="starter.index" :player="starter" :position="starter.position" @select="selectStarter"></MPGPlayer>
        </li>
      </ul>

      <h3>Remplaçants</h3>
      <div class="actions">
          <button @click="resetSubstitutes(true)">Réinitaliser les remplaçants</button>
          <button @click="resetSubstitutes(false)">Réinitaliser seulement leur notes</button>
      </div>
      <ul>
        <li v-for="substitute in substitutes" :key="'sub' + substitute.index">
            <MPGPlayer :index="substitute.index" :player="substitute" @select="selectSubstitute"></MPGPlayer>
        </li>
      </ul>

      <h3>Remplacements</h3>
      <div class="actions">
          <button @click="resetsubstitutions">Réinitaliser les remplacements</button>
      </div>
      <ul>
        <li v-for="substitution in substitutions" :key="'substitution' + substitution.index">
            <MPGSubstitution :index="substitution.index" :substitution="substitution" :starters="starters" :substitutes="substitutes" @select="defineSubstitution"></MPGSubstitution>
        </li>
      </ul>

      <h3>Bonus</h3>
      <MPGBonus :bonus="bonus.id" :target="bonus.target" @select="selectBonus"></MPGBonus>

  </div>
</template>

<script>
import MPGPlayer from "@/components/MPGPlayer.vue";
import MPGSubstitution from "@/components/MPGSubstitution.vue";
import MPGFormations from "@/components/MPGFormations.vue";
import TeamSave from "@/components/TeamSave.vue";
import MPGBonus from "@/components/MPGBonus.vue";

export default {
    name: "MPGTeam",
    components: {
        MPGPlayer,
        MPGSubstitution,
        MPGFormations,
        TeamSave,
        MPGBonus,
    },
    props: {
        home: {
            type: Boolean,
            required: false,
            default: true,
        },
        opponentBonus: {
            type: Object,
            default: function () {
                return {
                    id: undefined,
                    target: undefined,
                };
            },
        },
    },
    data: function () {
        let starters = [];
        for (let i = 0; i < 11; i++) {
            starters.push({
                index: i,
                position: "",
                name: "",
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
                name: "",
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
            bonus: {
                id: undefined,
                target: undefined,
            },
        };
    },
    methods: {
        selectStarter: function (index, player) {
            this.starters[index].position = player.position;
            this.starters[index].name = player.name;
            this.starters[index].note = player.note;
            this.starters[index].goals = player.goals;
            this.starters[index].csc = player.csc;
        },
        selectSubstitute: function (index, player) {
            this.substitutes[index].position = this.$store.getters.playerPosition(player.name);
            this.substitutes[index].name = player.name;
            this.substitutes[index].note = player.note;
            this.substitutes[index].goals = player.goals;
            this.substitutes[index].csc = player.csc;
        },
        defineSubstitution: function (index, substitution) {
            this.substitutions[index].starter = substitution.starter;
            this.substitutions[index].substitute = substitution.substitute;
            this.substitutions[index].note = substitution.note;
        },
        selectBonus: function (bonus) {
            this.bonus = bonus;
        },
        getGoals: function (finalTeam) {
            return finalTeam.reduce(function (teamGoals, player) {
                let finalPlayer = player.substitution ? player.substitution : player;
                if (Number.isInteger(finalPlayer.goals)) {
                    return teamGoals + parseInt(finalPlayer.goals);
                }
                return teamGoals;
            }, 0);
        },
        getCsc: function (finalTeam) {
            return finalTeam.reduce(function (teamGoals, player) {
                let finalPlayer = player.substitution ? player.substitution : player;
                if (Number.isInteger(finalPlayer.csc)) {
                    return teamGoals + parseInt(finalPlayer.csc);
                }
                return teamGoals;
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
                name: this.starters[0].position === "goalkeeper" ? this.starters[0].name : "",
                note: this.starters[0].note,
                goals: this.starters[0].goals,
                csc: this.starters[0].csc,
            }];
            let playerIndex = 1;
            Object.keys(formation).forEach(function (position){
                for (let i = 1; i <= formation[position]; i++) {
                    let playerName = this.starters[playerIndex].position === position ? this.starters[playerIndex].name : "";
                    players.push({
                        index: playerIndex,
                        position: position,
                        name: playerName,
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
        setZahiaBonus: function (finalTeam) {
            let zahiaBonus = 0.5;
            finalTeam.forEach(function (player) {
                if (player.note) {
                    player.note = player.note ? player.note + zahiaBonus : player.note;
                }
                player.bonus = player.bonus ? player.bonus + zahiaBonus : zahiaBonus;
            });
            return finalTeam;
        },
        setSuarezBonus: function (finalTeam) {
            let suarezBonus = -1;
            if (finalTeam[0].substitution) {
                finalTeam[0].substitution.note += suarezBonus;
                finalTeam[0].substitution.bonus = finalTeam[0].substitution.bonus ? finalTeam[0].substitution.bonus + suarezBonus : suarezBonus;
            } else {
                finalTeam[0].note += suarezBonus;
                finalTeam[0].bonus = finalTeam[0].bonus ? finalTeam[0].bonus + suarezBonus : suarezBonus;
            }
            return finalTeam;
        },
        setRedbullBonus: function (finalTeam) {
            const redbullBonus = 1;
            const playerIndex = this.bonus.target;
            if (playerIndex !== undefined) {
                finalTeam[playerIndex].note = finalTeam[playerIndex].note ? finalTeam[playerIndex].note + redbullBonus : undefined;
                finalTeam[playerIndex].bonus = finalTeam[playerIndex].bonus ? finalTeam[playerIndex].bonus + redbullBonus : redbullBonus;
            }
            return finalTeam;
        },
        resetStarters: function (resetAll) {
            this.starters.forEach(function (starter) {
                if (resetAll) {
                    starter.position = undefined;
                    starter.name = undefined;
                }
                starter.note = undefined;
                starter.goals = undefined;
                starter.csc = undefined;
            });
        },
        resetSubstitutes: function (resetAll) {
            this.substitutes.forEach(function (substitute) {
                if (resetAll) {
                    substitute.position = undefined;
                    substitute.name = undefined;
                }
                substitute.note = undefined;
                substitute.goals = undefined;
                substitute.csc = undefined;
            });
        },
        resetsubstitutions: function () {
            this.substitutions.forEach(function (substitution) {
                substitution.starter = undefined;
                substitution.substitute = undefined;
                substitution.note = undefined;
            });
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
            finals = this.bonus.id === 1 ? this.setZahiaBonus(finals) : finals;
            finals = this.bonus.id === 4 ? this.setRedbullBonus(finals) : finals;

            if (this.opponentBonus.id !== 3) {
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
            }

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
                            name: "Rotaldo",
                            note: 2.5,
                            bonus: undefined,
                            goals: 0,
                            csc: rotaldos%3 === 0 ? 1 : 0,
                        };
                    }
                }
            });

            if (this.opponentBonus.id === 2) {
                finals = this.setSuarezBonus(finals);
            }

            teamInfos.team = finals;
            teamInfos.csc = this.getCsc(finals);
            teamInfos.goals = this.getGoals(finals);
            teamInfos.goalStop = this.getGoalStop(finals[0]);
            teamInfos.bonus = this.bonus;
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
                this.$emit("team-bonus", this.finalTeam.bonus);
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
    ul {
        width: 100%;
        padding-left: 0;
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
