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
              <input type="number" placeholder="Note" step="0.5" min="0" max="10" v-model="playerNote" @input="selectPlayer" />
          </span>
          <span class="goals-wrapper">
              <input type="number" placeholder="Buts" step="1" min="0" v-model="playerGoals" @input="selectPlayer" />
          </span>
          <span class="csc-wrapper">
              <input type="number" placeholder="CSC" step="1" min="0" v-model="playerCsc" @input="selectPlayer" />
          </span>
      </section>
</template>

<script>
export default {
    name: "MPGPlayer",
    data: function () {
        return {
            playerPosition: "",
            playerNote: "",
            playerGoals: "",
            playerCsc: "",
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
        },
        note: {
            type: Number,
            required: false,
        },
        goals: {
            type: Number,
            required: false,
            default: 0,
        },
        csc: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    methods: {
        selectPlayer: function () {
            this.$emit("select", this.index, {
                position: this.playerPosition,
                note: this.playerNote !== "" ? Number(this.playerNote) : undefined,
                goals: this.playerGoals !== "" ? Number(this.playerGoals) : 0,
                csc: this.playerCsc !== "" ? Number(this.playerCsc) : 0,
            });
        },
    },
    watch: {
        position: function () {
            this.playerPosition = this.position;
        },
        note: function () {
            this.playerNote = this.note;
        },
        goals: function () {
            this.playerGoals = this.goals;
        },
        csc: function () {
            this.playerCsc = this.csc;
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
