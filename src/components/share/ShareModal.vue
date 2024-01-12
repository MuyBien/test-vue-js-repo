<template>
  <div
    id="share-modal"
    ref="modalElem"
    class="modal fade modal-lg"
    tabindex="-1"
    aria-labelledby="share-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            Partager le résultat
          </h1>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          />
        </div>
        <div class="modal-body row">
          <img :src="matchImage">
        </div>
        <div class="modal-footer">
          <a download="mpg-calculator-result.jpeg" :href="matchImage" class="btn btn-primary">Télécharger</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal } from "bootstrap";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  matchImage: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["close"]);

/**
 * Affichage de la modale
 */
const modal = ref();
const modalElem = ref();
onMounted(() => {
  modal.value = Modal.getOrCreateInstance(modalElem.value);
  const myModalEl = document.getElementById("share-modal");
  myModalEl.addEventListener("hidden.bs.modal", () => {
    emits("close");
  });
});

watch(() => props.show, (show) => {
  if (show) {
    modal.value.show();
  } else {
    modal.value.hide();
  }
});

const closeModal = () => {
  emits("close");
};
</script>