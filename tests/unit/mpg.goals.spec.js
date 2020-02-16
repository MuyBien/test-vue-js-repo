import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGMatch from "@/components/MPGMatch.vue";

describe("Buts MPG", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGMatch);
    });

    it("attribue un but MPG si sa note lui permet", () => {
        let team = [{index:10, position:"forward", note:7, goals:0, csc:0}];
        let averages = {forward:"", middle:"", backer:4.5, goalkeeper:5};
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, true);
        expect(mpgs.length).to.be.equals(1);
    });

    it("n'attribue pas un but MPG si sa note ne lui permet pas de passer les lignes adverses", () => {
        let team = [{index: 10, position: "backer", note: 6.5, goals: 0, csc: 0}];
        let averages = {forward:6, middle:5, backer:5.5, goalkeeper:2};
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, true);
        expect(mpgs.length).to.be.equals(0);
    });

    it("n'attribue pas un but MPG si sa note est inférieure à 5 même si les moyennes adverses le permettent", () => {
        let team = [{index:10, position:"forward", note:4, goals:0, csc:0}];
        let averages = {forward:"", middle:"", backer:4.5, goalkeeper:2};
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, true);
        expect(mpgs.length).to.be.equals(0);
    });

    it("laisse passer un joueur à domicile si sa note est égale à la ligne adverse", () => {
        let team = [{index:10, position:"backer", note:7, goals:0, csc:0}];
        let averages = {forward: 7, middle: 6, backer: 5.5, goalkeeper: 5};
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, true);
        expect(mpgs.length).to.be.equals(1);
    });

    it("ne laisse pas passer un joueur à l'extérieur si sa note est égale à la ligne adverse", () => {
        let team = [{index:10, position:"forward", note:7, goals:0, csc:0}];
        let averages = {forward:"", middle:"", backer:7, goalkeeper:6};
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, false);
        expect(mpgs.length).to.be.equals(0);
    });

    it("attribue un but MPG au remplacant du titulaire si il rentre et que sa note lui permet", () => {
        let team = [{
            index:10,
            position: "forward",
            note:4,
            goals:0,
            csc:0,
            substitution: {
                index:0,
                position:"forward",
                note:7,
                goals:0,
                csc:0,
            },
        }];
        let averages = { forward:"", middle:"", backer:4.5, goalkeeper:5 };
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, true);
        expect(mpgs.length).to.be.equals(1);
    });

    it("n'attribue pas un but MPG au gardien même si sa note le permet", () => {
        let team = [{index:0, position:"goalkeeper", note:7, goals:0, csc:0}];
        let averages = {forward: 2, middle: 2, backer: 2, goalkeeper: 2};
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, true);
        expect(mpgs.length).to.be.equals(0);
    });

    it("n'attribue pas un but MPG à un joueur qui a déjà marqué un but réel", () => {
        let team = [{index:10, position:"forward", note:7, goals: 1, csc: 0}];
        let averages = {forward:"", middle:"", backer: 5, goalkeeper: 5};
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, true);
        expect(mpgs.length).to.be.equals(0);
    });

    it("attribue un but MPG à un joueur qui a une note qui lui permet même si il a marqué un CSC (Benito jurisprudence)", () => {
        let team = [{index:10, position:"forward", note:7, goals: 0, csc: 1}];
        let averages = {forward:"", middle:"", backer: 5, goalkeeper: 5};
        let mpgs = componentWrapper.vm.getTeamMpgGoals(team, averages, true);
        expect(mpgs.length).to.be.equals(1);
    });

});
