import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import InputNumber from "@/components/InputNumber.vue";

describe("Input Number", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(InputNumber);
    });

    it("Prend en compte une valeur valide", () => {
        componentWrapper.setProps({
            value: 5,
        });
        expect(componentWrapper.vm.inputValue).to.be.equals(5);
        componentWrapper.vm.updateValue(6);
        expect(componentWrapper.emitted("input")[0][0]).to.be.equals(6);
    });

    it("Ne prend pas en compte une valeur invalide", () => {
        componentWrapper.setProps({
            value: "test",
        });
        expect(componentWrapper.vm.inputValue).to.be.undefined;
        componentWrapper.vm.updateValue("test");
        expect(componentWrapper.emitted("input")[0][0]).to.be.undefined;
    });

    it("Permer d'incrementer la valeur d'un step", () => {
        componentWrapper.setProps({
            value: 5.5,
            step: 0.5,
            max: 6,
        });
        componentWrapper.vm.increment();
        expect(componentWrapper.vm.inputValue).to.be.equals(6);
        componentWrapper.vm.increment();
        expect(componentWrapper.vm.inputValue).to.be.equals(6);
    });

    it("Permer de decrementer la valeur d'un step", () => {
        componentWrapper.setProps({
            value: 5.5,
            step: 0.5,
            min: 5,
        });
        componentWrapper.vm.decrement();
        expect(componentWrapper.vm.inputValue).to.be.equals(5);
        componentWrapper.vm.decrement();
        expect(componentWrapper.vm.inputValue).to.be.equals(5);
    });

    it("Commence à min + step si 1er increment", () => {
        componentWrapper.setProps({
            value: undefined,
            step: 1,
            min: 2,
        });
        componentWrapper.vm.increment();
        expect(componentWrapper.vm.inputValue).to.be.equals(3);
    });

    it("Commence à 0 + step si 1er increment et pas de min défini", () => {
        componentWrapper.setProps({
            value: undefined,
            step: 1,
        });
        componentWrapper.vm.increment();
        expect(componentWrapper.vm.inputValue).to.be.equals(1);
    });

    it("Commence à max - step si 1er decrement", () => {
        componentWrapper.setProps({
            value: undefined,
            step: 1,
            max: 7,
        });
        componentWrapper.vm.decrement();
        expect(componentWrapper.vm.inputValue).to.be.equals(6);
    });

    it("Ne fait rien si 1er decrement et pas de max défini", () => {
        componentWrapper.setProps({
            value: undefined,
            step: 1,
        });
        componentWrapper.vm.decrement();
        expect(componentWrapper.vm.inputValue).to.be.undefined;
    });

    it("Se met en erreur si la valeur est trop grande", () => {
        componentWrapper.setProps({
            value: 11,
            max: 10,
        });expect(componentWrapper.vm.tooBig).to.be.true;
    });

    it("Se met en erreur si la valeur est trop petite", () => {
        componentWrapper.setProps({
            value: 1,
            min: 2,
        });
        expect(componentWrapper.vm.tooSmall).to.be.true;
    });

    it("Se met en erreur si la valeur ne correspond pas au step défini", () => {
        componentWrapper.setProps({
            value: 2.3,
            step: 1,
        });
        expect(componentWrapper.vm.badStep).not.to.be.equals(0);
    });
});
