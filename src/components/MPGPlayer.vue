<template>
      <section>
          <span>#{{index}}</span>

          <SelectList class="input-player-name"
            v-model="playerName"
            @input="selectPlayer"
            :options="players"
            track-by="name"
            :label="getOptionLabel"
            :placeholder="placeholder"></SelectList>

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
import SelectList from "@/components/SelectList.vue";

export default {
    name: "MPGPlayer",
    components: {
        SelectList,
    },
    data: function () {
        return {
            playerPosition: "",
            playerName: "",
            playerNote: "",
            playerGoals: "",
            playerCsc: "",
            positionTraductions: {
                goalkeeper: "gardien",
                backer: "défenseur",
                middle: "milieu",
                forward: "attaquant",
            },
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
        placeholder: function () {
            if (this.playerPosition) {
                return "Choisir un " + this.positionTraductions[this.playerPosition];
            }
            return "Choisir un joueur";
        },
    },
    methods: {
        selectPlayer: function () {
            this.$emit("select", this.index, {
                position: this.playerPosition,
                name: this.playerName,
                note: this.playerNote !== "" ? Number(this.playerNote) : undefined,
                goals: this.playerGoals !== "" ? Number(this.playerGoals) : 0,
                csc: this.playerCsc !== "" ? Number(this.playerCsc) : 0,
            });
        },
        getOptionLabel: function (option) {
            return [option.position, option.team].join(" - ");
        },
    },
    watch: {
        player: {
            deep: true,
            handler: function () {
                this.playerPosition = this.player.position;
                this.playerName = this.player.name;
                this.playerNote = this.player.note;
                this.playerGoals = this.player.goals;
                this.playerCsc = this.player.csc;
            },
        },
    },
};
</script>

<style scoped lang="scss">
    section {
        display: flex;
    }
    .input-player-name {
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
