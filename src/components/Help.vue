<template>
    <div>
        <v-tour name="help" :steps="steps" :options="options" :callbacks="callbacks"></v-tour>
        <section class="help-wrapper">
            <a @click="startTour">Aide</a>
        </section>
    </div>
</template>

<script>
export default {
    name: "Help",
    data: function () {
        return {
            options: {
                highlight: true,
                useKeyboardNavigation: true,
                labels: {
                    buttonSkip: "Arrêter",
                    buttonPrevious: "Précédent",
                    buttonNext: "Suivant",
                    buttonStop: "Terminer",
                },
            },
            callbacks: {
                onSkip: this.saveTourEnd,
                onFinish: this.saveTourEnd,
            },
            steps: [
                {
                    target: "[data-tour-step=\"1\"]",
                    header: {
                        title: "",
                    },
                    content: `MPG Calculator vous permet de renseigner les notes des joueurs obtenues et de calculer le résultat de votre match sans attendre le lundi matin
                    Pour cela, il vous faut avoir accès au <a href="https://mpg.football/shop">notes live MPG</a>`,
                },
                {
                    target: "[data-tour-step=\"2\"]",
                    header: {
                        title: "Choisir une formation",
                    },
                    content: "Choisissez la formation de votre équipe. Cela permettra de ne vous proposer que les joueurs compatibles à chaque poste",
                },
                {
                    target: "[data-tour-step=\"3\"]",
                    header: {
                        title: "Comment renseigner les joueurs",
                    },
                    content: "Renseignez les joueurs en respectant leur ordre (pour vérifiez à quel poste correspond quel numéro, rendez-vous dans la partie Entraineur de votre ligue et videz votre équipe. Les numéro de chaque poste s'afficheront). Commencez à taper le nom de votre joueur pour filtrer la liste proposée",
                },
                {
                    target: "[data-tour-step=\"4\"]",
                    header: {
                        title: "Comment renseigner les notes",
                    },
                    content: "Renseignez les notes sans bonus, c'est à dire comme elles s'affichent dans la partie live de MPG. Les bonus (defensif ou autre) seront ajoutés si applicable. Si le joueur n'a pas joué, laissez le champ vide",
                },
                {
                    target: "[data-tour-step=\"5\"]",
                    header: {
                        title: "Comment renseigner les buts",
                    },
                    content: "Renseignez le nombre de but réel du joueur. Si il n'a pas marqué, laissez vide",
                },
                {
                    target: "[data-tour-step=\"6\"]",
                    header: {
                        title: "Comment renseigner les CSC",
                    },
                    content: "Renseignez le nombre de CSC réel du joueur. Si il n'en a pas marqué, laissez vide",
                },
                {
                    target: "[data-tour-step=\"7\"]",
                    header: {
                        title: "Comment renseigner les remplaçants",
                    },
                    content: "Renseignez les remplaçants que vous avez sur votre banc ainsi que leur note, but et CSC. Renseignez les bien dans le même ordre que sur MPG",
                },
                {
                    target: "[data-tour-step=\"8\"]",
                    header: {
                        title: "Comment renseigner les remplacements",
                    },
                    content: "Renseignez les remplacements de la même façon que sur MPG. Renseignez les bien dans le même ordre",
                },
                {
                    target: "[data-tour-step=\"9\"]",
                    header: {
                        title: "Comment renseigner les bonus",
                    },
                    content: "Choisissez le bonus utilisé. Il sera appliqué automatiquement sur le match. Pour le bonus Chapron Rouge, le score devient un calcul de probabilité sur les scores possibles",
                },
                {
                    target: "[data-tour-step=\"10\"]",
                    header: {
                        title: "Sauvegarder son équipe",
                    },
                    content: "Pour éviter de refaire ce processus plusieurs fois, vous pouvez sauvegarder votre équipe et celle de votre adversaire. Donnez leur un nom et cliquer sur Sauvegarder. En revenant la prochain fois, vous n'aurez plus qu'à charger les équipes",
                },
                {
                    target: "[data-tour-step=\"11\"]",
                    header: {
                        title: "Calcul du score",
                    },
                    content: "Le score et le détail des équipes après remplacements tactiques ou non, s'afficheront ici. Vous passerez peut-être une meilleure nuit en connaissant le score de votre match...",
                },
                {
                    target: "[data-tour-step=\"12\"]",
                    header: {
                        title: "Une idée, un retour ?",
                    },
                    content: "Vous pouvez proposer des idées d'amélioration ou remonter des problèmes rencontrés grâce à ce bouton. N'hésitez pas !",
                },
            ],
        };
    },
    mounted: function () {
        let helpShowed = localStorage.getItem("help-showed");
        if (!helpShowed) {
            this.startTour();
        }
    },
    methods: {
        startTour: function () {
            document.querySelector(".topbar").style.position = "relative";
            this.$tours["help"].start();
        },
        saveTourEnd: function () {
            document.querySelector(".topbar").style.position = "sticky";
            localStorage.setItem("help-showed", "true");
        },
    },
};
</script>

<style lang="scss" scoped>
    section.help-wrapper {
        position: fixed;
        bottom: 0;
        right: calc(105px + 2vw);
        a {
            padding: 5px 10px;
            background-color: hsla(120, 55%, 45%, 1);
            border-radius: 3px;
            border-color: transparent;
            cursor: pointer;
            color: #fff;
            height: 30px;
            display: inline-block;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            transition: all .3s ease-out;
            transform: translateY(10px);
            &:hover {
                transform: translateY(0);
                background-color: hsla(120, 55%, 65%, 1);
            }
        }
    }
</style>
<style lang="scss">
    .v-step {
        background: hsla(120, 55%, 45%, 1) !important;
    }
    .v-step__header {
        background-color: #135a33 !important;
    }
    .v-tour__target--highlighted {
        -webkit-box-shadow: 0 0 0 4px rgba(0,0,0,.4) !important;
        box-shadow: 0 0 100px 10px #34b234 !important;
        border-radius: 3px !important;
    }
    ul.v-tour__target--highlighted {
        margin-left: -20px !important;
        padding-left: 20px !important;
    }
</style>
