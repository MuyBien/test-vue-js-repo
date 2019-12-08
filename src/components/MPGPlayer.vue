<template>
      <section>
          <span>#{{index}}</span>
          <select v-model="position" @change="selectPlayer">
              <option value="goalkeeper">Gardien</option>
              <option value="backer">Défenseur</option>
              <option value="middle">Milieu</option>
              <option value="forward">Attaquant</option>
          </select>
          <span>
              <input type="number" step="0.5" min="0" max="10" v-model="note" @input="selectPlayer"/>
          </span>
      </section>
</template>

<script>
export default {
    name: "MPGPlayer",
    data: function () {
        return {
            position: "",
            note: "",
        };
    },
    props: {
        index: {
            type: Number,
            required: true,
        },
    },
    methods: {
        selectPlayer: function () {
            this.$emit("select", this.index, {
                position: this.position,
                note: this.note !== "" ? Number(this.note) : undefined,
            });
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
