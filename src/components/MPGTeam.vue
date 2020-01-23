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
            </tr>
            <template v-for="(final, finalIndex) in finalTeam">
                <tr :key="finalIndex" :class="{'substitued': final.substitution}">
                    <td>{{final.position}} {{final.index}}</td>
                    <td>{{final.note}}</td>
                </tr>
                <tr v-if="final.substitution" :key="'sub' + finalIndex">
                    <td>↪️ {{final.substitution.position}} {{final.substitution.index}}</td>
                    <td>{{final.substitution.note}}</td>
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
            });
        }
        let substitutes = [];
        for (let i = 0; i < 7; i++) {
            substitutes.push({
                index: i,
                position: "",
                note: undefined,
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
        },
        selectSubstitute: function (index, player) {
            this.substitutes[index].position = player.position;
            this.substitutes[index].note = player.note;
        },
        defineSubstitution: function (index, substitution) {
            this.substitutions[index].starter = substitution.starter;
            this.substitutions[index].substitute = substitution.substitute;
            this.substitutions[index].note = substitution.note;
        },
    },
    computed: {
        finalTeam: function () {
            let finals = [];
            Object.assign(finals, this.starters);
            this.substitutions.forEach(function (substitution) {
                let starter = finals.find(function (starter) {
                    return starter.index === substitution.starter;
                });
                if (starter && starter.note < substitution.note) {
                    starter.substitution = this.substitutes[substitution.substitute];
                }
            }, this);
            return finals;
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
</style>
