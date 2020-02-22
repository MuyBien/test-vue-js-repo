import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import SelectList from "@/components/SelectList.vue";

describe("Selecteur de valeur", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(SelectList);
    });

    it("calcule la moyenne de chaque ligne", () => {
        componentWrapper.setData({
            starters: [
                { index: 0, position: "backer", note: 6, goals: 0, csc: 0 },
                { index: 1, position: "backer", note: 5, goals: 0, csc: 0 },
                { index: 2, position: "backer", note: 4, goals: 0, csc: 0 },
            ],
        });
        expect(componentWrapper.vm.averages.backer).to.be.equals(5);
    });

});
