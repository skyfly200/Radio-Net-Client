<template lang="pug">
  .podcasts
    v-card.ma-3
      v-card-title Podcasts
      v-divider
      v-card-text
        v-list(v-if="podcasts !== []")
          v-list-item(v-for="podcast in podcasts" two-line)
            v-list-item-avatar
              v-img(v-if="podcast.xml.image && podcast.xml.image.url" :src="podcast.xml.image.url")
            v-list-item-content
              v-list-item-title {{ podcast.xml.title }}
              v-list-item-subtitle {{ podcast.xml.description }}
            v-list-item-icon
              v-btn(icon target="new" :href="'https://us-central1-community-radio-network.cloudfunctions.net/podcast?id='+podcast.id")
                v-icon mdi-rss
        div(v-else-if="podcasts = null")
          h1 No podcasts available
        div(v-else)
          h3 Loading
          v-progress-circular(large)
</template>

<script lang="ts">
import Vue from "vue";
import firebase, { firestore } from "firebase";

var db = firebase.firestore();

export default Vue.extend({
  data: () => ({
    podcasts: []
  }),
  mounted() {
    this.loadPodcasts();
  },
  methods: {
    loadPodcasts() {
      db.collection("podcasts")
        .get()
        .then(
          function(querySnapshot) {
            querySnapshot.forEach(
              function(doc) {
                var data = doc.data();
                data.id = doc.id;
                this.podcasts.push(data);
              }.bind(this)
            );
            if (this.podcasts === []) this.podcasts = null;
          }.bind(this)
        );
    }
  }
});
</script>

<style lang="sass" scoped></style>