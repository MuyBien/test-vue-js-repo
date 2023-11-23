<template>
  <div class="card" style="max-width: 80vw; min-height: 70vh;">
    <div class="row g-0 card__content">
      <div class="col-md-4 banner" />
      <div class="col-md-8 login-part">
        <div class="card-body">
          <h5 class="card-title">
            Connexion à MPG
          </h5>
          <div class="card-text">
            <p class="alert alert-info" role="alert">
              Ce site n'est pas affilié à MPG. Nous ne conservons pas vos login et mot de passe.
              Pour vous en assurez, le code source de cette application est disponible sur
              <a href="https://gitlab.com/MuyBien/mpg-calculator" class="alert-link">GitLab</a>.
            </p>
            <form @submit="signIn(login, password)">
              <div class="form-floating mb-3">
                <input
                  id="mpg-login"
                  v-model="login"
                  type="email"
                  class="form-control"
                  placeholder="name@example.com"
                  @keyup.enter="signIn(login, password)"
                >
                <label for="mpg-login" class="form-label">Adresse e-mail</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  id="mpg-pwd"
                  v-model="password"
                  type="password"
                  class="form-control"
                  autocomplete="mpg-password"
                  placeholder="***"
                  @keyup.enter="signIn(login, password)"
                >
                <label for="mpg-pwd" class="form-label">Mot de passe</label>
              </div>
            </form>

            <transition name="slide-fade">
              <div v-if="loginError" class="alert alert-warning" role="alert">
                {{ loginError }}
              </div>
            </transition>
          </div>
        </div>
        <div class="card-footer">
          <footer>
            <button class="btn btn-success" :disabled="!isFormCompleted" @click="signIn(login, password)">
              Connexion
            </button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMPG } from "@/use/useMPG";
import { ref, computed } from "vue";

/**
 * Login
 */
const login = ref("");
const password = ref("");
const { signIn, loginError } = useMPG();

const isFormCompleted = computed(() => {
  return login.value && password.value;
});
</script>

<style lang="scss">
.card {
  &__content {
    height: 100%;
  }
  .banner {
    background-image: url(/img/login-banner.png);
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: var(--bs-card-border-radius) 0 0 var(--bs-card-border-radius);
  }
  .login-part {
    min-height: 100%;
    position: relative;
  }
  .card-body {
    position: relative;
    padding-bottom: 60px;
  }
  .card-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: end;
    width: 100%;
  }
}

/**
  Transition
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>