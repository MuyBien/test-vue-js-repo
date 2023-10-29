<template>
  <nav class="topbar">
    <img alt="Logo MPG" src="./assets/logo.png">
    <h1>Calculateur de résultat de match MPG</h1>
    <p v-if="isConnected" class="user-infos">
      Connecté en tant que {{ user.username }}
    </p>
  </nav>

  <main>
    <transition mode="out-in">
      <section v-if="!isConnected" class="connection">
        <mpg-connection-form />
      </section>
      <section v-else-if="loginEnded" class="content">
        <live-rating-disclaimer v-if="!haveLiveRating" />
        <live-display v-else />
      </section>
    </transition>

    <feedback-button />
  </main>
</template>

<script setup>
import LiveRatingDisclaimer from "@/components/disclaimers/LiveRatingDisclaimer.vue";
import LiveDisplay from "@/components/live/LiveDisplay.vue";
import MpgConnectionForm from "@/components/login/MpgConnectionForm.vue";
import FeedbackButton from "@/components/feedback/FeedbackButton.vue";

import { useMPG } from "@/use/useMPG";

const { isConnected, user, loginEnded, haveLiveRating } = useMPG();
</script>

<style scoped lang="scss">
body {
  margin: 0;
}
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  .user-infos {
    position: absolute;
    bottom: 0;
  }
}

main {
  padding: 5vh 0;

  .connection, .content {
    display: flex;
    justify-content: center;
  }
}

/**
 * Transitions
 */
 .v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
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