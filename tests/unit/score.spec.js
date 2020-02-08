import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

describe("Score", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("comptabilise les buts de l'équipe finale", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, goals: 1, csc: 0 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 0 }],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.goals).to.be.equals(3);
    });

    it("ne comptabilise pas les buts de joueurs remplacés", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, goals: 1, csc: 0 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 0 }],
            substitutes: [{ index: 0, position: "backer", note: 5, goals: 0, csc: 0 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 7 }],
        });
        expect(componentWrapper.vm.goals).to.be.equals(2);
    });

    it("comptabilise les CSC de l'équipe finale", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, goals: 1, csc: 1 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 1 }],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.csc).to.be.equals(2);
    });

    it("ne comptabilise pas les CSC de joueurs remplacés", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 3, goals: 0, csc: 1 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 1 }],
            substitutes: [{ index: 0, position: "backer", note: 5, goals: 0, csc: 0 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
        });
        expect(componentWrapper.vm.csc).to.be.equals(1);
    });

});
