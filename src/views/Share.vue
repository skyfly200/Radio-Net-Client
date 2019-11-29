<template lang="pug">
  .content
    h1 Content
    v-card.ma-3
      v-card-title
        h2 File Upload
      v-divider
      v-card-text
        v-form
          input(type="file")
      v-card-actions
        v-btn Upload
    v-card.ma-3
      v-card-title
        h2 Podcasts
      v-divider
      v-card-text
        v-list
          v-list-item test 1
          v-list-item test 2
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style lang="sass" scoped></style>
