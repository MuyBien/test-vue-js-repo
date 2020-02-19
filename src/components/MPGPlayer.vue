<template>
      <section>
          <span>#{{index}}</span>
          <select v-model="playerName" @change="selectPlayer">
              <option v-for="player in players" :key="player.name" :value="player.name">{{player.name}} ({{player.team}} - {{player.position}})</option>
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
            playerName: "",
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
        player: {
            type: Object,
            required: false,
        },
        position: {
            type: String,
            required: false,
        },
    },
    computed: {
        players: function () {
            if (this.position) {
                return this.$store.getters.playersByPosition(this.position);
            }
            return this.$store.state.players;
        },
    },
    methods: {
        selectPlayer: function () {
            // this.$store.dispatch("setPlaying");
            this.$emit("select", this.index, {
                position: this.playerPosition,
                name: this.playerName,
                note: this.playerNote !== "" ? Number(this.playerNote) : undefined,
                goals: this.playerGoals !== "" ? Number(this.playerGoals) : 0,
                csc: this.playerCsc !== "" ? Number(this.playerCsc) : 0,
            });
        },
    },
    watch: {
        player: function () {
            this.playerPosition = this.player.position;
            this.playerName = this.player.name;
            this.playerNote = this.player.note;
            this.playerGoals = this.player.goals;
            this.playerCsc = this.player.csc;
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
