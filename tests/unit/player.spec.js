import Vuex from "vuex";
import { expect } from "chai";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import MPGPlayer from "@/components/MPGPlayer.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
    state: {
        players: [],
    },
});

describe("Joueur MPG", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGPlayer, {
            store,
            localVue,
            propsData: {
                index: 0,
            },
        });
    });

    it("Demande un joueur selon le paramétrage", () => {
        expect(componentWrapper.vm.placeholder).to.be.equal("Choisir un joueur");
        // charger le store par bout pour tester totalement ce component
        // https://vuex.vuejs.org/guide/testing.html
    });
});
