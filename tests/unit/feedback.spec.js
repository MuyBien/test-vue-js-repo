import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Feedback from "@/components/Feedback.vue";

describe("Feedback", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(Feedback);
    });

    it("Construit une URL d'envoi de mail valide", () => {
        expect(componentWrapper.vm.href).to.include("mailto:");
        expect(componentWrapper.vm.href).to.include(componentWrapper.vm.mail);
        expect(componentWrapper.vm.href).to.include(encodeURIComponent(componentWrapper.vm.body));
    });
});
