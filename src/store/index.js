import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Players from "@/assets/players/fr.json";
const positionsMap = {
    goalkeeper: ["G"],
    backer: ["DL", "DC"],
    middle: ["MD", "MO"],
    forward: ["A"],
};

export default new Vuex.Store({
    state: {
        players: Players,
    },
    mutations: {
    },

    getters: {
        playersByPosition: function (state) {
            return function (position) {
                return state.players.filter(function (player) {
                    return positionsMap[position].includes(player.position);
                });
            };
        },
    },
    actions: {
    },
    modules: {
    },
});
