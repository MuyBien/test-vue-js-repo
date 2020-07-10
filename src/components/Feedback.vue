<template>
    <section class="feedback-wrapper">
        <a target="_blank" :href="href">Feedback ?</a>
    </section>
</template>

<script>
export default {
    name: "Feedback",
    data: function () {
        return {
            mail: "incoming+muybien-mpg-calculator-15624779-issue-@incoming.gitlab.com",
            body: "Un problème ? Une idée ? Une amélioration ? Un remerciement ? Détaillez tout ça, on vous répondra.",
        };
    },
    computed: {
        href: function () {
            return "mailto:" + this.mail + "?body" + encodeURIComponent(this.body);
        },
    },
};
</script>

<style lang="scss" scoped>
    section.feedback-wrapper {
        position: fixed;
        bottom: 0;
        right: 1vw;
        a {
            padding: 5px 10px;
            background-color: hsla(120, 55%, 45%, 1);
            border-radius: 3px;
            color: #fff;
            height: 30px;
            text-decoration: none;
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
