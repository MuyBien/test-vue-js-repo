import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGSubstitution from "@/components/MPGSubstitution.vue";

describe("Définition de remplacement", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGSubstitution, {
            propsData: {
                index: 0,
                substitution: {},
                starters: [{ id: 1, name: "Name", position: "backer" }],
                substitutes: [{ id: 1, name: "Name", position: "backer" }],
            },
        });
    });

    it("Ne propose pas les gardiens dans les remplacements", () => {
        componentWrapper.setProps({
            starters: [
                { id: 0, name: "Mandanda", position: "goalkeeper" },
                { id: 1, name: "Di Meco", position: "backer" },
            ],
            substitutes: [
                { id: 0, name: "Barthez", position: "goalkeeper" },
                { id: 1, name: "Boli", position: "backer" },
            ],
        });
        expect(componentWrapper.vm.availableStarters.length).to.be.equal(1);
        expect(componentWrapper.vm.availableStarters[0].position).to.be.equal("backer");
        expect(componentWrapper.vm.availableSubstitutes.length).to.be.equal(1);
        expect(componentWrapper.vm.availableSubstitutes[0].position).to.be.equal("backer");
    });

    it("Renvoi tous les titulaires disponibles si aucun remplaçant n'est encore choisi", () => {
        componentWrapper.setProps({
            starters: [
                { id: 0, name: "Waddle", position: "middle" },
                { id: 1, name: "Di Meco", position: "backer" },
            ],
            substitutes: [
                { id: 1, name: "Boli", position: "backer" },
            ],
        });
        expect(componentWrapper.vm.availableStarters.length).to.be.equal(2);
    });

    it("Renvoi tous les remplacants disponibles si aucun titulaire n'est encore choisi", () => {
        componentWrapper.setProps({
            starters: [
                { id: 1, name: "Boli", position: "backer" },
            ],
            substitutes: [
                { id: 0, name: "Waddle", position: "middle" },
                { id: 1, name: "Di Meco", position: "backer" },
            ],
        });
        expect(componentWrapper.vm.availableSubstitutes.length).to.be.equal(2);
    });

    it("Peut récupérer le nom des titulaires et remplaçants", () => {
        componentWrapper.setProps({
            starters: [
                { id: 1, name: "Boli", position: "backer" },
            ],
            substitutes: [
                { id: 0, name: "Di Meco", position: "backer" },
            ],
        });
        expect(componentWrapper.vm.getStarterName(0)).to.be.equal("Boli");
        expect(componentWrapper.vm.getSubstituteName(0)).to.be.equal("Di Meco");
    });

    it("Filtre les titulaires en fonction du remplacant à remplacer", () => {
        componentWrapper.setProps({
            starters: [
                { id: 0, name: "Waddle", position: "middle" },
                { id: 1, name: "Di Meco", position: "backer" },
            ],
            substitutes: [
                { id: 0, name: "Boli", position: "backer" },
            ],
        });
        componentWrapper.setData({
            substitute: 0,
        });
        expect(componentWrapper.vm.availableStarters.length).to.be.equal(1);
        expect(componentWrapper.vm.availableStarters[0].position).to.be.equal("backer");
    });

    it("Filtre les remplacants à remplacer en fonction du titulaire choisi", () => {
        componentWrapper.setProps({
            starters: [
                { id: 0, name: "Boli", position: "backer" },
            ],
            substitutes: [
                { id: 1, name: "Di Meco", position: "backer" },
                { id: 0, name: "Waddle", position: "middle" },
            ],
        });
        componentWrapper.setData({
            starter: 0,
        });
        expect(componentWrapper.vm.availableSubstitutes.length).to.be.equal(1);
        expect(componentWrapper.vm.availableSubstitutes[0].position).to.be.equal("backer");
    });

    it("Permet de définir un remplacement", () => {
        componentWrapper.setProps({
            starters: [
                { id: 1, name: "Boli", position: "backer" },
            ],
            substitutes: [
                { id: 0, name: "Di Meco", position: "backer" },
            ],
            substitution: {
                starter: 0,
                substitute: 0,
                note: 5,
            },
        });
        componentWrapper.vm.defineSubstitution();
        expect(componentWrapper.emitted("select").length).to.be.equals(1);
    });
});
