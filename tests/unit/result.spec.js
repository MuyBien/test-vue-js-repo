import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGResultTeam from "@/components/MPGResultTeam.vue";

describe("MPG Result Team", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGResultTeam, {
            propsData: {
                finalTeam: [],
                teamGoals: 0,
                opponentCsc: 0,
                mpgGoals: [],
            },
        });
    });

    it("Affiche les notes en fonction des bonus", () => {
        let playerNote = componentWrapper.vm.getPlayerNote({note: 5, bonus: 1});
        expect(playerNote).to.be.equal(4);
        playerNote = componentWrapper.vm.getPlayerNote({note: 5});
        expect(playerNote).to.be.equal(5);
        playerNote = componentWrapper.vm.getPlayerNote({note: 5, bonus: -1});
        expect(playerNote).to.be.equal(6);
    });

    it("Affiche vide si le joueur n'a pas joué", () => {
        let playerNote = componentWrapper.vm.getPlayerNote({note: undefined, bonus: 1});
        expect(playerNote).to.be.empty;
    });

    it("Renvoi la bonne classe selon la note", () => {
        expect(componentWrapper.vm.getNoteClass(4)).to.be.undefined;
        expect(componentWrapper.vm.getNoteClass(7)).to.be.undefined;
        expect(componentWrapper.vm.getNoteClass(3.5)).to.be.equals("low");
        expect(componentWrapper.vm.getNoteClass(7.5)).to.be.equals("high");
    });

    it("Affiche un ballon bleu pour un but réel d'un joueur", () => {
        componentWrapper.setProps({
            finalTeam: [{
                index: 0,
                position: "forward",
                name: "Didier Drogba",
                note: 6,
                goals: 1,
                csc: 0,
                bonus: 1,
            }],
        });
        expect(componentWrapper.find(".player-goal").exists()).to.be.true;
    });

    it("Affiche un ballon vert pour un but MPG d'un joueur", () => {
        componentWrapper.setProps({
            finalTeam: [{
                index: 0,
                position: "middle",
                name: "Didier Deschamps",
                note: 8,
                goals: 0,
                csc: 0,
                bonus: 0,
            }],
            mpgGoals: [0],
        });
        expect(componentWrapper.find(".mpg-goal").exists()).to.be.true;
    });

    it("Affiche un ballon rouge pour un but CSC d'un joueur", () => {
        componentWrapper.setProps({
            finalTeam: [{
                index: 0,
                position: "backer",
                name: "Presnel Kimpembe",
                note: 6,
                goals: 0,
                csc: 1,
                bonus: 0,
            }],
        });
        expect(componentWrapper.find(".csc-goal").exists()).to.be.true;
    });

    it("Affiche un gant rouge pour un arrêt d'un gardien", () => {
        componentWrapper.setProps({
            finalTeam: [{
                index: 0,
                position: "goalkeeper",
                name: "Steve Mandanda",
                note: 8,
                goals: 0,
                csc: 0,
                bonus: 0,
            }],
        });
        expect(componentWrapper.find(".goal-stop").exists()).to.be.true;
    });
});
