<template>
  <table class="table table-hover table-responsive align-middle">
    <thead>
      <th>Joueur</th>
      <th>Poste</th>
      <th>Note</th>
      <th>Bonus</th>
      <th>Final</th>
    </thead>
    <tbody>
      <player-display
        v-for="(player, index) in players"
        :key="player.playerId"
        :player="player"
        :player-index="index"
      />
    </tbody>
  </table>
</template>

<script setup>
import PlayerDisplay from "@/components/player/PlayerDisplay.vue";

defineProps({
  players: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
  th {
    font-weight: bold;
    text-align: left;
    padding: 0 5px;
  }
</style>