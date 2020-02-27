<template>
    <div>
        <input type="search" :placeholder="placeholder" :value="value" @focus="showOptions=true" @input="updateValue($event.target.value)" :list="datalistID" ref="input" />
        <datalist :id="datalistID" v-if="showOptions">
            <option v-for="option in options"  :key="getOptionValue(option)" :value="getOptionValue(option)">
                {{getOptionLabel(option)}}
            </option>
        </datalist>
    </div>
</template>

<script>
export default {
    name: "SelectList",
    props: {
        value: {
            type: String,
        },
        options: {
            type: Array,
            required: true,
        },
        trackBy: {
            type: [String, Function],
            required: false,
            default: "value",
        },
        label: {
            type: [String, Function],
            required: false,
            default: "label",
        },
        placeholder: {
            type: String,
            required: false,
        },
    },
    data: function () {
        return {
            showOptions: false,
        };
    },
    computed: {
        optionsValues: function () {
            return this.options.map(function (option) {
                return this.getOptionValue(option);
            }, this);
        },
        datalistID: function () {
            return "gen-" + Date.now() + "-" + Math.random().toString(36).slice(2);
        },
    },
    methods: {
        updateValue: function (value) {
            if (this.optionsValues.includes(value)) {
                this.$emit("input", value);
                this.$refs.input.blur();
            }
        },
        getOptionValue: function (option) {
            if (typeof this.trackBy === "function") {
                return this.trackBy(option);
            }
            return option[this.trackBy];
        },
        getOptionLabel: function (option) {
            if (typeof this.label === "function") {
                return this.label(option);
            }
            return option[this.label];
        },
    },
};
</script>
