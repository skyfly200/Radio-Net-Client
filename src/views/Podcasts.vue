<template lang="pug">
  .podcasts
    v-card.ma-3
      v-card-title Podcasts
      v-divider
      v-card-text
        v-list(v-if="podcasts !== []")
          v-list-item(v-for="podcast in podcasts") {{ podcast.title }}
        h3(v-else) No podcasts available
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    podcasts: []
  }),
  methods: {}
});
</script>

<style lang="sass" scoped></style>