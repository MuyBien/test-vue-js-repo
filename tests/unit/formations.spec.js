import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";
import MPGFormations from "@/components/MPGFormations.vue";

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
        let initialStarters = initStarters();
        initialStarters[0].note = 6;
        initialStarters[1].note = 5;
        componentWrapper.setData({
            starters: initialStarters,
        });
        let formation = {backer: 3, middle: 5, forward: 2};
        componentWrapper.vm.setFormation(formation);
        expect(componentWrapper.vm.$data.starters[0].note).to.be.equals(6);
        expect(componentWrapper.vm.$data.starters[1].note).to.be.equals(5);
    });

    it("Ne reset pas un joueur si son poste est valide pour la nouvelle formation choisie", () => {
        let initialStarters = initStarters();
        initialStarters[0] = { index: 0, name: "Fabien Barthez", position: "goalkeeper" };
        initialStarters[1] = { index: 1, name: "Basile Boli", position: "backer" };
        componentWrapper.setData({
            starters: initialStarters,
        });
        let formation = {backer: 5, middle: 3, forward: 2};
        componentWrapper.vm.setFormation(formation);
        expect(componentWrapper.vm.$data.starters[0].name).to.be.equals("Fabien Barthez");
        expect(componentWrapper.vm.$data.starters[1].name).to.be.equals("Basile Boli");
    });

    it("Reset un joueur si son poste est invalide pour la nouvelle formation choisie", () => {
        let initialStarters = initStarters();
        initialStarters[0] = { index: 0, name: "Fabien Barthez", position: "goalkeeper" };
        initialStarters[1] = { index: 1, name: "Didier Drogba", position: "forward" };
        componentWrapper.setData({
            starters: initialStarters,
        });
        let formation = {backer: 5, middle: 3, forward: 2};
        componentWrapper.vm.setFormation(formation);
        expect(componentWrapper.vm.$data.starters[1].name).to.be.empty;
    });

    it("Garde en mémoire la formation choisie", () => {
        let formationsWrapper = shallowMount(MPGFormations);
        formationsWrapper.vm.setFormation({backer: 5, middle: 3, forward: 2});
        expect(formationsWrapper.vm.isSelected("532")).to.be.true;
        expect(formationsWrapper.vm.isSelected("541")).to.be.false;
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

    function initStarters () {
        return [
            { index: 0, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 1, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 2, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 3, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 4, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 5, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 6, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 7, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 8, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 9, name: "", position: "", note: "", goals: "", csc: "" },
            { index: 10, name: "", position: "", note: "", goals: "", csc: "" },
        ];
    }
});
