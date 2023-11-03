import { computed, ref, watch, onBeforeMount } from "vue";
import { Match } from "@/models/Match";
import { TournamentMatch } from "@/models/TournamentMatch";
import { loginErrors } from "@/constants/loginErrors";

const token = ref("");
const loginError = ref();
const user = ref({});
const loginEnded = ref(false);
const liveData = ref({});

export function useMPG () {

  /**
   * Méthode de connexion à MPG
   */
  onBeforeMount(() => {
    token.value = localStorage.getItem("mpg-token");
  });
  const isConnected = computed(() => {
    return Boolean(token.value);
  });
  const signIn = async (login, password) => {
    loginError.value = undefined;
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
      localStorage.setItem("mpg-token", json.token);
    } else {
      loginError.value = loginErrors[json.message];
    }
  };
  const resetToken = () => {
    token.value = undefined;
    localStorage.removeItem("mpg-token");
  };

  /**
   * Récupération des infos de l'utilisateur
  */
  watch(token, () => {
    if (token.value) {
      getUser();
    }
  });

  const getUser = async () => {
    const response = await fetch("https://api.mpg.football/user", {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token.value,
      },
      body: null,
    });
    if (response.status === 200) {
      user.value = await response.json();
      loginEnded.value = true;
    } else {
      resetToken();
    }
  };
  const haveLiveRating = computed(() => {
    return user.value?.applicationsData?.mpg.gameOptions.liveRatingAvailable;
  });

  /**
   * Matches Live
   */
  watch(token, () => {
    if (token.value) {
      getLiveData();
    }
  });

  const getLiveData = async () => {
    const response = await fetch("https://api.mpg.football/live", {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token.value,
      },
      body: null,
    });
    const data = await response.json();
    liveData.value = data;
  };

  const liveLeagues = computed(() => {
    const liveLeagues = liveData.value?.orderedLeagueDivisionItems;
    return liveLeagues ? Object.values(liveLeagues).filter(league => league.liveState) : [];
  });

  const liveTournaments = computed(() => {
    const liveTournaments = liveData.value?.orderedTournamentItems;
    return liveTournaments ? Object.values(liveTournaments).filter(tournament => tournament.liveState) : [];
  });

  const getMatchData = async (matchId) => {
    const response = await fetch(`https://api.mpg.football/division-match/${matchId}`, {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token.value,
      },
      body: null,
    });
    const data = await response.json();
    return new Match(data);
  };

  const getTournamentMatch = async (matchId) => {
    const response = await fetch(`https://api.mpg.football/tournament-match/${matchId}`, {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token.value,
      },
      body: null,
    });
    const data = await response.json();
    return new TournamentMatch(data);
  };

  return {
    signIn,
    loginError,
    user,
    isConnected,
    loginEnded,
    haveLiveRating,
    liveLeagues,
    liveTournaments,
    getMatchData,
    getTournamentMatch,
  };
}