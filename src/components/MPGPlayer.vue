<template>
      <section>
          <span>#{{index}}</span>
          <select :value="place" @change="selectPlayer">
              <option value="goalkeeper">Gardien</option>
              <option value="backer">Défenseur</option>
              <option value="middle">Milieu</option>
              <option value="forward">Attaquant</option>
          </select>
      </section>
</template>

<script>
export default {
    name: "MPGPlayer",
    props: {
        index: {
            type: Number,
            required: true,
        },
        place: {
            type: String,
            required: true,
        },
    },
    methods: {
        selectPlayer: function (event) {
            this.$emit("select", this.index, event.target.value);
        },
    },
};
</script>

<style scoped lang="scss">
    select {
        height: 25px;
    }
    span {
        margin-right: 10px;
    }
</style>
