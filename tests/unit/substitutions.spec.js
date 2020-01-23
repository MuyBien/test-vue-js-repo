import { expect, } from "chai";
import { shallowMount, } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

describe("MPGTeam.vue", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("ne remplace pas un joueur si il a une note suffisante", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, },],
            substitutes: [{ index: 0, position: "backer", note: 5, },],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5, },],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].note).to.be.equals(6);
    });

    it("remplace un joueur si il a une note insuffisante", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 3, },],
            substitutes: [{ index: 0, position: "backer", note: 5, },],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5, },],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].substitution.note).to.be.equals(5);
    });

    it("remplace un joueur qui n'a pas joué par le 1er joueur du même poste sur le banc", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: undefined, },],
            substitutes: [{ index: 0, position: "goalkeeper", note: 5, }, { index: 1, position: "backer", note: 5, },],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].substitution.note).to.be.equals(5);
    });

    it("remplace un joueur qui n'a pas joué par le 2eme joueur du même poste sur le banc si le 1er est déjà rentré", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: undefined, },{ index: 1, position: "backer", note: 3, },],
            substitutes: [{ index: 0, position: "backer", note: 5, }, { index: 1, position: "backer", note: 6, },],
            substitutions: [{ index: 0, starter: 1, substitute: 0, note: 5, },],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].substitution.note).to.be.equals(6);
        expect(componentWrapper.vm.finalTeam[1].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[1].substitution.note).to.be.equals(5);
    });
    function expectStarterSubstitued() {
        expect(componentWrapper.vm.finalTeam).to.be.an("array");
    }
});
