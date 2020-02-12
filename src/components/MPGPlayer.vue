<template>
      <section>
          <span>#{{index}}</span>
          <select v-model="playerPosition" @change="selectPlayer">
              <option value="goalkeeper">Gardien</option>
              <option value="backer">Défenseur</option>
              <option value="middle">Milieu</option>
              <option value="forward">Attaquant</option>
          </select>
          <span>
              <input type="number" placeholder="Note" step="0.5" min="0" max="10" v-model="note" @input="selectPlayer" />
          </span>
          <span class="goals-wrapper">
              <input type="number" placeholder="Buts" step="1" min="0" v-model="goals" @input="selectPlayer" />
          </span>
          <span class="csc-wrapper">
              <input type="number" placeholder="CSC" step="1" min="0" v-model="csc" @input="selectPlayer" />
          </span>
      </section>
</template>

<script>
export default {
    name: "MPGPlayer",
    data: function () {
        return {
            playerPosition: "",
            note: "",
            goals: "",
            csc: "",
        };
    },
    props: {
        index: {
            type: Number,
            required: true,
        },
        position: {
            type: String,
            required: false,
            default: "",
        },
    },
    methods: {
        selectPlayer: function () {
            this.$emit("select", this.index, {
                position: this.playerPosition,
                note: this.note !== "" ? Number(this.note) : undefined,
                goals: this.goals !== "" ? Number(this.goals) : 0,
                csc: this.csc !== "" ? Number(this.csc) : 0,
            });
        },
    },
    watch: {
        position: function () {
            this.playerPosition = this.position;
        },
    },
};
</script>

<style scoped lang="scss">
    select {
        height: 25px;
        margin-right: 10px;
    }
    span {
        margin-right: 10px;
    }
    input[type="number"] {
        max-width: 50px;
    }
</style>
