<template>
    <div>
        <select v-model="substitute" @change="defineSubstitution">
            <option v-for="i in 7" :key="i" :value="i-1" v-html="getSubstituteName(i-1)"></option>
        </select>
        <span> remplace </span>
        <select v-model="starter" @change="defineSubstitution">
            <option v-for="i in 11" :key="i" :value="i-1" v-html="getStarterName(i-1)"></option>
        </select>
        <span> si note inférieure à </span>
        <input type="number" step="0.5" min="0" max="10" v-model="note" @input="defineSubstitution"/>
    </div>
</template>

<script>
export default {
    name: "MPGSubstitution",
    data: function () {
        return {
            starter: "",
            substitute: "",
            note: 5,
        };
    },
    props: {
        index: {
            type: Number,
            required: true,
        },
        substitution: {
            type: Object,
            required: true,
        },
        starters: {
            type: Array,
            required: false,
        },
        substitutes: {
            type: Array,
            required: false,
        },
    },
    methods: {
        defineSubstitution: function () {
            this.$emit("select", this.index, {
                index: this.index,
                starter: this.starter,
                substitute: this.substitute,
                note: Number(this.note),
            });
        },
        getStarterName: function (index) {
            if (this.starters[index]) {
                return this.starters[index].name;
            }
        },
        getSubstituteName: function (index) {
            if (this.substitutes[index]) {
                return this.substitutes[index].name;
            }
        },
    },
    watch: {
        substitution: function () {
            this.starter = this.substitution.starter;
            this.substitute = this.substitution.substitute;
            this.note = this.substitution.note;
        },
    },
};
</script>

<style scoped lang="scss">
    select {
        height: 25px;
    }
</style>
