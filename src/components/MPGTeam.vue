<template>
  <div class="team">
      <h2>
          <span v-if="home">Équipe à domicile</span>
          <span v-else>Équipe à l'extérieur</span>
      </h2>

      <h3>Titulaires</h3>
      <ul>
        <li v-for="starter in starters" :key="starter.index">
            <MPGPlayer :index="starter.index" :place="starter.place" @select="selectStarter"></MPGPlayer>
        </li>
      </ul>

      <h3>Remplaçants</h3>
      <ul>
        <li v-for="substitute in substitutes" :key="substitute.index">
            <MPGPlayer :index="substitute.index" :place="substitute.place" @select="selectSubstitute"></MPGPlayer>
        </li>
      </ul>

      <h3>Remplacements</h3>
      <ul>
        <li v-for="substitution in substitutions" :key="substitution.index">
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
                place: "",
            });
        }
        let substitutes = [];
        for (let i = 0; i < 7; i++) {
            substitutes.push({
                index: i,
                place: "",
            });
        }
        let substitutions = [];
        for (let i = 0; i < 5; i++) {
            substitutions.push({
                index: i,
                starter: "",
                substitute: "",
                note: 0,
            });
        }
        return {
            starters: starters,
            substitutes: substitutes,
            substitutions: substitutions,
        };
    },
    methods: {
        selectStarter: function (index, place) {
            this.starters[index].place = place;
        },
        selectSubstitute: function (index, place) {
            this.substitutes[index].place = place;
        },
        defineSubstitution: function (index, substitution) {
            this.substitutions[index].starter = substitution.starter;
            this.substitutions[index].substitute = substitution.substitute;
            this.substitutions[index].note = substitution.note;
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
</style>
