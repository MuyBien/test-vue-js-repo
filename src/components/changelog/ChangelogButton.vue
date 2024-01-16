<template>
  <section class="changelog-wrapper" :class="{ inactive: isLoading || upToDate }">
    <a @click="showChangelog = true">Nouveautés</a>
    <span v-if="unseenReleases.length" class="unseen-count">{{ unseenReleases.length > 10 ? "9+" : unseenReleases.length }}</span>

    <teleport to=".modals-container">
      <changelog-display :show="showChangelog" @close="showChangelog = false" />
    </teleport>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useGitlab } from "@/use/useGitlab";
import ChangelogDisplay from "@/components/changelog/ChangelogDisplay.vue";

const { isLoading, unseenReleases, setAllReleasesSeen } = useGitlab();

const upToDate = computed(() => {
  return unseenReleases.value.length === 0;
});

const showChangelog = ref(false);
watch(showChangelog, (showed) => {
  if (showed) {
    setAllReleasesSeen();
  }
});
</script>

<style lang="scss" scoped>
.changelog-wrapper {
  background-color: hsla(120, 55%, 45%, 1);
  border-radius: 3px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  cursor: pointer;
  transition: all .3s ease-out;
  transform: translateY(10px);
  z-index: 1;

  a {
    display: inline-block;
    padding: 5px 10px;
    height: 40px;
    color: #fff;
    text-decoration: none;
    &:hover {
      color: #fff;
    }
  }

  &.inactive {
    filter: grayscale(100%);
  }

  &:hover {
    transform: translateY(0);
    background-color: hsla(120, 55%, 65%, 1);
  }
  .unseen-count{
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: rgb(230, 36, 29);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
    color: #fff;
    animation: bounce 11s infinite;
  }

  @keyframes bounce {
    0%, 9%, 100% {
      transform: translateY(0);
    }
    10% {
      transform: translateY(-30px);
    }
    11% {
      transform: translateY(0);
    }
    12% {
      transform: translateY(-15px);
    }
    13% {
      transform: translateY(0);
    }
  }

}
</style>