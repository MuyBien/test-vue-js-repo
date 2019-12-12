<template>
    <div>
        <select v-model="substitute" @change="defineSubstitution">
            <option v-for="i in 8" :key="i" :value="i-1">Remplaçant #{{i-1}}</option>
        </select>
        <span> remplace </span>
        <select v-model="starter" @change="defineSubstitution">
            <option v-for="i in 12" :key="i" :value="i-1">Titulaire #{{i-1}}</option>
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
    },
};
</script>

<style scoped lang="scss">
    select {
        height: 25px;
    }
</style>
