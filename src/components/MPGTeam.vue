<template>
  <div class="team">
      <h2>
          <span v-if="home">Équipe à domicile</span>
          <span v-else>Équipe à l"extérieur</span>
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

      <h3>Equipe Finale</h3>
      <table>
            <tr>
              <td>Joueur</td>
              <td>Note</td>
              <td>Buts</td>
              <td>CSC</td>
            </tr>
            <template v-for="(final, finalIndex) in finalTeam">
                <tr :key="finalIndex" :class="{'substitued': final.substitution}">
                    <td>{{final.position}} {{final.index}}</td>
                    <td>{{final.note}}</td>
                    <td>
                        <span class="player-goal" v-for="(goal, goalIndex) in final.goals" :key="goalIndex">
                            <svg width="12" height="12" viewBox="241 398 12 12"><path d="M253 404c0-2.427-1.462-4.614-3.704-5.543-2.242-.93-4.823-.415-6.538 1.3-1.607 1.61-2.168 3.99-1.45 6.148l-.003.005.01.018c.252.743.648 1.43 1.166 2.02l.04.068h.022c.07.077.142.152.216.227.818.82 1.857 1.387 2.99 1.626l.01.014h.06c.78.154 1.585.154 2.366 0h.006v-.002c2.798-.567 4.81-3.027 4.81-5.882zm-6 5.168c-.4 0-.797-.045-1.186-.136l-.724-1.254.942-1.632h1.883l.94 1.632-.73 1.27c-.37.08-.747.12-1.125.12zm0-10.336c.36 0 .718.037 1.07.11l.786 1.362-.94 1.632h-1.884l-.942-1.632.78-1.348c.37-.083.75-.124 1.13-.124zm-4.205 4.97l-.746-1.29c.218-.732.598-1.405 1.11-1.97h1.52l.94 1.632-.94 1.632h-1.885v-.003zm8.356 0h-1.882l-.942-1.63.942-1.633h1.572c.498.55.87 1.2 1.092 1.907l-.78 1.356zm-1.882 3.738l-.942-1.632.942-1.632h1.884l.765 1.325c-.236.724-.63 1.386-1.15 1.938h-1.5v.002zm-7.203-1.997l.73-1.264h1.883l.942 1.63-.942 1.632h-1.443c-.537-.568-.937-1.252-1.17-2z" fill-rule="evenodd"></path></svg>
                        </span>
                    </td>
                    <td>
                        <span class="player-csc" v-for="(goal, goalIndex) in final.csc" :key="goalIndex">
                            <svg width="12" height="12" viewBox="241 398 12 12"><path d="M253 404c0-2.427-1.462-4.614-3.704-5.543-2.242-.93-4.823-.415-6.538 1.3-1.607 1.61-2.168 3.99-1.45 6.148l-.003.005.01.018c.252.743.648 1.43 1.166 2.02l.04.068h.022c.07.077.142.152.216.227.818.82 1.857 1.387 2.99 1.626l.01.014h.06c.78.154 1.585.154 2.366 0h.006v-.002c2.798-.567 4.81-3.027 4.81-5.882zm-6 5.168c-.4 0-.797-.045-1.186-.136l-.724-1.254.942-1.632h1.883l.94 1.632-.73 1.27c-.37.08-.747.12-1.125.12zm0-10.336c.36 0 .718.037 1.07.11l.786 1.362-.94 1.632h-1.884l-.942-1.632.78-1.348c.37-.083.75-.124 1.13-.124zm-4.205 4.97l-.746-1.29c.218-.732.598-1.405 1.11-1.97h1.52l.94 1.632-.94 1.632h-1.885v-.003zm8.356 0h-1.882l-.942-1.63.942-1.633h1.572c.498.55.87 1.2 1.092 1.907l-.78 1.356zm-1.882 3.738l-.942-1.632.942-1.632h1.884l.765 1.325c-.236.724-.63 1.386-1.15 1.938h-1.5v.002zm-7.203-1.997l.73-1.264h1.883l.942 1.63-.942 1.632h-1.443c-.537-.568-.937-1.252-1.17-2z" fill-rule="evenodd"></path></svg>
                        </span>
                    </td>
                </tr>
                <tr v-if="final.substitution" :key="'sub' + finalIndex">
                    <td>↪️ {{final.substitution.position}} {{final.substitution.index}}</td>
                    <td>{{final.substitution.note}}</td>
                    <td>
                        <span class="player-goal" v-for="(goal, goalIndex) in final.substitution.goals" :key="goalIndex">
                            <svg width="12" height="12" viewBox="241 398 12 12"><path d="M253 404c0-2.427-1.462-4.614-3.704-5.543-2.242-.93-4.823-.415-6.538 1.3-1.607 1.61-2.168 3.99-1.45 6.148l-.003.005.01.018c.252.743.648 1.43 1.166 2.02l.04.068h.022c.07.077.142.152.216.227.818.82 1.857 1.387 2.99 1.626l.01.014h.06c.78.154 1.585.154 2.366 0h.006v-.002c2.798-.567 4.81-3.027 4.81-5.882zm-6 5.168c-.4 0-.797-.045-1.186-.136l-.724-1.254.942-1.632h1.883l.94 1.632-.73 1.27c-.37.08-.747.12-1.125.12zm0-10.336c.36 0 .718.037 1.07.11l.786 1.362-.94 1.632h-1.884l-.942-1.632.78-1.348c.37-.083.75-.124 1.13-.124zm-4.205 4.97l-.746-1.29c.218-.732.598-1.405 1.11-1.97h1.52l.94 1.632-.94 1.632h-1.885v-.003zm8.356 0h-1.882l-.942-1.63.942-1.633h1.572c.498.55.87 1.2 1.092 1.907l-.78 1.356zm-1.882 3.738l-.942-1.632.942-1.632h1.884l.765 1.325c-.236.724-.63 1.386-1.15 1.938h-1.5v.002zm-7.203-1.997l.73-1.264h1.883l.942 1.63-.942 1.632h-1.443c-.537-.568-.937-1.252-1.17-2z" fill-rule="evenodd"></path></svg>
                        </span>
                    </td>
                    <td>
                        <span class="player-csc" v-for="(goal, goalIndex) in final.substitution.csc" :key="goalIndex">
                            <svg width="12" height="12" viewBox="241 398 12 12"><path d="M253 404c0-2.427-1.462-4.614-3.704-5.543-2.242-.93-4.823-.415-6.538 1.3-1.607 1.61-2.168 3.99-1.45 6.148l-.003.005.01.018c.252.743.648 1.43 1.166 2.02l.04.068h.022c.07.077.142.152.216.227.818.82 1.857 1.387 2.99 1.626l.01.014h.06c.78.154 1.585.154 2.366 0h.006v-.002c2.798-.567 4.81-3.027 4.81-5.882zm-6 5.168c-.4 0-.797-.045-1.186-.136l-.724-1.254.942-1.632h1.883l.94 1.632-.73 1.27c-.37.08-.747.12-1.125.12zm0-10.336c.36 0 .718.037 1.07.11l.786 1.362-.94 1.632h-1.884l-.942-1.632.78-1.348c.37-.083.75-.124 1.13-.124zm-4.205 4.97l-.746-1.29c.218-.732.598-1.405 1.11-1.97h1.52l.94 1.632-.94 1.632h-1.885v-.003zm8.356 0h-1.882l-.942-1.63.942-1.633h1.572c.498.55.87 1.2 1.092 1.907l-.78 1.356zm-1.882 3.738l-.942-1.632.942-1.632h1.884l.765 1.325c-.236.724-.63 1.386-1.15 1.938h-1.5v.002zm-7.203-1.997l.73-1.264h1.883l.942 1.63-.942 1.632h-1.443c-.537-.568-.937-1.252-1.17-2z" fill-rule="evenodd"></path></svg>
                        </span>
                    </td>
                </tr>
            </template>
      </table>
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
    },
    computed: {
        finalTeam: function () {
            let finals = JSON.parse(JSON.stringify(this.starters));
            let availableSubstitutes = JSON.parse(JSON.stringify(this.substitutes));
            let positions = ["forward", "middle", "backer",];

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

            finals.forEach(function (starter) {
                if (!starter.note && !starter.substitution) {
                    let substitutePositionsAvailable = ["goalkeeper",];
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
                        starter.substitution = {
                            position: "rotaldo",
                            note: 2.5,
                            bonus: 0,
                            goals: 0,
                            csc: 0,
                        };
                    }
                }
            });

            return finals;
        },
        goals: function () {
            return this.finalTeam.reduce(function (teamGoals, player) {
                if (player.substitution) {
                    return teamGoals + parseInt(player.substitution.goals);
                } else {
                    return teamGoals + parseInt(player.goals);
                }
            }, 0);
        },
        csc: function () {
            return this.finalTeam.reduce(function (teamGoals, player) {
                if (player.substitution) {
                    return teamGoals + parseInt(player.substitution.csc);
                } else {
                    return teamGoals + parseInt(player.csc);
                }
            }, 0);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
    .substitued span.player-goal {
        opacity: .5;
    }
</style>
