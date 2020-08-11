import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

describe("Paramétrage d'équipe", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("Permet de sélectionner un joueur", () => {
        componentWrapper.vm.selectStarter(0, {
            position: "backer",
            name: "Basile Boli",
            note: 10,
            goals: 1,
            csc: 0,
        });
        expect(componentWrapper.vm.starters[0].position).to.be.equals("backer");
        expect(componentWrapper.vm.starters[0].name).to.be.equals("Basile Boli");
        expect(componentWrapper.vm.starters[0].note).to.be.equals(10);
        expect(componentWrapper.vm.starters[0].csc).to.be.equals(0);
        expect(componentWrapper.vm.starters[0].goals).to.be.equals(1);
    });

    it("Permet de définir un remplacement", () => {
        componentWrapper.vm.defineSubstitution(0, {
            starter: 0,
            substitute: 0,
            note: 6,
        });
        expect(componentWrapper.vm.substitutions[0].starter).to.be.equals(0);
        expect(componentWrapper.vm.substitutions[0].substitute).to.be.equals(0);
        expect(componentWrapper.vm.substitutions[0].note).to.be.equals(6);
    });

    it("Permet de sélectionner un bonus", () => {
        componentWrapper.vm.selectBonus(0);
        expect(componentWrapper.vm.bonus).to.be.equals(0);
    });
});

describe("Modifications en lot", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("Charge une équipe complète", () => {
        let team = {
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
            ],
            substitutes: [
                { index: 0, position: "forward", name: "Didier Drogba", note: 8, goals: 3, csc: 1 },
            ],
            substitutions: [
                { index: 0, starter: 2, substitute: 1, note: 8 },
            ],
            bonus: { id: 2, target: undefined },
        };
        componentWrapper.vm.loadTeam(team);
        expect(componentWrapper.vm.$data.starters[0].position).to.be.equals("backer");
        expect(componentWrapper.vm.$data.starters[0].name).to.be.equals("Basile Boli");
        expect(componentWrapper.vm.$data.starters[0].note).to.be.equals(6);
        expect(componentWrapper.vm.$data.starters[0].csc).to.be.equals(0);
        expect(componentWrapper.vm.$data.starters[0].goals).to.be.equals(1);

        expect(componentWrapper.vm.$data.substitutes[0].position).to.be.equals("forward");
        expect(componentWrapper.vm.$data.substitutes[0].name).to.be.equals("Didier Drogba");
        expect(componentWrapper.vm.$data.substitutes[0].note).to.be.equals(8);
        expect(componentWrapper.vm.$data.substitutes[0].csc).to.be.equals(1);
        expect(componentWrapper.vm.$data.substitutes[0].goals).to.be.equals(3);

        expect(componentWrapper.vm.$data.substitutions[0].starter).to.be.equals(2);
        expect(componentWrapper.vm.$data.substitutions[0].note).to.be.equals(8);
        expect(componentWrapper.vm.$data.substitutions[0].substitute).to.be.equals(1);

        expect(componentWrapper.vm.bonus.id).to.be.equals(2);
    });

    it("Charge une équipe sans bonus", () => {
        let team = {
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
            ],
            substitutes: [
                { index: 0, position: "forward", name: "Didier Drogba", note: 8, goals: 3, csc: 1 },
            ],
            substitutions: [
                { index: 0, starter: 2, substitute: 1, note: 8 },
            ],
        };
        componentWrapper.vm.loadTeam(team);
        expect(componentWrapper.vm.$data.starters[0].name).to.be.equals("Basile Boli");
        expect(componentWrapper.vm.$data.substitutes[0].name).to.be.equals("Didier Drogba");
        expect(componentWrapper.vm.$data.substitutions[0].note).to.be.equals(8);
        expect(componentWrapper.vm.bonus.id).to.be.undefined;
    });

    it("Réinitialise les titulaires", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "middle", name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
        });
        componentWrapper.vm.resetStarters(true);
        componentWrapper.vm.$data.starters.forEach(function (starter) {
            expect(starter.name).to.be.undefined;
            expect(starter.note).to.be.undefined;
            expect(starter.csc).to.be.undefined;
            expect(starter.goals).to.be.undefined;
        });
    });

    it("Réinitialise seulement les notes, buts et CSC des titulaires", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "middle", name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
        });
        componentWrapper.vm.resetStarters(false);
        componentWrapper.vm.$data.starters.forEach(function (starter) {
            expect(starter.position).not.to.be.undefined;
            expect(starter.name).not.to.be.undefined;
            expect(starter.note).to.be.undefined;
            expect(starter.csc).to.be.undefined;
            expect(starter.goals).to.be.undefined;
        });
    });

    it("Réinitialise les remplaçants", () => {
        componentWrapper.setData({
            substitutes: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "middle", name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
        });
        componentWrapper.vm.resetSubstitutes(true);
        componentWrapper.vm.$data.substitutes.forEach(function (substitutes) {
            expect(substitutes.position).to.be.undefined;
            expect(substitutes.name).to.be.undefined;
            expect(substitutes.note).to.be.undefined;
            expect(substitutes.csc).to.be.undefined;
            expect(substitutes.goals).to.be.undefined;
        });
    });

    it("Réinitialise seulement les notes, buts et CSC des remplaçants", () => {
        componentWrapper.setData({
            substitutes: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "middle", name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
        });
        componentWrapper.vm.resetSubstitutes(false);
        componentWrapper.vm.$data.substitutes.forEach(function (substitutes) {
            expect(substitutes.position).not.to.be.undefined;
            expect(substitutes.name).not.to.be.undefined;
            expect(substitutes.note).to.be.undefined;
            expect(substitutes.csc).to.be.undefined;
            expect(substitutes.goals).to.be.undefined;
        });
    });

    it("Réinitialise les remplacements", () => {
        componentWrapper.setData({
            substitutions: [
                { index: 0, starter: 1, substitute: 1, note: 6 },
                { index: 1, starter: 2, substitute: 2, note: 6 },
            ],
        });
        componentWrapper.vm.resetsubstitutions();
        componentWrapper.vm.$data.substitutions.forEach(function (substitution) {
            expect(substitution.starter).to.be.undefined;
            expect(substitution.substitute).to.be.undefined;
            expect(substitution.note).to.be.undefined;
        });
    });
});

