<template>
  <section class="changelog-wrapper" :class="{ inactive: isLoading || upToDate }">
    <a target="_blank" href="https://gitlab.com/MuyBien/mpg-calculator/-/releases" @click="setAllReleasesSeen">Nouveautés</a>
    <span v-if="unseenReleases.length" class="unseen-count">{{ unseenReleases.length }}</span>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useGitlab } from "@/use/useGitlab";

const { isLoading, unseenReleases, setAllReleasesSeen } = useGitlab();

const upToDate = computed(() => {
  return unseenReleases.value.length === 0;
});
</script>

<style lang="scss" scoped>
.changelog-wrapper {
  position: fixed;
  bottom: 0;
  right: 7vw;
  background-color: hsla(120, 55%, 45%, 1);
  border-radius: 3px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  cursor: pointer;
  transition: all .3s ease-out;
  transform: translateY(10px);

  a {
    display: inline-block;
    padding: 5px 10px;
    height: 30px;
    color: #fff;
    text-decoration: none;
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