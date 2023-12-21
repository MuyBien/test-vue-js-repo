<template>
  <div
    id="changelog-modal"
    class="modal fade modal-xl"
    tabindex="-1"
    aria-labelledby="changelog-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            Nouveautés
          </h1>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          />
        </div>
        <div class="modal-body row">
          <release-display
            v-for="release in releases"
            :key="release.tag_name"
            :release="release"
            class="mb-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import { useGitlab } from "@/use/useGitlab";
import ReleaseDisplay from "@/components/changelog/ReleaseDisplay.vue";

const { releases } = useGitlab();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["close"]);

/**
 * Affichage de la modale
 */
const modal = ref();
onMounted(() => {
  modal.value = Modal.getOrCreateInstance("#changelog-modal");
  const myModalEl = document.getElementById("changelog-modal");
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