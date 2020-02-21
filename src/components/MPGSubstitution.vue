<template>
    <div>
        <select v-model="substitute" @change="defineSubstitution">
            <option value=""></option>
            <option v-for="availableSubstitute in availableSubstitutes" :key="availableSubstitute.index" :value="availableSubstitute.index" v-html="availableSubstitute.name"></option>

        </select>
        <span> remplace </span>
        <select v-model="starter" @change="defineSubstitution">
            <option value=""></option>
            <option v-for="availableStarter in availableStarters" :key="availableStarter.index" :value="availableStarter.index" v-html="availableStarter.name"></option>
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
            starter: undefined,
            substitute: undefined,
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
    computed: {
        availableStarters: function () {
            if (this.substitute || this.substitute === 0) {
                return this.starters.filter(function (starter) {
                    return starter.position === this.substitutes[this.substitute].position;
                }, this);
            }
            return this.starters.filter(function (starter) {
                return starter.position !== "goalkeeper" && starter.name;
            }, this);
        },
        availableSubstitutes: function () {
            if (this.starter || this.starter === 0) {
                return this.substitutes.filter(function (substitute) {
                    return substitute.position === this.starters[this.starter].position;
                }, this);
            }
            return this.substitutes.filter(function (substitute) {
                return substitute.position !== "goalkeeper" && substitute.name;
            }, this);
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
