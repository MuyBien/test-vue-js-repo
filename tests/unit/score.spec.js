import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGTeam from "@/components/MPGTeam.vue";
import MPGMatch from "@/components/MPGMatch.vue";
import MPGScore from "@/components/MPGScore.vue";

describe("Score", () => {
    let componentWrapper;
    let matchWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGTeam);
        matchWrapper = shallowMount(MPGMatch);
    });

    it("comptabilise les buts de l'équipe finale", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "backer", note: 6, goals: 2, csc: 0 },
            ],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.goals).to.be.equals(3);
    });

    it("comptabilise les buts de l'équipe finale même avec des undefined", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", note: 6, goals: 1, csc: 0 },
                { index: 1, position: "backer", note: 6, goals: 2, csc: 0 },
                { index: 2, position: "backer", note: 6, goals: undefined, csc: 0 },
            ],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.goals).to.be.equals(3);
    });

    it("ne comptabilise pas les buts de joueurs remplacés", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, goals: 1, csc: 0 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 0 }],
            substitutes: [{ index: 0, position: "backer", note: 5, goals: 0, csc: 0 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 7 }],
        });
        expect(componentWrapper.vm.finalTeam.goals).to.be.equals(2);
    });

    it("comptabilise les CSC de l'équipe finale", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 6, goals: 1, csc: 1 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 1 }],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.csc).to.be.equals(2);
    });

    it("comptabilise les CSC de l'équipe finale même avec des undefined", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", note: 6, goals: 1, csc: 1 },
                { index: 1, position: "backer", note: 6, goals: 2, csc: 1 },
                { index: 2, position: "backer", note: 6, goals: 2, csc: undefined },
            ],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.csc).to.be.equals(2);
    });

    it("ne comptabilise pas les CSC de joueurs remplacés", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "backer", note: 3, goals: 0, csc: 1 }, { index: 1, position: "backer", note: 6, goals: 2, csc: 1 }],
            substitutes: [{ index: 0, position: "backer", note: 5, goals: 0, csc: 0 }],
            substitutions: [{ index: 0, starter: 0, substitute: 0, note: 5 }],
        });
        expect(componentWrapper.vm.finalTeam.csc).to.be.equals(1);
    });

    it("ajoute un arrêt MPG si la note du gardien le permet", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: 8, goals: 0, csc: 0 }],
            substitutes: [],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.goalStop).to.be.equals(1);
    });

    it("ajoute un arrêt MPG si la note du remplacant du gardien le permet", () => {
        componentWrapper.setData({
            starters: [{ index: 0, position: "goalkeeper", note: undefined, goals: 0, csc: 0 }],
            substitutes: [{ index: 0, position: "goalkeeper", note: 8, goals: 0, csc: 0 }],
            substitutions: [],
        });
        expect(componentWrapper.vm.finalTeam.goalStop).to.be.equals(1);
    });

    it("enlève un but au score si un des deux gardiens réalise un arrêt MPG", () => {
        matchWrapper.setData({
            home: { team: [], goals: 2, csc: 0, goalStop: 0, averages: [] },
            away: { team: [], goals: 0, csc: 0, goalStop: 1, averages: [] },
        });
        expect(matchWrapper.vm.homeGoals).to.be.equals(1);
    });

    it("n'enlève pas un but CSC au score même si le gardien adverse a une note de 8 (Marçal jurisprudence)", () => {
        matchWrapper.setData({
            home: { team: [], goals: 0, csc: 0, goalStop: 0, averages: [] },
            away: { team: [], goals: 0, csc: 1, goalStop: 1, averages: [] },
        });
        expect(matchWrapper.vm.homeGoals).to.be.equals(1);
    });
});

