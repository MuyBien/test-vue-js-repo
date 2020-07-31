<template>
      <section>
          <span>#{{index + 1}}</span>

          <SelectList class="input-player-name"
            v-model="playerName"
            @input="selectPlayer"
            :options="players"
            track-by="name"
            :label="getOptionLabel"
            :placeholder="placeholder"
            data-tour-step="3"></SelectList>

          <div class="note-wrapper" data-tour-step="4">
              <input-number :step="0.5" :min="0" :max="10" v-model="playerNote" placeholder="Note" @input="selectPlayer"></input-number>
          </div>
          <div class="goals-wrapper" data-tour-step="5">
              <input-number :min="0" v-model="playerGoals" placeholder="Buts" @input="selectPlayer"></input-number>
          </div>
          <div class="csc-wrapper" data-tour-step="6">
              <input-number :min="0" v-model="playerCsc" placeholder="CSC" @input="selectPlayer"></input-number>
          </div>
      </section>
</template>

<script>
import SelectList from "@/components/SelectList.vue";
import InputNumber from "@/components/InputNumber.vue";

export default {
    name: "MPGPlayer",
    components: {
        SelectList,
        InputNumber,
    },
    data: function () {
        return {
            playerPosition: "",
            playerName: "",
            playerNote: undefined,
            playerGoals: undefined,
            playerCsc: undefined,
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
        justify-content: flex-start;
        align-items: center;
    }
    .input-player-name {
        margin-right: 10px;
    }
    span {
        margin-right: 10px;
    }
</style>

<style>
    input[type="search"] {
        padding: 5px;
        border-radius: 3px;
        border-style: solid;
        border: 1px solid #ccc;
        box-sizing: border-box;
        height: 30px;
    }
</style>
