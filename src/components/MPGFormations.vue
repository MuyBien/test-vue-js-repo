<template>
    <div class="formations">
        <div class="formation" role="button" @click="setFormation({'backer': 5, 'middle': 4, 'forward': 1})">
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
        <div class="formation" role="button" @click="setFormation({'backer': 5, 'middle': 3, 'forward': 2})">
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
        <div class="formation" role="button" @click="setFormation({'backer': 4, 'middle': 4, 'forward': 2})">
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
    </div>
</template>

<script>
export default {
    name: "MPGFormations",
    methods: {
        setFormation: function (formation) {
            this.$emit("formation", formation);
        },
    },
};
</script>

<style scoped lang="scss">
    .formations {
        margin: 10px 0;
        .formation {
            display: inline-block;
            padding: 3px 5px;
            border: 1px solid #e5eaee;
            border-radius: 3px;
            background: #fff;
            cursor: pointer;
        }
    }
</style>
