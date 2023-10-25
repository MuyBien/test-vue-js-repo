<template>
  <section class="no-live">
    <h2>Aucun match live</h2>
    <div class="no-live-image" />
  </section>
</template>

<style scoped lang="scss">
h2 {
  text-align: center;
}
.no-live-image {
  margin: 5vh auto;
  width: 70vw;
  max-width: 300px;
  height: 70vw;
  max-height: 300px;
  border-radius: 10%;
  background-image: url("/img/no-live.png");
  background-size: contain;
}</style>