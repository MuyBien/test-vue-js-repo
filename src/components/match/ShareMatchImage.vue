<template>
  <section class="sharing-section">
    <button class="btn btn-primary" @click="shareMatch">
      Partager le résultat
    </button>
  </section>
</template>

<script setup>
import { toPng } from "html-to-image";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

/**
 * Screenshot
 */
const shareMatch = () => {
  const element = document.querySelector(`#${props.id}-more-infos .match-details-wrapper`);
  toPng(element, { backgroundColor: "white" })
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = "mpg-calculator-result.jpeg";
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });
};
</script>