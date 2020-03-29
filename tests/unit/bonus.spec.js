import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGBonus from "@/components/MPGBonus.vue";
import MPGMatch from "@/components/MPGMatch.vue";

describe("Bonus", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGBonus);
    });

    it("Propose tous les bonus possibles", () => {
        componentWrapper.setProps({
            bonus: 0,
        });
        expect(componentWrapper.vm.selected).to.equals(0);
    });
});

describe("Bonus : Valise à Nanard", () => {
    let matchWrapper;

    beforeEach(() => {
        matchWrapper = shallowMount(MPGMatch);
    });

    it("enlève un but au score si l'équipe adverse a utilisé le bonus Valise", () => {
        matchWrapper.setData({
            home: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [], bonus: 0 },
            away: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [], bonus: undefined },
        });
        expect(matchWrapper.vm.awayGoals).to.be.equals(1);
        expect(matchWrapper.vm.homeGoals).to.be.equals(2);
    });

    it("laisse le score adverse à 0 si l'équipe adverse n'a pas marqué", () => {
        matchWrapper.setData({
            home: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [], bonus: 0 },
            away: { team: [], goals: 0, csc: 0, goalStop: 0, averages: [], bonus: undefined },
        });
        expect(matchWrapper.vm.awayGoals).to.be.equals(0);
        expect(matchWrapper.vm.homeGoals).to.be.equals(2);
    });
});
