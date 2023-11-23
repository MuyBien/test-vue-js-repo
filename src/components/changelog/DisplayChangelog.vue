<template>
  <div class="changelog">
    <span class="icon">🆕</span>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(async () => {
  if (document.getElementById("headway-script")) {
    return; //Script déjà ajouté
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.headwayapp.co/widget.js";
    script.id = "headway-script";
    script.setAttribute("async", true);
    document.head.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
  });

  // eslint-disable-next-line no-undef
  Headway.init({
    selector: ".changelog",
    account: "xdEGj7",
    translations: {
      title: "Nouveautés",
      readMore: "Voir plus 👉",
      labels: {
        new: "Nouveautés",
        improvement: "Amélioration",
        fix: "Corrections",
      },
      footer: "Voir plus 👉",
    },
  });
});
</script>

<style lang="scss"> // Pas scoped car le script injecte des éléments dans le DOM
.changelog {
  display: flex;
  position: relative;
  margin-right: 1em;
  cursor: pointer;

  .icon {
    font-size: 2em;
  }

  &:has(.HW_softHidden) {
    filter: grayscale(100%);
  }

  .HW_badge_cont {
    position: absolute;
    width: 100%;
    height: 100%;

    .HW_badge {
      position: absolute;
      top: 0;
      right: -5px;
      left: unset;
    }
  }
}
</style>