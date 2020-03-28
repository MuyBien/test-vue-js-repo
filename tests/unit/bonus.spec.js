import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MPGBonus from "@/components/MPGBonus.vue";

describe("Bonus", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(MPGBonus);
    });

    it("Propose tous les bonus possibles", () => {
        componentWrapper.setProps({
            bonus: 0,
        });
        expect(componentWrapper.vm.selected).to.equals(0);
    });
});
