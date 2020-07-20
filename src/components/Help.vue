<template>
    <section class="help-wrapper">
        <p>
            MPG Calculator vous permet de renseigner les notes des joueurs obtenues et de calculer le résultat de votre match sans attendre le lundi matin.
            <br />
            Pour cela, il vous faut avoir accès au <a href="https://mpg.football/shop">notes live MPG</a>.
            Une fois toutes les notes de vos joueurs et des joueurs adverses récupérées, renseigner les dans le calculator en prenant de soin de suivre certaines règles :
        </p>
        <ul>
            <li>Renseignez les notes sans bonus. Le bonus defensif sera ajouté si il est applicable</li>
            <li>Renseignez les joueurs en respectant leur ordre (pour vérifiez à quel poste correspond quel numéro, rendez-vous dans la partie Entraineur de votre ligue et videz votre équipe. Les numéro de chaque poste s'afficheront)</li>
            <li>Renseignez les remplacements en respectant leur ordre</li>
        </ul>
        <p>Le bonus Chapron Rouge, lorsqu'il est appliqué, modifie la nature du calcul du résultat. Ce n'est plus un score, mais les probabilités de chaque score qui sont affichées. Le calculateur va vérifier le score obtenu pour chaque joueur titulaire qui recevrait le bonus Chapron Rouge.</p>
    </section>
</template>

<script>
export default {
    name: "Help",
};
</script>

<style lang="scss" scoped>
.help-wrapper {
    text-align: justify;
}
</style>
