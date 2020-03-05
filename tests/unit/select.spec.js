import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import SelectList from "@/components/SelectList.vue";

describe("Selecteur de joueur", () => {
    let componentWrapper;

    beforeEach(() => {
        componentWrapper = shallowMount(SelectList, {
            propsData: {
                options: [
                    {id: 1, label: "label1", name: "Name1", value: "value1"},
                    {id: 2, label: "label2", name: "Name2", value: "value2"},
                    {id: 3, label: "label3", name: "Name3", value: "value3"},
                ],
            },
        });
    });

    it("Génére un ID diférent pour chaque instance", () => {
        const componentWrapper2 = shallowMount(SelectList, {
            propsData: {
                options: [],
            },
        });
        expect(componentWrapper.vm.datalistID).to.be.not.equal(componentWrapper2.vm.datalistID);
    });

    it("Génére un tableau de valeur selon le trackBy fourni", () => {
        componentWrapper.setProps({
            trackBy: "id",
        });
        expect(componentWrapper.vm.optionsValues).to.includes(1);
        expect(componentWrapper.vm.optionsValues).to.includes(2);
        expect(componentWrapper.vm.optionsValues).to.includes(3);
    });

    it("Génére un tableau de valeur selon le trackBy sous forme de function", () => {
        componentWrapper.setProps({
            trackBy: function (option) {
                return "#" + option.id;
            },
        });
        expect(componentWrapper.vm.optionsValues).to.includes("#1");
        expect(componentWrapper.vm.optionsValues).to.includes("#2");
        expect(componentWrapper.vm.optionsValues).to.includes("#3");
    });

    it("Génére un tableau de valeur selon 'value' si aucun trackBy fourni", () => {
        expect(componentWrapper.vm.optionsValues).to.includes("value1");
        expect(componentWrapper.vm.optionsValues).to.includes("value2");
        expect(componentWrapper.vm.optionsValues).to.includes("value3");
    });

    it("Récupére le label d'une option selon le label fourni", () => {
        componentWrapper.setProps({
            label: "name",
        });
        let optionLabel = componentWrapper.vm.getOptionLabel(componentWrapper.vm.options[0]);
        expect(optionLabel).to.be.equal("Name1");
    });

    it("Récupére le label d'une option selon le 'label' si auncun label fourni", () => {
        let optionLabel = componentWrapper.vm.getOptionLabel(componentWrapper.vm.options[0]);
        expect(optionLabel).to.be.equal("label1");
    });
});
