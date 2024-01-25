import { computed, onMounted, readonly, ref } from "vue";

const GITLAB_PROJECT_ID = 15624779;

const isLoading = ref(false);
const releases = ref([]);
const lastReleaseSeenDate = ref(null);

export function useGitlab () {

  onMounted(() => {
    lastReleaseSeenDate.value = localStorage.getItem("last-release-seen");
    getReleases();
  });

  /**
   * Gestion des releases non vues
   */
  const unseenReleases = computed(() => {
    if (! lastReleaseSeenDate.value) {
      return releases.value;
    }

    const lastSeenDate = new Date(lastReleaseSeenDate.value);
    const firstSeenReleaseIndex = releases.value.findIndex(release => new Date(release.released_at) <= lastSeenDate);

    if (firstSeenReleaseIndex === - 1) {
      return releases.value;
    }

    return releases.value.slice(0, firstSeenReleaseIndex);
  });

  const setAllReleasesSeen = () => {
    lastReleaseSeenDate.value = releases.value[0].released_at;
    localStorage.setItem("last-release-seen", lastReleaseSeenDate.value);
  };

  /**
   * Récupération des releases
  */
  const getReleases = async () => {
    isLoading.value = true;
    const response = await fetch(`https://gitlab.com/api/v4/projects/${GITLAB_PROJECT_ID}/releases?order_by=released_at`, {
      method: "GET",
      headers: { accept: "application/json, text/plain, */*" },
      body: null,
    });

    if (response.status === 200) {
      releases.value = await response.json();
    }

    isLoading.value = false;
  };

  return {
    isLoading: readonly(isLoading),
    releases: readonly(releases),
    unseenReleases: readonly(unseenReleases),
    setAllReleasesSeen,
  };
}