import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGBonus from "@/components/MPGBonus.vue";
import MPGTeam from "@/components/MPGTeam.vue";
import MPGMatch from "@/components/MPGMatch.vue";

describe("Bonus", () => {
    let bonusWrapper;

    beforeEach(() => {
        bonusWrapper = shallowMount(MPGBonus);
    });

    it("Permet de sélectionner un bonus", () => {
        bonusWrapper.setProps({
            bonus: 0,
        });
        expect(bonusWrapper.vm.selected).to.equals(0);
        expect(bonusWrapper.vm.bonusSelected.id).to.equals(0);
        bonusWrapper.vm.selectBonus();
        expect(bonusWrapper.emitted("select").length).to.be.equals(1);
    });

    it("Permet de sélectionner un bonus avec un joueur cible", () => {
        bonusWrapper.setProps({
            bonus: 4,
            target: 1,
        });
        expect(bonusWrapper.vm.bonusSelected.id).to.equals(4);
        expect(bonusWrapper.vm.bonusTarget).to.equals(1);
    });
});

describe("Bonus : Valise à Nanard", () => {
    let matchWrapper;

    beforeEach(() => {
        matchWrapper = shallowMount(MPGMatch);
    });

    it("enlève un but au score si l'équipe adverse a utilisé le bonus Valise", () => {
        matchWrapper.setData({
            home: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [], bonus: { id: 0 } },
            away: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [] },
        });
        expect(matchWrapper.vm.awayGoals).to.be.equals(1);
        expect(matchWrapper.vm.homeGoals).to.be.equals(2);
    });

    it("laisse le score adverse à 0 si l'équipe adverse n'a pas marqué", () => {
        matchWrapper.setData({
            home: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [], bonus: { id: 0 } },
            away: { team: [], goals: 0, csc: 0, goalStop: 0, averages: [] },
        });
        expect(matchWrapper.vm.awayGoals).to.be.equals(0);
        expect(matchWrapper.vm.homeGoals).to.be.equals(2);
    });
});

describe("Bonus : Zahia", () => {
    let teamWrapper;

    beforeEach(() => {
        teamWrapper = shallowMount(MPGTeam);
    });

    it("Rajoute 0.5 à tous les titulaires", () => {
        teamWrapper.setData({
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "middle", name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
            bonus: { id: 1 },
        });
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(6.5);
        expect(teamWrapper.vm.finalTeam.team[1].note).to.be.equals(6.5);
    });

    it("Ne rajoute pas 0.5 au remplaçant", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 4 }],
            substitutes: [{ index: 0, position: "backer", note: 7 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
            bonus: { id: 1 },
        });
        expect(teamWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(7);
    });

    it("Empêche un remplacement si le bonus rend la note du titulaire suffisante", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 4.5 }],
            substitutes: [{ index: 0, position: "backer", note: 7 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
            bonus: { id: 1 },
        });
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(5);
    });
});

describe("Bonus : Suarez", () => {
    let teamWrapper;

    beforeEach(() => {
        teamWrapper = shallowMount(MPGTeam);
    });

    it("Enlève 1 pt au gardien adverse", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: 5 }],
            substitutes: [],
            substitutions: [],
        });
        teamWrapper.setProps({
            opponentBonus: { id: 2 },
        });
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(4);
        expect(teamWrapper.vm.finalTeam.team[0].bonus).to.be.equals(-1);
    });

    it("Enlève 1 pt au gardien adverse même si c'est un Rotaldo", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: undefined }],
            substitutes: [],
            substitutions: [],
        });
        teamWrapper.setProps({
            opponentBonus: { id: 2 },
        });
        expect(teamWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(1.5);
        expect(teamWrapper.vm.finalTeam.team[0].substitution.bonus).to.be.equals(-1);
    });
});

describe("Bonus : Tonton Pat'", () => {
    let teamWrapper;

    beforeEach(() => {
        teamWrapper = shallowMount(MPGTeam);
    });

    it("Ne réalise aucun remplacement tactique", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 3 }],
            substitutes: [{ index: 0, position: "backer", note: 5 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
        });
        teamWrapper.setProps({
            opponentBonus: { id: 3 },
        });
        expect(teamWrapper.vm.finalTeam.team[0].substitution).to.be.undefined;
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(3);
    });

    it("Réalise les remplacements des joueurs qui n'ont pas joué", () => {
        teamWrapper.setData({
            starters: [
                { index: 0, position: "backer", note: 3 },
                { index: 1, position: "backer", note: undefined },
            ],
            substitutes: [{ index: 0, position: "backer", note: 5 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
        });
        teamWrapper.setProps({
            opponentBonus: { id: 3 },
        });
        expect(teamWrapper.vm.finalTeam.team[0].substitution).to.be.undefined;
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(3);
        expect(teamWrapper.vm.finalTeam.team[1].substitution).not.to.be.undefined;
        expect(teamWrapper.vm.finalTeam.team[1].substitution.note).to.be.equals(5);
    });
});

