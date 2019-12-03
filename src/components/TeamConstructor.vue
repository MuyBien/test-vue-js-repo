<template>
  <div class="team">
      <h2>
          <span v-if="home">Équipe à domicile</span>
          <span v-else>Équipe à l'extérieur</span>
      </h2>

      <h3>Titulaires</h3>
      <ul>
        <li v-for="starter in starters" :key="starter.index">
            <PlayerSelector :index="starter.index" :place="starter.place" @select="selectStarter"></PlayerSelector>
        </li>
      </ul>

      <h3>Remplaçants</h3>
      <ul>
        <li v-for="substitute in substitutes" :key="substitute.index">
            <PlayerSelector :index="substitute.index" :place="substitute.place" @select="selectSubstitute"></PlayerSelector>
        </li>
      </ul>
  </div>
</template>

<script>
import PlayerSelector from "../components/PlayerSelector.vue";

export default {
    name: "TeamConstructor",
    components: {
        PlayerSelector,
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
        return {
            starters: starters,
            substitutes: substitutes,
        };
    },
    methods: {
        selectStarter: function (index, place) {
            this.starters[index].place = place;
        },
        selectSubstitute: function (index, place) {
            this.substitutes[index].place = place;
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
