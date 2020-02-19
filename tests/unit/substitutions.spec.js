import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";

describe("Remplacements", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
    });

    it("ne remplace pas un joueur si il a une note suffisante", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6 }],
            substitutes: [{ index: 0, position: "backer", note: 5 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].note).to.be.equals(6);
    });

    it("ne remplace pas un joueur si il a une note suffisante en comptant le bonus défensif", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "goalkeeper", note: 6 },
                { index: 1, position: "backer", note: 5 },
                { index: 2, position: "backer", note: 5 },
                { index: 3, position: "backer", note: 5 },
                { index: 4, position: "backer", note: 5 },
            ],
            substitutes: [{ index: 0, position: "backer", note: 2 }],
            substitutions: [{ index: 0, starter: 1, substitute: 0, note: 5.5 }],
        });
        expect(componentWrapper.vm.finalTeam.team[1].substitution).to.be.undefined;
    });

    it("remplace un joueur si il a une note insuffisante", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 3 }],
            substitutes: [{ index: 0, position: "backer", note: 5 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(5);
    });

    it("ne remplace pas un joueur si il a une note insuffisante mais que son remplacant n'a pas joué", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 3 }],
            substitutes: [{ index: 0, position: "backer", note: undefined }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
        });
        expect(componentWrapper.vm.finalTeam.team[0].substitution).to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].note).to.be.equals(3);
    });

    it("remplace un joueur qui n'a pas joué par le 1er joueur du même poste sur le banc", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: undefined }],
            substitutes: [{ index: 0, position: "goalkeeper", note: 5 }, { index: 1, position: "backer", note: 5 }],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(5);
    });

    it("remplace un joueur qui n'a pas joué par le 2eme joueur du même poste sur le banc si le 1er est déjà rentré", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: undefined },{ index: 1, position: "backer", note: 3 }],
            substitutes: [{ index: 0, position: "backer", note: 5 }, { index: 1, position: "backer", note: 6 }],
            substitutions: [{ index: 0, starter: 1, substitute: 0, note: 5 }],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(6);
        expect(componentWrapper.vm.finalTeam.team[1].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[1].substitution.note).to.be.equals(5);
    });

    it("remplace un attaquant qui n'a pas joué par un milieu sur le banc si aucun attaquant n'est disponible et lui enleve 1 point", () => {
        componentWrapper.setData({
            starters: [{ index: 1, position: "forward", note: undefined }],
            substitutes: [{ index: 0, position: "middle", note: 6 }],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(5);
        expect(componentWrapper.vm.finalTeam.team[0].substitution.position).to.be.equals("middle");
        expect(componentWrapper.vm.finalTeam.team[0].substitution.bonus).to.be.equals(-1);
    });

    it("remplace un attaquant qui n'a pas joué par un défenseur sur le banc si aucun attaquant ni milieu n'est disponible et lui enleve 2 points", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "forward", note: undefined }],
            substitutes: [{ index: 0, position: "backer", note: 6 }],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(4);
        expect(componentWrapper.vm.finalTeam.team[0].substitution.position).to.be.equals("backer");
        expect(componentWrapper.vm.finalTeam.team[0].substitution.bonus).to.be.equals(-2);
    });

    it("remplace un milieu qui n'a pas joué par un défenseur sur le banc si aucun attaquant ni milieu n'est disponible et lui enleve 1 point", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "middle", note: undefined }],
            substitutes: [{ index: 0, position: "backer", note: 6 }],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(5);
        expect(componentWrapper.vm.finalTeam.team[0].substitution.position).to.be.equals("backer");
        expect(componentWrapper.vm.finalTeam.team[0].substitution.bonus).to.be.equals(-1);
    });

    it("remplace un gardien qui n'a pas joué par son remplacant uniquement", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: undefined }],
            substitutes: [{ index: 0, position: "backer", note: 3 },{ index: 1, position: "middle", note: 4 }, { index: 2, position: "goalkeeper", note: 5 }],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(5);
        expect(componentWrapper.vm.finalTeam.team[0].substitution.position).to.be.equals("goalkeeper");
    });

    it("remplace un joueur qui n'a pas joué par un Rotaldo si aucun joueur n'est disponible", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: undefined }],
            substitutes: [],
            substitutions: [],
        });
        expectStarterSubstitued();
        expect(componentWrapper.vm.finalTeam.team[0].substitution).not.to.be.undefined;
        expect(componentWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(2.5);
        expect(componentWrapper.vm.finalTeam.team[0].substitution.position).to.be.equals("goalkeeper");
        expect(componentWrapper.vm.finalTeam.team[0].substitution.name).to.be.equals("Rotaldo");
    });

    it("attribue un CSC tous les 3 Rotaldo entrés", () => {
        expect(componentWrapper.vm.finalTeam.csc).to.be.equals(3);
        componentWrapper.setData({
            starters: [
                { index: 0, position: "goalkeeper", note: 5, csc: 0 },
                { index: 1, position: "backer", note: 5, csc: 0 },
                { index: 2, position: "backer", note: 5, csc: 0 },
                { index: 3, position: "backer", note: 5, csc: 0 },
                { index: 4, position: "backer", note: 5, csc: 0 },
                { index: 5, position: "backer", note: undefined },
                { index: 6, position: "middle", note: undefined },
                { index: 7, position: "middle", note: undefined },
                { index: 8, position: "middle", note: undefined },
                { index: 9, position: "forward", note: undefined },
                { index: 10, position: "forward", note: undefined },
            ],
        });
        expect(componentWrapper.vm.finalTeam.csc).to.be.equals(2);
        componentWrapper.setData({
            starters: [
                { index: 0, position: "goalkeeper", note: 5, csc: 0 },
                { index: 1, position: "backer", note: 5, csc: 0 },
                { index: 2, position: "backer", note: 5, csc: 0 },
                { index: 3, position: "backer", note: 5, csc: 0 },
                { index: 4, position: "backer", note: 5, csc: 0 },
                { index: 5, position: "backer", note: 5, csc: 0 },
                { index: 6, position: "backer", note: 5, csc: 0 },
                { index: 7, position: "backer", note: 5, csc: 0 },
                { index: 8, position: "middle", note: undefined },
                { index: 9, position: "forward", note: undefined },
                { index: 10, position: "forward", note: undefined },
            ],
        });
        expect(componentWrapper.vm.finalTeam.csc).to.be.equals(1);
    });

    function expectStarterSubstitued() {
        expect(componentWrapper.vm.finalTeam.team).to.be.an("array");
    }
});