describe("Bonus : RedBull", () => {
    let teamWrapper;

    beforeEach(() => {
        teamWrapper = shallowMount(MPGTeam);
    });

    it("Ajoute 1 point au joueur choisi", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 5 }],
            bonus: {
                id: 4,
                target: 0,
            },
        });
        expect(teamWrapper.vm.finalTeam.team[0].bonus).to.be.equals(1);
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(6);
    });

    it("N'ajoute pas 1 point au joueur d'un remplacement tactique", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 3 }],
            substitutes: [{ index: 0, position: "backer", note: 5 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
            bonus: {
                id: 4,
                target: 0,
            },
        });
        expect(teamWrapper.vm.finalTeam.team[0].bonus).to.be.equals(1);
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(4);
        expect(teamWrapper.vm.finalTeam.team[0].substitution.bonus).not.to.be.equals(1);
        expect(teamWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(5);
    });

    it("N'ajoute pas 1 point au joueur d'un remplacement simple", () => {
        teamWrapper.setData({
            starters: [{ index: 0, position: "backer", note: undefined }],
            substitutes: [{ index: 0, position: "backer", note: 5 }],
            bonus: {
                id: 4,
                target: 0,
            },
        });
        expect(teamWrapper.vm.finalTeam.team[0].bonus).to.be.equals(1);
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.undefined;
        expect(teamWrapper.vm.finalTeam.team[0].substitution.bonus).not.to.be.equals(1);
        expect(teamWrapper.vm.finalTeam.team[0].substitution.note).to.be.equals(5);
    });
});

