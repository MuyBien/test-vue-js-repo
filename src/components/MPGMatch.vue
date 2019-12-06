<template>
    <section class="match">
        <MPGTeam :home="true"></MPGTeam>
        <MPGTeam :home="false"></MPGTeam>
    </section>
</template>

<script>
import MPGTeam from "../components/MPGTeam.vue";

export default {
    name: "MPGMatch",
    components: {
        MPGTeam,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .match {
        display: flex;
        justify-content: space-around;
    }
</style>
