<template lang="pug">
  .podcasts
    v-card.ma-3(v-if="podcast && podcast.xml")
      v-card-title.center {{ podcast.xml.title }}
      v-divider
      v-card-text
        v-container
          v-row
            v-col(cols="4")
              v-img(v-if="podcast.xml.image && podcast.xml.image.url" :src="podcast.xml.image.url")
            v-col(cols="6")
              p {{ podcast.xml.description }}
              p Last Update: {{ podcast.xml.lastBuildDate }}
              audio(src="''" ref="player")
        v-divider.ma-3
        v-list(v-if="items !== []")
          v-list-item(v-for="(item, index) in items" two-line)
            v-list-item-content
              v-list-item-title {{ item.xml.title }}
              v-list-item-subtitle
                p {{ item.xml.description }}
                p {{ item.xml.pubDate }}
            v-list-item-icon
              v-btn(icon @click="playItem(index)")
                v-icon {{ (playerState && play === index) ? "mdi-pause" : "mdi-play" }}
        div(v-else-if="items = null")
          h1 Podcast has no items
        div(v-else)
          h3 Loading
          v-progress-circular(large)
    v-card.ma-3(v-else)
      v-card-title
        h1 Podcast with id {{ id }} was not found
</template>

<script lang="ts">
import Vue from "vue";
import { format } from "date-fns";
import firebase, { firestore } from "firebase";

var db = firebase.firestore();

export default Vue.extend({
  data: () => ({
    id: "",
    podcast: {},
    items: [],
    play: -1,
    src: null,
    playerState: false
  }),
  watch: {
    $route(to, from) {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.id = this.$route.params.id;
      this.loadPodcast();
      this.loadItems();
    },
    playItem(index) {
      this.play = index;
      if (
        this.items[index] &&
        this.items[index].xml &&
        this.items[index].xml.enclosure["@url"]
      ) {
        this.$refs.player.src = this.items[index].xml.enclosure["@url"];
        this.playerState ? this.$refs.player.pause() : this.$refs.player.play();
        this.playerState = !this.playerState;
      }
    },
    loadPodcast() {
      db.collection("podcasts")
        .doc(this.id)
        .get()
        .then(
          function(doc: any) {
            if (doc.exists) {
              var data = doc.data();
              data.id = doc.id;
              this.podcast = data;
            } else this.podcast = null;
          }.bind(this)
        );
    },
    loadItems() {
      db.collection("podcasts")
        .doc(this.id)
        .collection("items")
        .get()
        .then(
          function(querySnapshot) {
            querySnapshot.forEach(
              function(doc) {
                var data = doc.data();
                data.id = doc.id;
                this.items.push(data);
              }.bind(this)
            );
            if (this.items === []) this.items = null;
          }.bind(this)
        );
    },
    newItem() {
      let item = {
        title: "Title of Podcast Episode",
        description: "Description of podcast episode content",
        link: "http://example.com/podcast-2",
        enclosure: {
          "@url": "http://example.com/podcast-2/podcast.mp3",
          "@type": "audio/mpeg",
          "@length": "1024"
        },
        pubDate: format(new Date(), "iii, d MMM yyyy HH:mm:ss xx"),
        guid: "http://example.com/podcast-2",
        category: "<![CDATA[Podcast]]>",
        "itunes:summary": "Description of podcast episode content",
        "itunes:author": "Author Name",
        "itunes:duration": "00:32:16",
        "itunes:explicit": "no"
      };
    },
    newPodcast() {
      let channel = {
        title: "Way High Radio",
        link: "https://wayhighradio.com/listen",
        description: "Main feed",
        lastBuildDate: format(new Date(), "iii, d MMM yyyy HH:mm:ss xx"),
        language: "en-us",
        managingEditor: "wayhighradio@gmail.com (Way High Radio)",
        copyright: "2019 Way High Radio",
        "itunes:author": "Author",
        "itunes:summary": "Main feed",
        "itunes:subtitle": "KWHR",
        "itunes:keywords": "radio,way high,ward,CO,community",
        "itunes:explicit": "clean",
        "itunes:owner": {
          "itunes:name": "Owner Name",
          "itunes:email": "wayhighradio@gmail.com"
        },
        "itunes:category": {
          "@text": "Music"
        },
        "itunes:image": {
          "@href":
            "http://www.wayhighradio.com/uploads/1/9/7/4/1974686/ccrn-logo-02-border_1.jpg"
        },
        "atom10:link": {
          "@xmlns:atom10": "http://www.w3.org/2005/Atom",
          "@rel": "self",
          "@type": "application/rss+xml",
          "@href":
            "https://us-central1-community-radio-network.cloudfunctions.net/podcast?id=" +
            id
        },
        image: {
          title: "Way High Radio",
          link: "https://wayhighradio.com/listen",
          url:
            "http://www.wayhighradio.com/uploads/1/9/7/4/1974686/ccrn-logo-02-border_1.jpg",
          width: "144",
          height: "400"
        },
        item: []
      };
    }
  }
});
</script>

<style lang="sass" scoped></style>