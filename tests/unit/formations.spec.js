import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

describe("Formation", () => {
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

    it("Ajoute 0,5 à chaque défenseur pour une ligne de défense à 4", () => {
        let formation = {backer: 4, middle: 4, forward: 2};
        componentWrapper.vm.setFormation(formation);
        componentWrapper.vm.starters[1].note = 4;
        expect(componentWrapper.vm.finalTeam.team[1].bonus).to.be.equals(0.5);
        expect(componentWrapper.vm.finalTeam.team[2].bonus).to.be.equals(0.5);
        expect(componentWrapper.vm.finalTeam.team[3].bonus).to.be.equals(0.5);
        expect(componentWrapper.vm.finalTeam.team[4].bonus).to.be.equals(0.5);
        expect(componentWrapper.vm.finalTeam.team[5].bonus).to.be.undefined;
    });

    it("Ajoute 1 à chaque défenseur pour une ligne de défense à 5", () => {
        let formation = {backer: 5, middle: 3, forward: 2};
        componentWrapper.vm.setFormation(formation);
        componentWrapper.vm.starters[1].note = 4;
        expect(componentWrapper.vm.finalTeam.team[1].bonus).to.be.equals(1);
        expect(componentWrapper.vm.finalTeam.team[2].bonus).to.be.equals(1);
        expect(componentWrapper.vm.finalTeam.team[3].bonus).to.be.equals(1);
        expect(componentWrapper.vm.finalTeam.team[4].bonus).to.be.equals(1);
        expect(componentWrapper.vm.finalTeam.team[5].bonus).to.be.equals(1);
        expect(componentWrapper.vm.finalTeam.team[6].bonus).to.be.undefined;
    });

    it("N'joute pas de bonus à un remplacant d'un défenseur pour une ligne de défense à 4", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "goalkeeper", note: 5 },
                { index: 1, position: "backer", note: undefined },
                { index: 2, position: "backer", note: 5 },
                { index: 3, position: "backer", note: 5 },
                { index: 4, position: "backer", note: 5 },
            ],
            substitutes: [{ index: 1, position: "backer", note: 5 }],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.team[1].substitution.bonus).to.be.equals(0);
        expect(componentWrapper.vm.finalTeam.team[2].bonus).to.be.equals(0.5);
        expect(componentWrapper.vm.finalTeam.team[3].bonus).to.be.equals(0.5);
        expect(componentWrapper.vm.finalTeam.team[4].bonus).to.be.equals(0.5);
    });
    function getStarterByPosition(position) {
        return componentWrapper.vm.starters.filter(function (starter){
            return starter.position === position;
        });
    }
});
