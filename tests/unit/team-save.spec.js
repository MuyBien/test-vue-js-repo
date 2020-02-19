import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

describe("Chargement depuis DB", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("Charge une équipe complète", () => {
        let team = {
            starters: [
                { index: 0, position: "backer", name: "Abdelhamid", note: 6, goals: 2, csc: 1 },
            ],
            substitutes: [
                { index: 0, position: "middle", name: "Sanson", note: 2, goals: 1, csc: 0 },
            ],
            substitutions: [
                { index: 0, starter: 2, substitute: 1, note: 8 },
            ],
        };
        componentWrapper.vm.loadTeam(team);
        expect(componentWrapper.vm.$data.starters[0].position).to.be.equals("backer");
        expect(componentWrapper.vm.$data.starters[0].name).to.be.equals("Abdelhamid");
        expect(componentWrapper.vm.$data.starters[0].note).to.be.equals(6);
        expect(componentWrapper.vm.$data.starters[0].csc).to.be.equals(1);
        expect(componentWrapper.vm.$data.starters[0].goals).to.be.equals(2);

        expect(componentWrapper.vm.$data.substitutes[0].position).to.be.equals("middle");
        expect(componentWrapper.vm.$data.substitutes[0].name).to.be.equals("Sanson");
        expect(componentWrapper.vm.$data.substitutes[0].note).to.be.equals(2);
        expect(componentWrapper.vm.$data.substitutes[0].csc).to.be.equals(0);
        expect(componentWrapper.vm.$data.substitutes[0].goals).to.be.equals(1);

        expect(componentWrapper.vm.$data.substitutions[0].starter).to.be.equals(2);
        expect(componentWrapper.vm.$data.substitutions[0].note).to.be.equals(8);
        expect(componentWrapper.vm.$data.substitutions[0].substitute).to.be.equals(1);
    });

});
