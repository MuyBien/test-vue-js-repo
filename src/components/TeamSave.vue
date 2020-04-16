<template>
    <section>
        <div v-if="dbSupported">
            <input type="text" placeholder="Team name" v-model="name" />
            <button @click="saveTeam" title="Garder une copie des joueurs pramétrés dans le navigateur pour la réutiliser plus tard">Sauvegarder</button>
            <button @click="showSavedTeams=true" title="Afficher la liste des équipes sauvegardées">Charger une équipe</button>

            <section v-if="showSavedTeams">
                <p v-if="!teams.length" class="hint">Aucune équipe enregistrée. Créez en une puis cliquer sur sauvegarder pour la retrouver ici sur cet appareil</p>
                <ul v-else class="teams-saved">
                    <li class="team" v-for="team in teams" :key="team.name">
                        <span class="name">{{team.name}}</span>
                        <button @click="loadTeam(team.name)" title="Charger cette équipe">Utiliser</button>
                        <button @click="deleteTeam(team.name)" title="Supprimer cette sauvegarde">Supprimer</button>
                    </li>
                </ul>
                <button @click="showSavedTeams=false">Fermer</button>
            </section>
        </div>
    </section>
</template>

<script>
export default {
    name: "TeamSave",
    props: {
        name: {
            type: String,
            default: function () {
                return "Équipe du " + new Date().toLocaleString();
            },
        },
        team: {
            type: Object,
            required: true,
        },
    },
    data: function () {
        return {
            dbName: "mpg-calculator",
            dbVersion: 1,
            db: null,
            teams: null,
            showSavedTeams: false,
        };
    },
    async created() {
        if (this.dbSupported) {
            this.db = await this.getDb();
            this.teams = await this.getTeamsFromDb();
        }
    },
    computed: {
        dbSupported: function () {
            if (!window.indexedDB) {
                return false;
            }
            return true;
        },
    },
    methods: {
        saveTeam: async function () {
            let team = {
                name: this.name,
                team: this.team,
            };
            await this.addTeamToDb(team);
            this.teams = await this.getTeamsFromDb();
        },
        loadTeam: function (name) {
            this.name = name;
            let team = this.teams.filter(function (team) {
                return team.name === name;
            })[0].team;
            this.$emit("team-loaded", team);
        },
        deleteTeam: async function (name) {
            await this.deleteTeamFromDb(name);
            this.teams = await this.getTeamsFromDb();
        },
        addTeamToDb: async function (team) {
            return new Promise((resolve) => {
                let trans = this.db.transaction(["teams"], "readwrite");
                trans.oncomplete = function () {
                    resolve();
                };
                let store = trans.objectStore("teams");
                store.put(team);
            });
        },
        deleteTeamFromDb: async function (name) {
            return new Promise((resolve) => {
                let trans = this.db.transaction(["teams"],"readwrite");
                trans.oncomplete = function () {
                    resolve();
                };
                let store = trans.objectStore("teams");
                store.delete(name);
            });
        },
        getTeamsFromDb: async function () {
            return new Promise((resolve) => {
                let trans = this.db.transaction("teams","readonly");
                trans.oncomplete = function () {
                    resolve(teams);
                };

                let store = trans.objectStore("teams");
                let teams = [];

                store.openCursor().onsuccess = e => {
                    let cursor = e.target.result;
                    if (cursor) {
                        teams.push(cursor.value);
                        cursor.continue();
                    }
                };
            });
        },
        getDb: async function () {
            return new Promise((resolve, reject) => {
                let request = window.indexedDB.open(this.dbName, this.dbVersion);

                request.onerror = e => {
                    reject(e);
                };

                request.onsuccess = e => {
                    resolve(e.target.result);
                };

                request.onupgradeneeded = e => {
                    let db = e.target.result;
                    db.createObjectStore("teams", { autoIncrement: true, keyPath: "name" });
                };
            });
        },
    },
    watch: {
        showSavedTeams: async function () {
            this.db = await this.getDb();
            this.teams = await this.getTeamsFromDb();
        },
    },
};
</script>

<style scoped lang="scss">
button {
    background: #ccc;
    border: 0;
    padding: 5px 10px;
    border-radius: 3px;
    margin: 0 5px;
    cursor: pointer;
    transition: background .3s ease-out;
    &:hover {
        background: #ddd;
    }
}
input {
    border-radius: 3px;
    border: 1px solid #ccc;
    padding: 5px;
}
.teams-saved {
    padding: 0;
    width: 100%;
    .team {
        display: flex;
        align-items: flex-end;
        margin: 5px 0;
        .name {
            flex-grow: 3;
            text-align: left;
            margin-right: 10px;
        }
        button {
            margin-right: 5px;
        }
    }
}
.hint {
    color: #bbb;
    font-size: .8em;
}
</style>
