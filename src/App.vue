<template>
  <div id="app">
    <nav class="topbar">
      <img alt="Logo MPG" src="./assets/logo.png">
      <h1>Calculateur de résultat de match MPG</h1>
    </nav>

    <MPGMatch></MPGMatch>

    <Feedback></Feedback>
  </div>
</template>

<script>
import MPGMatch from "./components/MPGMatch.vue";
import Feedback from "./components/Feedback.vue";

export default {
    name: "App",
    components: {
        MPGMatch,
        Feedback,
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
        z-index: 10;
        height: 10vh;
        min-height: 60px;
        background-color: #45c945;
        overflow: visible;
        display: flex;
        padding: 0 3vw 0 10px;
        align-items: center;
        color: #fff;
        justify-content: flex-end;
        box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0), 0px 1px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12);

        img {
            height: 100%;
            position: absolute;
            bottom: -50%;
            left: 10px;
        }
        h1 {
            font-size: 1rem;
        }
    }

    @media screen and (max-width: 900px) {
        nav.topbar {
            img {
                height: 6vh;
                bottom: 2vh;
            }
        }
    }
</style>
