import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

describe("Moyennes d'équipe", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("calcule la moyenne de chaque ligne", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", note: 6, goals: 0, csc: 0 },
                { index: 1, position: "backer", note: 5, goals: 0, csc: 0 },
                { index: 2, position: "backer", note: 4, goals: 0, csc: 0 },
            ],
        });
        expect(componentWrapper.vm.averages.backer).to.be.equals(5);
    });

    it("calcule la moyenne de chaque ligne en prenant en compte les remplacements", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", note: 4, goals: 1, csc: 0 },
                { index: 1, position: "backer", note: 5, goals: 2, csc: 0 },
                { index: 2, position: "backer", note: 6, goals: 2, csc: 0 },
            ],
            substitutes: [
                { index: 0, position: "backer", note: 7, goals: 0, csc: 0 },
            ],
            substitutions: [
                { index: 0, starter: 0, substitute: 0, note: 5 },
            ],
        });
        expect(componentWrapper.vm.averages.backer).to.be.equals(6);
    });

    it("calcule la moyenne de chaque ligne en prenant en compte les bonus", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", note: 5, goals: 0, csc: 0 },
                { index: 1, position: "backer", note: 5, goals: 0, csc: 0 },
                { index: 2, position: "backer", note: 5, goals: 0, csc: 0 },
                { index: 3, position: "backer", note: 5, goals: 0, csc: 0 },
                { index: 4, position: "backer", note: 5, goals: 0, csc: 0 },
            ],
        });
        expect(componentWrapper.vm.averages.backer).to.be.above(5);
    });
});
