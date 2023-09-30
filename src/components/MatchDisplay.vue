<template>
  <div class="accordion" id="accordionPanelsStayOpenExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingOne">
        <button
            class="accordion-button match"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseOne"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            <span>Résultat en live :</span>
            <span class="team home">
              {{ match.home.name }}
            </span>
            <span class="score">
              {{ match.home.score }}
              -
              {{ match.away.score }}
            </span>
            <span class="team home">{{ match.away.name }}</span>
        </button>
      </h2>
      <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
        <div class="accordion-body">
          <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  match: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.match {
  display: flex;
  width: 100%;
  align-items: center;
  cursor: pointer;
  .team {
    display: flex;
    margin: 0 10px;
    white-space: pre-wrap;
    font-size: 15px;
  }
  .score {
    display: flex;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    color: rgb(232, 30, 41);
    background: rgba(232, 30, 41, 0.08);
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;;
  }
}</style>