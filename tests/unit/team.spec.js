import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

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
            expect(starter.position).to.be.undefined;
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
