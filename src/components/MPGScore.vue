<template>
    <div class="main" data-tour-step="11">
        <div class="score-probs" v-if="homeBonus === 5 || awayBonus === 5">
            <div class="chapron-help">
                <p>Pour obtenir les scores possibles, paramétrez les équipes puis cliquez sur le bouton de calcul.</p>
                <p>Les probabilités doivent être recalculées à chaque changement !</p>
            </div>

            <button v-if="homeBonus === 5 && awayBonus === 5" @click="computeChapron(true)">Calculer les probabilités</button>
            <button v-else @click="computeChapron(false)">Calculer les probabilités</button>

            <div class="score-prob" v-if="possibleResults">
                <div class="score most-probable" v-if="mostProbResult">
                    <p class="team-score" :class="{winner: mostProbResult.homeGoals > mostProbResult.awayGoals}">{{mostProbResult.homeGoals}}</p>
                    <p class="team-score" :class="{winner: mostProbResult.awayGoals > mostProbResult.homeGoals}">{{mostProbResult.awayGoals}}</p>
                    <p class="score-probability" :title="mostProbResult.chapronTarget.join(', ')">{{getScoreProbability(mostProbResult.score)}}%</p>
                </div>
                <div class="other-scores">
                    <div class="score" v-for="(resultProb, index) in otherPossibleResults" :key="index">
                        <p class="team-score" :class="{winner: resultProb.homeGoals > resultProb.awayGoals}">{{resultProb.homeGoals}}</p>
                        <p class="team-score" :class="{winner: resultProb.awayGoals > resultProb.homeGoals}">{{resultProb.awayGoals}}</p>
                        <p class="score-probability" :title="resultProb.chapronTarget.join(', ')">{{getScoreProbability(resultProb.score)}}%</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="score" v-else>
            <p class="team-score" :class="{winner: homeGoals > awayGoals}">{{homeGoals}}</p>
            <p class="team-score" :class="{winner: awayGoals > homeGoals}">{{awayGoals}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "MPGScore",
    data: function () {
        return {
            loading: false,
        };
    },
    props: {
        homeGoals: {
            type: Number,
        },
        awayGoals: {
            type: Number,
        },
        homeBonus: {
            type: Number,
        },
        awayBonus: {
            type: Number,
        },
        possibleResults: {
            type: Object,
        },
    },
    computed: {
        orderedPossibleResults: function () {
            if (this.possibleResults) {
                let allPossibleResults = Object.values(this.possibleResults);
                return allPossibleResults.sort(function (a, b) {
                    return b.chapronTarget.length - a.chapronTarget.length;
                });
            }
            return [];
        },
        mostProbResult: function () {
            if (this.orderedPossibleResults.length) {
                return this.orderedPossibleResults[0];
            }
            return undefined;
        },
        otherPossibleResults: function () {
            if (this.orderedPossibleResults.length) {
                return this.orderedPossibleResults.slice(1, this.orderedPossibleResults.length);
            }
            return undefined;
        },
    },
    methods: {
        computeChapron: function (multiple) {
            this.loading = true;
            if (multiple) {
                this.$emit("computeMultipleChapron");
            } else {
                this.$emit("computeChapron");
            }
        },
        getScoreProbability: function (score) {
            let scoreOccurences = this.possibleResults[score].chapronTarget.length;
            let scoreTotal = 0;
            for (let obj of Object.entries(this.possibleResults)) {
                scoreTotal += obj[1].chapronTarget.length;
            }
            return Math.round((scoreOccurences * 100) / scoreTotal);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    button {
        margin: 0 5px;
        border: none;
        background-color: #4054cc;
        padding: 5px 10px;
        outline: none;
        border-radius: 3px;
        color: #fff;
        font-size: .8rem;
        cursor: pointer;
    }
    button:hover {
        background-color: #4460a0;
    }

    .score {
        position: relative;
        display: flex;
        justify-content: center;
        .team-score {
            border: 1px solid #333;
            display: inline-block;
            padding: 20px 25px;
            margin: 15px 5px 15px 0px;
            border-radius: 5px;
            font-size: 2em;
            font-weight: bold;
            &.winner {
                border-bottom: 10px solid #45c945;
            }
        }

        p.score-probability {
            position: absolute;
            bottom: calc(50% - 20px);
            margin: 0;
            padding: 5px;
            border-radius: 50%;
            font-size: .8em;
            text-align: center;
            line-height: 20px;
            background-color: #4054cb;
            color: #fff;
            font-weight: bold;
            cursor: help;
        }
    }

    .other-scores {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .score {
            margin: 0 20px;
            p.team-score {
                font-size: 1em;
                padding: 15px 18px;
            }
            p.score-probability {
                font-size: 0.6em;
                bottom: calc(50% - 15px);
                line-height: 15px;
            }
        }
    }

    .chapron-help {
        width: 60%;
        margin: 5px auto;
        background-color: #4054cc78;
        color: #fff;
        border-radius: 5px;
        padding: 5px 2px;
        font-size: .8em;
        line-height: .6em;
        p:last-child {
            font-weight: bold;
        }
    }
</style>