describe("Bonus : Chapron Rouge", () => {
    let matchWrapper;

    beforeEach(() => {
        matchWrapper = shallowMount(MPGMatch);
        matchWrapper.setData({
            home: {
                team:[
                    {index:0,position:"goalkeeper",name:"Moulin Jessy",note:5.5,goals:null,csc:null},
                    {index:1,position:"backer",name:"Djiku Alexander",note:4.5,goals:2,csc:null,bonus:0.5},
                    {index:2,position:"backer",name:"González Álvaro",note:6.5,goals:0,csc:0,bonus:0.5},
                    {index:3,position:"backer",name:"Hilton ",note:6.5,goals:0,csc:0,bonus:0.5},
                    {index:4,position:"backer",name:"Foket Thomas",note:6.5,goals:0,csc:0,bonus:0.5},
                    {index:5,position:"middle",name:"Bobichon Antonin",note:4,goals:0,csc:0},
                    {index:6,position:"middle",name:"André Benjamin",note:5,goals:null,csc:null},
                    {index:7,position:"middle",name:"Mama Baldé ",note:6.5,goals:0,csc:0},
                    {index:8,position:"forward",name:"Júlio Tavares ",note:7,goals:0,csc:0},
                    {index:9,position:"forward",name:"Jovetic Stevan",note:5,goals:0,csc:0,substitution:{index:3,position:"forward",name:"Niang M'Baye",note:6,goals:1,csc:null}},
                    {index:10,position:"forward",name:"Ajorque Ludovic",note:7,goals:1,csc:0}],
                goals: 4,
                csc: 0,
                goalStop: 0,
                averages: {
                    forward: 6.333333333333333,
                    middle: 5.166666666666667,
                    backer: 6,
                    goalkeeper: 5.5,
                },
                bonus: {
                    id: 5,
                    target: undefined,
                },
                opponentBonus: undefined,
                chapronIndex:[],
            },
            away: {
                team: [
                    {index:0,position:"goalkeeper",name:"Mandanda Steve",note:5.5,goals:0,csc:0},
                    {index:1,position:"backer",name:"Maripán Guillermo",note:7,goals:0,csc:0},
                    {index:2,position:"backer",name:"Aguilar Ruben",note:7,goals:0,csc:0},
                    {index:3,position:"backer",name:"Pedro Mendes ",note:7,goals:0,csc:0},
                    {index:4,position:"middle",name:"Claude Maurice Alexis",note:3.5,goals:0,csc:0},
                    {index:5,position:"middle",name:"Bakayoko Tiemoué",note:5,goals:0,csc:0},
                    {index:6,position:"middle",name:"Payet Dimitri",note:6,goals:0,csc:0},
                    {index:7,position:"middle",name:"Thauvin Florian",note:5,goals:0,csc:0},
                    {index:8,position:"forward",name:"Germain Valère",note:null,goals:0,csc:0,substitution:{index:2,position:"middle",name:"Rongier Valentin",note:4.5,goals:null,csc:null,bonus:-1}},
                    {index:9,position:"forward",name:"Benedetto Darío",note:8,goals:2,csc:0},
                    {index:10,position:"forward",name:"Ganago Ignatius",note:null,goals:0,csc:0,substitution:{index:4,position:"backer",name:"Sakai Hiroki",note:5,goals:null,csc:null,bonus:-2}},
                ],
                goals: 2,
                csc: 0,
                goalStop: 0,
                averages: {
                    forward: 5.833333333333333,
                    middle: 4.875,
                    backer: 5,
                    goalkeeper: 5.5,
                },
                bonus: {
                    id: undefined,
                    target: undefined,
                },
                opponentBonus: {
                    id:5,
                    target:undefined,
                },
                chapronIndex:[],
            },
        });
    });

    it("Remplace 1 joueur parmi les 20 joueurs de champs par un Rotaldo", () => {
        return matchWrapper.vm.applyChapronBonus().then(function () {
            let scoreTotal = 0;
            for (let obj of Object.entries(matchWrapper.vm.possibleResults)) {
                scoreTotal += obj[1].chapronTarget.length;
            }
            expect(scoreTotal).to.be.equals(20);
        });
    });

    it("Ne remplace pas les Rotaldo", () => {
        matchWrapper.vm.home.team[1] = {
            index: 1,
            name: "Rotaldo",
            note: 2.5,
            position:"backer",
            goals: 0,
            csc: 0,
        };
        return matchWrapper.vm.applyChapronBonus().then(function () {
            let scoreTotal = 0;
            for (let obj of Object.entries(matchWrapper.vm.possibleResults)) {
                scoreTotal += obj[1].chapronTarget.length;
            }
            expect(scoreTotal).to.be.equals(19);
        });
    });

    it("Remplace 2 joueurs parmi les 20 joueurs de champs par un Rotaldo si chaque équipe utilise le Chapron Rouge", () => {
        return matchWrapper.vm.applyMultipleChapronBonus().then(function () {
            let scoreTotal = 0;
            for (let obj of Object.entries(matchWrapper.vm.possibleResults)) {
                scoreTotal += obj[1].chapronTarget.length;
            }
            expect(scoreTotal).to.be.equals(20*19);
        });
    }).timeout(3000);

    it("Ne remplace pas les Rotaldo", () => {
        matchWrapper.vm.home.team[1] = {
            index: 1,
            name: "Rotaldo",
            note: 2.5,
            position:"backer",
            goals: 0,
            csc: 0,
        };
        return matchWrapper.vm.applyMultipleChapronBonus().then(function () {
            let scoreTotal = 0;
            for (let obj of Object.entries(matchWrapper.vm.possibleResults)) {
                scoreTotal += obj[1].chapronTarget.length;
            }
            expect(scoreTotal).to.be.equals(19*18);
        });
    }).timeout(3000);
});

describe("Bonus : Miroir", () => {
    let matchWrapper;
    let teamWrapper;

    beforeEach(() => {
        matchWrapper = shallowMount(MPGMatch);
        teamWrapper = shallowMount(MPGTeam);
    });

    it("Retourne la valise de l'adversaire contre lui", () => {
        matchWrapper.setData({
            home: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [], bonus: { id: 0 } }, // Valise
            away: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [], bonus: { id: 6 } }, // Miroir
        });
        expect(matchWrapper.vm.awayGoals).to.be.equals(2);
        expect(matchWrapper.vm.homeGoals).to.be.equals(1);
    });

    it("Retourne la Zahia de l'adversaire contre lui", () => {
        teamWrapper.setData({
            starters: [
                { index: 0, position: "backer", name: "Basile Boli", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "middle", name: "Didier Deschamps", note: 6, goals: 1, csc: 0 },
            ],
            bonus: { id: 6 }, // Miroir
        });
        teamWrapper.setProps({
            opponentBonus: { id: 1 }, // Zahia
        });
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(6.5);
        expect(teamWrapper.vm.finalTeam.team[1].note).to.be.equals(6.5);

        teamWrapper.setData({
            bonus: { id: 1 }, // Zahia
        });
        teamWrapper.setProps({
            opponentBonus: { id: 6 }, // Miroir
        });
        expect(teamWrapper.vm.finalTeam.team[0].note).to.be.equals(6);
        expect(teamWrapper.vm.finalTeam.team[1].note).to.be.equals(6);
    });
});
