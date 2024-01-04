<template>
  <section class="changelog-wrapper">
    <a target="_blank" href="https://ko-fi.com/muybien">
      Offrez un ☕
    </a>
  </section>
</template>

<style lang="scss" scoped>
.changelog-wrapper {
  background-color: hsla(120, 55%, 45%, 1);
  border-radius: 3px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  cursor: pointer;
  transition: all .3s ease-out;
  transform: translateY(10px);

  a {
    display: inline-block;
    padding: 5px 10px;
    height: 40px;
    color: #fff;
    text-decoration: none;
    &:hover {
      color: #fff;
    }
  }

  &:hover {
    transform: translateY(0);
    background-color: hsla(120, 55%, 65%, 1);
  }
}
</style>