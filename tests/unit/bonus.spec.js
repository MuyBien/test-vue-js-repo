import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGBonus from "@/components/MPGBonus.vue";
import MPGTeam from "@/components/MPGTeam.vue";
import MPGMatch from "@/components/MPGMatch.vue";

describe("Bonus", () => {
    let bonusWrapper;

    beforeEach(() => {
        bonusWrapper = shallowMount(MPGBonus);
    });

    it("Propose tous les bonus possibles", () => {
        bonusWrapper.setProps({
            bonus: 0,
        });
        expect(bonusWrapper.vm.selected).to.equals(0);
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

describe("Bonus : Zahia", () => {
    let teamWrapper;

    beforeEach(() => {
        teamWrapper = shallowMount(MPGTeam);
    });

    it("Rajoute 0.5 à tous les titulaires", () => {
        teamWrapper.setData({
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "middle", name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
            bonus: 1,
        });
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(6.5);
        expect(teamWrapper.vm.finalTeam.team[1].note).to.be.equals(6.5);
    });

    it("Ne rajoute pas 0.5 au remplaçant", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 4 }],
            substitutes: [{ index: 0, position: "backer", note: 7 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
            bonus: 1,
        });
        expect(teamWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(7);
    });

    it("Empêche un remplacement si le bonus rend la note du titulaire suffisante", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 4.5 }],
            substitutes: [{ index: 0, position: "backer", note: 7 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
            bonus: 1,
        });
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(5);
    });
});
