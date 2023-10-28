<template>
  <div class="form-check form-switch form-control-mg">
    <input
      id="showAllMatches"
      class="form-check-input"
      type="checkbox"
      role="switch"
      :checked="options.showAllMatches"
      @click="toggleDisplayMode"
    >
    <label class="form-check-label" for="showAllMatches">Afficher tous les matchs</label>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["update:options"]);

const toggleDisplayMode = () => {
  emits("update:options", { showAllMatches: ! props.options.showAllMatches });
};
</script>