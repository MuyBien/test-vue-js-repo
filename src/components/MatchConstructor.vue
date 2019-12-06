<template>
    <section class="match">
        <TeamConstructor :home="true"></TeamConstructor>
        <TeamConstructor :home="false"></TeamConstructor>
    </section>
</template>

<script>
import TeamConstructor from "../components/TeamConstructor.vue";

export default {
    name: "MPGMatch",
    components: {
        TeamConstructor,
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
