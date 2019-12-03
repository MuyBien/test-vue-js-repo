<template>
  <div id="app">
    <nav class="topbar">
      <img alt="Logo MPG" src="./assets/logo.png">
      <h1>Calculateur de résultat de match MPG</h1>
    </nav>

    <TeamConstructor :home="true"></TeamConstructor>
  </div>
</template>

<script>
import TeamConstructor from "./components/TeamConstructor.vue";

export default {
    name: "App",
    components: {
        TeamConstructor,
    },
};
</script>

<style lang="scss">
    body {
        margin: 0;
    }
    #app {
      font-family: 'Roboto', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
    }
    nav.topbar {
        position: sticky;
        top: 0;
        height: 10vh;
        background-color: #45c945;
        overflow: hidden;
        display: flex;
        padding: 0 3vw;
        align-items: center;
        color: #fff;
        justify-content: space-between;
        box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0), 0px 1px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12);

        img {
            height: 5vh;
        }
        h1 {
            font-size: 3vh;
        }
    }
</style>
