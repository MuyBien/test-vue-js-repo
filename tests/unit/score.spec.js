import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";
import MPGMatch from "@/components/MPGMatch.vue";

describe("Score", () => {
    let componentWrapper;
    let matchWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
        matchWrapper = shallowMount(MPGMatch);
    });

    it("comptabilise les buts de l'équipe finale", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, goals: 1, csc: 0 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 0 }],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.goals).to.be.equals(3);
    });

    it("ne comptabilise pas les buts de joueurs remplacés", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, goals: 1, csc: 0 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 0 }],
            substitutes: [{ index: 0, position: "backer", note: 5, goals: 0, csc: 0 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 7 }],
        });
        expect(componentWrapper.vm.finalTeam.goals).to.be.equals(2);
    });

    it("comptabilise les CSC de l'équipe finale", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, goals: 1, csc: 1 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 1 }],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.csc).to.be.equals(2);
    });

    it("ne comptabilise pas les CSC de joueurs remplacés", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 3, goals: 0, csc: 1 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 1 }],
            substitutes: [{ index: 0, position: "backer", note: 5, goals: 0, csc: 0 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
        });
        expect(componentWrapper.vm.finalTeam.csc).to.be.equals(1);
    });

    it("ajoute un arrêt MPG si la note du gardien le permet", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: 8, goals: 0, csc: 0 }],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.goalStop).to.be.equals(1);
    });

    it("ajoute un arrêt MPG si la note du remplacant du gardien le permet", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: undefined, goals: 0, csc: 0 }],
            substitutes: [{ index: 0, position: "goalkeeper", note: 8, goals: 0, csc: 0 }],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.goalStop).to.be.equals(1);
    });

    it("enlève un but au score si un des deux gardiens réalise un arrêt MPG", () => {
        matchWrapper.setData({
            home: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [] },
            away: { team: [], goals: 0, csc: 0, goalStop: 1, averages: [] },
        });
        expect(matchWrapper.vm.homeGoals).to.be.equals(1);
    });


    it("n'enlève pas un but CSC au score même si le gardien adverse a une note de 8 (Marçal jurisprudence)", () => {
        matchWrapper.setData({
            home: { team: [], goals: 0, csc: 0, goalStop: 0, averages: [] },
            away: { team: [], goals: 0, csc: 1, goalStop: 1, averages: [] },
        });
        expect(matchWrapper.vm.homeGoals).to.be.equals(1);
    });
});
