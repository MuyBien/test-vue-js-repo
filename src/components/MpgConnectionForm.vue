<template>
  <div class="card mb-3" style="max-width: 80vw; min-height: 50vh;">
    <div class="row g-0">
      <div class="col-md-4">
        <img src="@/assets/mpg_login_banner.jpg" class="img-fluid rounded-start" alt="Bannière MPG" />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">Connexion à MPG</h5>
          <div class="card-text">
            <p class="disclamer">
              Ce site n'est pas affilié à MPG. Nous ne conservons pas vos login et mot de passe.
              Pour vous en assurez, le code source de cette application est disponible sur GitLab
            </p>
            <form @submit="signIn(login, password)">
              <div class="form-floating mb-3">
                <input
                  type="email"
                  v-model="login"
                  class="form-control"
                  id="mpg-login"
                  placeholder="name@example.com"
                >
                <label for="mpg-login" class="form-label">Adresse e-mail</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  id="mpg-pwd"
                  placeholder="name@example.com"
                >
                <label for="mpg-pwd" class="form-label">Mot de passe</label>
              </div>
            </form>
          </div>
          <div class="card-footer">
            <footer>
              <button class="btn btn-success" @click="signIn(login, password)">Connexion</button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMPG } from "@/use/useMPG";
import { ref } from "vue";

/**
 * Login
 */
const login = ref("***REMOVED***");
const password = ref("***REMOVED***");
const { signIn } = useMPG();

</script>

<style lang="scss">
.card-body {
  position: relative;
  .card-footer {
    footer {
      display: flex;
      align-items: center;
      justify-content: end;
      width: 100%;
    }
  }
}
</style>