describe("Affichage du score", () => {
    let scoreWrapper;

    beforeEach(() => {
        scoreWrapper = shallowMount(MPGScore);
    });

    it("Tri les résultats possibles par ordre décroissant", () => {
        scoreWrapper.setProps({
            possibleResults : {
                "2-2":{ homeGoals:2, awayGoals:2, score:"2-2", chapronTarget:["Djiku Alexander"]},
                "4-2":{ homeGoals:4, awayGoals:2, score:"4-2", chapronTarget:["González Álvaro","Hilton ","Foket Thomas","Bobichon Antonin","Bourigeaud Benjamin","Mama Baldé ","Júlio Tavares ","Maripán Guillermo","Aguilar Ruben","Pedro Mendes ","Claude Maurice Alexis","Bakayoko Tiemoué","Payet Dimitri","Thauvin Florian","Germain Valère","Ganago Ignatius"]},
                "3-2":{ homeGoals:3, awayGoals:2, score:"3-2", chapronTarget:["Jovetic Stevan","Ajorque Ludovic"]},
                "4-0":{ homeGoals:4, awayGoals:0, score:"4-0", chapronTarget:["Benedetto Darío"]},
            },
        });
        expect(scoreWrapper.vm.orderedPossibleResults.length).to.be.equals(4);
        expect(scoreWrapper.vm.orderedPossibleResults[0].score).to.be.equals("4-2");
        expect(scoreWrapper.vm.orderedPossibleResults[1].score).to.be.equals("3-2");
    });

    it("Peut calculer la probabilité d'un score", () => {
        scoreWrapper.setProps({
            possibleResults : {
                "2-2":{ homeGoals:2, awayGoals:2, score:"2-2", chapronTarget:["Djiku Alexander"]},
                "4-2":{ homeGoals:4, awayGoals:2, score:"4-2", chapronTarget:["González Álvaro","Hilton ","Foket Thomas","Bobichon Antonin","Bourigeaud Benjamin","Mama Baldé ","Júlio Tavares ","Maripán Guillermo","Aguilar Ruben","Pedro Mendes ","Claude Maurice Alexis","Bakayoko Tiemoué","Payet Dimitri","Thauvin Florian","Germain Valère","Ganago Ignatius"]},
                "3-2":{ homeGoals:3, awayGoals:2, score:"3-2", chapronTarget:["Jovetic Stevan","Ajorque Ludovic"]},
                "4-0":{ homeGoals:4, awayGoals:0, score:"4-0", chapronTarget:["Benedetto Darío"]},
            },
        });
        const prob = scoreWrapper.vm.getScoreProbability("4-2");
        expect(prob).to.be.equals(80);
    });

    it("Affiche un bouton pour lancer le calcul des probabilités de score si un des joueurs utilise un Chapron Rouge", () => {
        scoreWrapper.setProps({
            awayBonus: undefined,
            awayGoals: 2,
            homeBonus: 5,
            homeGoals: 4,
        });
        expect(scoreWrapper.find(".chapron-help").exists()).to.be.true;
        expect(scoreWrapper.find(".score-probs button").exists()).to.be.true;
    });

    it("Lance le calcul des probabilités différemment selon si un ou deux chaprons sont utilisés", () => {
        scoreWrapper.vm.computeChapron();
        expect(scoreWrapper.emitted("computeChapron").length).to.be.equals(1);
        scoreWrapper.vm.computeChapron(true);
        expect(scoreWrapper.emitted("computeMultipleChapron").length).to.be.equals(1);
    });

    it("Affiche des probabilités de score si un des joueurs utilise un Chapron Rouge", () => {
        scoreWrapper.setProps({
            awayBonus: undefined,
            awayGoals: 2,
            homeBonus: 5,
            homeGoals: 4,
            possibleResults : {
                "4-0":{ homeGoals:4, awayGoals:0, score:"4-0", chapronTarget:["Benedetto Darío"]},
            },
        });
        expect(scoreWrapper.find(".score-prob").exists()).to.be.true;
    });

    it("Affiche le score si aucun des joueurs n'utilise un Chapron Rouge", () => {
        scoreWrapper.setProps({
            awayBonus: undefined,
            awayGoals: 2,
            homeBonus: undefined,
            homeGoals: 4,
        });
        expect(scoreWrapper.findAll(".score").length).to.be.equals(1);
        expect(scoreWrapper.vm.mostProbResult).to.be.undefined;
        expect(scoreWrapper.vm.otherPossibleResults).to.be.undefined;
    });

});
