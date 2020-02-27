<template>
    <div class="input-wrapper">
        <span class="input-addon before" @click="decrement">-</span>
        <input type="number"
            :class="{invalid: invalid}"
            :step="step"
            :value="inputValue"
            :min="min"
            :max="max"
            @input="updateValue($event.target.value)"
            :placeholder="placeholder"
            :aria-label="placeholder" />
        <span class="input-addon after" @click="increment">+</span>

        <p class="validation-message" v-if="invalid">
            <span v-if="tooBig">La valeur ne peut pas être supérieure à {{max}}</span>
            <span v-if="tooSmall">La valeur ne peut pas être inférieure à {{min}}</span>
            <span v-if="badStep">Mauvaise valeur</span>
        </p>
    </div>
</template>

<script>
export default {
    name: "input-number",
    props: {
        value: {
            type: [ Number, String ],
        },
        step: {
            type: Number,
            default: 1,
        },
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
        placeholder: {
            type: String,
        },
    },
    data: function () {
        return {
            inputValue: undefined,
        };
    },
    computed: {
        tooBig: function () {
            return this.value > this.max;
        },
        tooSmall: function () {
            return this.value < this.min;
        },
        badStep: function () {
            return this.value % this.step;
        },
        invalid: function () {
            return this.tooBig || this.tooSmall || this.badStep;
        },
    },
    methods: {
        updateValue: function (value) {
            let finalValue = parseFloat(value);
            if (isNaN(finalValue)) {
                finalValue = undefined;
            }
            this.$emit("input", finalValue);
        },
        /**
    * Incremente la valeur présente.
    * Si aucune valeur n'est présente, il commence à partir du min
    * Si aucun min n'est défini, il commence à 0
    **/
        increment: function () {
            if (typeof this.inputValue === "undefined") {
                this.inputValue = typeof this.min !== "undefined" ? this.min : 0;
            }
            this.inputValue += this.step;
            if (typeof this.max !== "undefined") {
                this.inputValue = parseFloat(this.inputValue) > this.max ? this.max : this.inputValue;
            }
            this.updateValue(this.inputValue);
        },
        /**
    * Décremente la valeur présente.
    * Si aucune valeur n'est présente, il commence à partir du max
    * Si aucun max n'est défini, il ne fait rien
    **/
        decrement: function () {
            if (typeof this.inputValue === "undefined") {
                if (typeof this.max !== "undefined") {
                    this.inputValue = this.max;
                } else {
                    return;
                }
            }
            this.inputValue -= this.step;
            if (typeof this.min !== "undefined") {
                this.inputValue = parseFloat(this.inputValue) < this.min ? this.min : this.inputValue;
            }
            this.updateValue(this.inputValue);
        },
    },
    watch: {
        value: function () {
            this.inputValue = this.value;
        },
    },
};
</script>

<style lang="scss">
    $input-height: 30px;
    $color-success: #67c23a;
    $color-error: #f56c6c;
    $primary-color: #ddd;

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 5px;

        input {
            height: $input-height;
            box-sizing: border-box;
            -moz-appearance: textfield;
            padding: 0 5px;
            width: 40px;
            border: 1px solid $primary-color;
            &.invalid {
                border-color: $color-error;
            }
            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }
            &::placeholder {
                font-size: .7em;
            }
        }

        .input-addon {
            display: inline-block;
            cursor: pointer;
            border: 1px solid $primary-color;
            border-radius: 3px;
            width: 20px;
            height: $input-height;
            line-height: $input-height;
            box-sizing: border-box;
            background: $primary-color;
            text-align: center;
            user-select: none;
            transition: .3s all ease-out;
            &:hover {
                background: #bbb;
            }
            &:active {
                border-color: rgba(82, 168, 236, 0.8);
                background: #ccc;
            }
            &.before {
                border-right: 0;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
            &.after {
                border-left: 0;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }

        .validation-message {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            margin: 2px 0;
            font-size: .8em;
            color: $color-error;
            border-left: 2px solid $color-error;
            padding-left: 5px;

            img {
                height: 25px;
            }
            span {
                margin-left: 10px;
            }
        }
    }
</style>
