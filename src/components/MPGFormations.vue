<template>
    <div class="formations">
        <div class="formation" :class="{selected: isSelected('541')}" role="button" @click="setFormation({'backer': 5, 'middle': 4, 'forward': 1})">
          <svg width="45" height="45" viewBox="745 422 45 42">
            <text fill="none" style="font-size: 10px; font-weight: bold;">
              <tspan x="757" y="433" fill="#959DAF">5 4 1</tspan>
            </text>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="762.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="772.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="782.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="752.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="757.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="747.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="767.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="777.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="787.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="767.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
          </svg>
        </div>
        <div class="formation" :class="{selected: isSelected('532')}" role="button" @click="setFormation({'backer': 5, 'middle': 3, 'forward': 2})">
          <svg width="45" height="45" viewBox="811 422 45 42">
            <text fill="none" style="font-size: 10px; font-weight: bold;">
              <tspan x="823" y="433" fill="#959DAF">5 3 2</tspan>
            </text>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="823.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="833.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="843.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="853.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="813.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="828.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="838.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="823.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="833.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="843.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
          </svg>
        </div>
        <div class="formation" :class="{selected: isSelected('451')}" role="button" @click="setFormation({'backer': 4, 'middle': 5, 'forward': 1})">
          <svg width="45" height="45" viewBox="877 422 45 42">
            <text fill="none" style="font-size: 10px; font-weight: bold;">
              <tspan x="889" y="433" fill="#959DAF">4 5 1</tspan>
            </text>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="889.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="899.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="899.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="909.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="919.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="879.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="894.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="884.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="904.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="914.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
          </svg>
        </div>
        <div class="formation" :class="{selected: isSelected('442')}" role="button" @click="setFormation({'backer': 4, 'middle': 4, 'forward': 2})">
          <svg width="45" height="45" viewBox="948 422 36 42">
            <text fill="none" style="font-size: 10px; font-weight: bold;">
              <tspan x="954" y="433" fill="#959DAF">4 4 2</tspan>
            </text>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="950.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="960.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="970.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="980.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="950.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="960.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="970.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="980.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="960.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="970.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
          </svg>
        </div>
        <div class="formation" :class="{selected: isSelected('433')}" role="button" @click="setFormation({'backer': 4, 'middle': 3, 'forward': 3})">
          <svg width="45" height="45" viewBox="1014 422 36 42">
            <text fill="none" style="font-size: 10px; font-weight: bold;">
              <tspan x="1021" y="433" fill="#959DAF">4 3 3</tspan>
            </text>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1016.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1026.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1036.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1046.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1021.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1031.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1041.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1021.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1031.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1041.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
          </svg>
        </div>
        <div class="formation" :class="{selected: isSelected('343')}" role="button" @click="setFormation({'backer': 3, 'middle': 4, 'forward': 3})">
          <svg width="45" height="45" viewBox="1146 422 36 42">
            <text fill="none" style="font-size: 10px; font-weight: bold;">
              <tspan x="1152" y="433" fill="#959DAF">3 4 3</tspan>
            </text>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1158.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1168.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1178.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1148.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1163.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1153.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1173.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1163.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1153.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1173.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
          </svg>
        </div>
        <div class="formation" :class="{selected: isSelected('352')}" role="button" @click="setFormation({'backer': 3, 'middle': 5, 'forward': 2})">
          <svg width="45" height="45" viewBox="1075 422 45 42">
            <text fill="none"
                  style="font-size: 10px; font-weight: bold;">
              <tspan x="1086" y="433" fill="#959DAF">3 5 2</tspan>
            </text>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1087.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1097.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1092.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1102.5" cy="461.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1107.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1117.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1077.5" cy="451.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1097.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1087.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
            <ellipse fill="#959DAF" fill-rule="evenodd" cx="1107.5" cy="441.5" rx="2.5" ry="2.5"></ellipse>
          </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: "MPGFormations",
    data: function () {
        return {
            selected: "",
        };
    },
    methods: {
        setFormation: function (formation) {
            this.selected = "" + formation.backer + formation.middle + formation.forward;
            this.$emit("formation", formation);
        },
        isSelected: function (shortFormation) {
            return shortFormation === this.selected;
        },
    },
};
</script>

<style scoped lang="scss">
.formations {
    display: flex;
    margin: 10px 0;
    justify-content: flex-start;
    flex-wrap: wrap;
    .formation {
        display: inline-block;
        padding: 3px 5px;
        margin: 5px;
        border: 1px solid #e5eaee;
        border-radius: 3px;
        background: #fff;
        cursor: pointer;
        transition: border-color .2s ease-out;
        &:active, &.selected {
          border-color: hsla(120, 55%, 45%, 1);
        }
    }
}
</style>
