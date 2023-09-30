import { computed, ref, watch } from "vue";

const token = ref("");
const user = ref({});
const liveData = ref({});

export function useMPG() {

  /**
   * Méthode de connexion à MPG
   */
  const isConnected = computed(() => {
    return Boolean(token.value);
  });
  const signIn = async(login, password) => {
    const response = await fetch("https://api.mpg.football/user/sign-in", {
      method: "POST",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `login=${login}&password=${password}&language=fr-FR`,
    });
    const json = await response.json();
    if (json.token) {
      token.value = json.token;
    }
  };

  /**
   * Récupération des infos de l'utilisateur
  */
  watch(token, () => {
    if (token.value) {
      getUser();
    }
  });

  const getUser = async() => {
    const response = await fetch("https://api.mpg.football/user", {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token.value,
      },
      body: null,
    });
    user.value = await response.json();
  };
  const haveLiveRating = computed(() => {
    return user.value?.applicationsData.mpg.gameOptions.liveRatingAvailable;
  });

  /**
   * Infos des équipes
   */
  const getTeamInfos = async(teamId) => {
    // exemple de teamId : mpg_team_LJELCG6E_9_1_0
    const response = await fetch(`https://api.mpg.football/team/${teamId}`, {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token.value,
      },
    });
    const team = await response.json();
    return team;
  };

  /**
   * Matches Live
   */
  watch(token, () => {
    if (token.value) {
      getLiveData();
    }
  });

  const getLiveData = async() => {
    // const response = await fetch("https://api.mpg.football/live", {
    //   method: "GET",
    //   headers: {
    //     accept: "application/json, text/plain, */*",
    //     authorization: token.value,
    //   },
    //   body: null,
    // });
    // const data = await response.json();
    // liveData.value = data;

    const mockedResponse = await fetch("http://localhost:5173/src/assets/mocks/live/response.json");
    liveData.value = await mockedResponse.json();
  };

  const liveDivisions = computed(() => {
    return Object.values(liveData.value.orderedLeagueDivisionItems);
  });

  return {
    signIn,
    user,
    isConnected,
    haveLiveRating,
    liveDivisions,
  };
}