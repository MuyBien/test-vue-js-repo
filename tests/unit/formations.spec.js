import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

describe("Score", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("Pré-rempli l'équipe avec la formation choisie", () => {
        let formation = {backer: 3, middle: 5, forward: 2};
        componentWrapper.vm.setFormation(formation);
        const starterGoal = getStarterByPosition("goalkeeper");
        const starterBackers = getStarterByPosition("backer");
        const starterMiddles = getStarterByPosition("middle");
        const starterForwards = getStarterByPosition("forward");
        expect(starterGoal.length).to.be.equals(1);
        expect(starterBackers.length).to.be.equals(3);
        expect(starterMiddles.length).to.be.equals(5);
        expect(starterForwards.length).to.be.equals(2);
    });

    it("Ne modifie pas les notes déjà entrées à la selection d'une formation", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "", note: 6 },
                { index: 1, position: "", note: 5 },
                { index: 2, position: "", note: 5 },
                { index: 3, position: "", note: 5 },
                { index: 4, position: "", note: 5 },
                { index: 5, position: "", note: 5 },
                { index: 6, position: "", note: 5 },
                { index: 7, position: "", note: 5 },
                { index: 8, position: "", note: 5 },
                { index: 9, position: "", note: 5 },
                { index: 10, position: "", note: 5 },
            ],
        });
        let formation = {backer: 3, middle: 5, forward: 2};
        componentWrapper.vm.setFormation(formation);
        expect(componentWrapper.vm.$data.starters[0].note).to.be.equals(6);
        expect(componentWrapper.vm.$data.starters[1].note).to.be.equals(5);
    });

    function getStarterByPosition(position) {
        return componentWrapper.vm.starters.filter(function (starter){
            return starter.position === position;
        });
    }
});
