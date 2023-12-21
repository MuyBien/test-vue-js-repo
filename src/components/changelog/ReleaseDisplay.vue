<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">
        {{ release.tag_name }}
      </h5>
      <p class="card-text">
        <vue-markdown :source="release.description" :options="{ html: true }" />
      </p>
    </div>
    <div class="card-footer">
      <a target="_blank" :href="release.commit.web_url">{{ release.commit.short_id }}</a>
      <a target="_blank" :href="`https://gitlab.com${release.tag_path}`">{{ release.tag_name }}</a>
      <span>Créé le {{ new Date(release.released_at).toLocaleDateString() }} par {{ release.author.name }}</span>
      <a target="_blank" :href="release.author.web_url">
        <img class="avatar" :src="release.author.avatar_url" :data-src="release.author.avatar_url">
      </a>
    </div>
  </div>
</template>

<script setup>
import VueMarkdown from "vue-markdown-render";

defineProps({
  release: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.card-footer {
  display: flex;
  justify-content: end;
  align-items: center;
  column-gap: 10px;

  a {
    color: var(--bs-card-cap-color);
  }
}
.avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
</style>