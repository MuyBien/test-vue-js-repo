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
const reversePositionsMap = {
    G: "goalkeeper",
    DL: "backer",
    DC: "backer",
    MD: "middle",
    MO: "middle",
    A: "forward",
};


export default new Vuex.Store({
    state: {
        players: Players,
    },
    mutations: {},
    getters: {
        playersByPosition: function (state) {
            return function (position) {
                return state.players.filter(function (player) {
                    return positionsMap[position].includes(player.position);
                });
            };
        },
        playerPosition: function (state) {
            return function (playerName) {
                let playerFinded = state.players.filter(function (player) {
                    return player.name === playerName;
                })[0];
                return reversePositionsMap[playerFinded.position];
            };
        },
    },
    actions: {},
    modules: {},
});
