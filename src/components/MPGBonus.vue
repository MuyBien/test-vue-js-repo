<template>
      <section>
            <div v-for="bonus in bonuses" :key="bonus.id">
                <input type="radio" v-model="selected" :value="bonus.id" @change="selectBonus" /> {{bonus.name}}
            </div>
      </section>
</template>

<script>
export default {
    name: "MPGBonus",
    props: {
        bonus: {
            type: Number,
        },
    },
    data: function () {
        return {
            bonuses: [{
                id: 0,
                name: "La valise à Nanard",
            }],
            selected: "",
        };
    },
    methods: {
        selectBonus: function () {
            this.$emit("select", this.selected);
        },
    },
    watch: {
        bonus: function () {
            this.selected = this.bonus;
        },
    },
};
</script>

<style scoped lang="scss">

</style>
