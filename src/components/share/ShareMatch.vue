<template>
  <section class="sharing-section">
    <button class="btn btn-primary" @click="shareMatch">
      Partager le résultat
    </button>

    <teleport to=".modals-container">
      <share-modal :show="showModal" :match-image="matchImage" @close="showModal = false" />
    </teleport>
  </section>
</template>

<script setup>
import ShareModal from "@/components/share/ShareModal.vue";
import { toJpeg } from "html-to-image";
import { ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

/**
 * Screenshot
 */
const matchImage = ref("");
const shareMatch = () => {
  const element = document.querySelector(`#${props.id}-more-infos .match-details-wrapper`);
  element.classList.add("to-print");

  toJpeg(element, {
    quality: 1,
    backgroundColor: "white",
    cacheBust: true,
    skipAutoScale: true,
  }).then(function (dataUrl) {
    matchImage.value = dataUrl;
    showModal.value = true;
  }).catch(function (error) {
    console.error("[ShareMatch] Problème lors de la génération de l'image du match", error);
  }).finally(() => {
    element.classList.remove("to-print");
  });
};

/**
 * Modal
 */
const showModal = ref(false);
</script>