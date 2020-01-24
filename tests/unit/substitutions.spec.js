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

    it("remplace un attaquant qui n'a pas joué par un milieu sur le banc si aucun attaquant n'est disponible et lui enleve 1 point", () => {
        componentWrapper.setData({
            starters: [{ index: 1, position: "forward", note: undefined, },],
            substitutes: [{ index: 0, position: "middle", note: 6, },],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].substitution.note).to.be.equals(5);
        expect(componentWrapper.vm.finalTeam[0].substitution.position).to.be.equals("middle");
        expect(componentWrapper.vm.finalTeam[0].substitution.bonus).to.be.equals(-1);
    });

    it("remplace un attaquant qui n'a pas joué par un défenseur sur le banc si aucun attaquant ni milieu n'est disponible et lui enleve 2 points", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "forward", note: undefined, },],
            substitutes: [{ index: 0, position: "backer", note: 6, },],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].substitution.note).to.be.equals(4);
        expect(componentWrapper.vm.finalTeam[0].substitution.position).to.be.equals("backer");
        expect(componentWrapper.vm.finalTeam[0].substitution.bonus).to.be.equals(-2);
    });

    it("remplace un milieu qui n'a pas joué par un défenseur sur le banc si aucun attaquant ni milieu n'est disponible et lui enleve 1 point", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "middle", note: undefined, },],
            substitutes: [{ index: 0, position: "backer", note: 6, },],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].substitution.note).to.be.equals(5);
        expect(componentWrapper.vm.finalTeam[0].substitution.position).to.be.equals("backer");
        expect(componentWrapper.vm.finalTeam[0].substitution.bonus).to.be.equals(-1);
    });

    it("remplace un gardien qui n'a pas joué par son remplacant uniquement", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: undefined, },],
            substitutes: [{ index: 0, position: "backer", note: 3, },{ index: 1, position: "middle", note: 4, }, { index: 2, position: "goalkeeper", note: 5, },],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].substitution.note).to.be.equals(5);
        expect(componentWrapper.vm.finalTeam[0].substitution.position).to.be.equals("goalkeeper");
    });

    it("remplace un joueur qui n'a pas joué par un Rotaldo si aucun joueur n'est disponible", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: undefined, },],
            substitutes: [],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam[0].substitution.note).to.be.equals(2.5);
        expect(componentWrapper.vm.finalTeam[0].substitution.position).to.be.equals("rotaldo");
    });

    function expectStarterSubstitued() {
        expect(componentWrapper.vm.finalTeam).to.be.an("array");
    }
});