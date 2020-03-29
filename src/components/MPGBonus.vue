<template>
    <section class="bonuses">
        <div class="bonus">
            <input type="radio" :id="'no-bonus-' + scopedId" v-model="selected" :value="undefined" @change="selectBonus" />
            <label class="no-bonus" :for="'no-bonus-' + scopedId">
                <span>Aucun</span>
            </label>
        </div>
        <div v-for="bonus in bonuses" :key="bonus.id" class="bonus">
            <input type="radio" :id="'bonus-' + bonus.id + scopedId" v-model="selected" :value="bonus.id" @change="selectBonus" />
            <label :style="'background-image:url(/img/bonus/' + bonus.image + '.png)'" :for="'bonus-' + bonus.id + scopedId" :title="bonus.name"></label>
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
                image: "valise",
            },{
                id: 1,
                name: "Zahia",
                image: "zahia",
            }],
            selected: undefined,
        };
    },
    computed: {
        scopedId: function () {
            return "gen-" + Date.now() + "-" + Math.random().toString(36).slice(2);
        },
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
    .bonuses {
        display: flex;
        margin: 10px 0;
        input {
            margin: 0;
            padding: 0;
            appearance: none;
        }
    }
    .bonus {
      display: flex;
        margin: 0 5px;
        label {
            cursor: pointer;
            background-size: contain;
            background-repeat: no-repeat;
            display: inline-block;
            width: 70px;
            height: 70px;
            transition: all 100ms ease-in;
            filter: brightness(1.8) grayscale(1) opacity(.7);
        }
    }
    .bonus label:hover {
        filter: brightness(1.2) grayscale(.5) opacity(.9);
    }
    .bonus input:active + label {
        opacity: .9;
    }
    .bonus input:checked + label {
        filter: none;
        color: #6c77b7;
    }
    .bonus label.no-bonus {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.9em;
        border: 2px solid #6c77b7;
        border-radius: 100%;
        background-color: #c6ceef;
        color: #333;
    }
</style>