describe("Prise en compte des Rotaldo imposés par un Chapron Rouge", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("Remplace un joueur par un Rotaldo si il est visé par un Chapron Rouge", () => {
        componentWrapper.vm.selectStarter(0, {
            position: "backer",
            name: "Basile Boli",
            note: 10,
            goals: 1,
            csc: 0,
        });
        componentWrapper.setProps({
            chapronIndex: [0],
        });
        expect(componentWrapper.vm.finalTeam.team[0].position).to.be.equals("backer");
        expect(componentWrapper.vm.finalTeam.team[0].name).to.be.equals("Rotaldo");
        expect(componentWrapper.vm.finalTeam.team[0].note).to.be.equals(2.5);
        expect(componentWrapper.vm.finalTeam.team[0].csc).to.be.equals(0);
        expect(componentWrapper.vm.finalTeam.team[0].goals).to.be.equals(0);
    });
});

describe("Validation de l'équipe", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("Une formation est définie quand une des proposées est choisie", () => {
        expect(componentWrapper.vm.formationSetted).to.be.false;
        componentWrapper.vm.setFormation({backer: 4, middle: 4, forward: 2});
        expect(componentWrapper.vm.formationSetted).to.be.true;
    });

    it("Une formation reste définie après un reset des titulaires", () => {
        componentWrapper.vm.setFormation({backer: 4, middle: 4, forward: 2});
        expect(componentWrapper.vm.formationSetted).to.be.true;
        componentWrapper.vm.resetStarters(true);
        expect(componentWrapper.vm.formationSetted).to.be.true;
    });

    it("Une formation est définie quand tous les titulaires ont une position", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "middle", name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
        });
        expect(componentWrapper.vm.formationSetted).to.be.true;
    });

    it("Une formation n'est pas définie quand un des titulaires n'a pas une position", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: undefined, name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
        });
        expect(componentWrapper.vm.formationSetted).to.be.false;
    });
});
