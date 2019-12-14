<template lang="pug">
  .podcasts
    ImgUpload(type="podcast" @done="updateImg($event)" @close="imageDialog = false" :toggle="imageDialog" :multi="false")
    v-row(justify="start").ml-3
      v-btn(to="/podcasts" text).mt-2 Back to Podcasts
    v-card.ma-3
      template(v-if="podcast && podcast.xml")
        template(v-if="mode === 'view'")
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
                  v-btn(icon @click="mode = 'edit'")
                    v-icon mdi-pencil
                  v-btn(icon @click="mode = 'add'")
                    v-icon mdi-plus
                  v-btn(icon target="new" :href="'https://us-central1-community-radio-network.cloudfunctions.net/podcast?id='+id")
                    v-icon mdi-rss
                  audio(src="''" ref="player")
            v-divider.ma-3
            div(v-if="items === null")
              h3 Loading
              v-progress-circular(indeterminate large)
            v-list(v-else-if="items && items.length > 0")
              v-list-item(v-for="(item, index) in items" two-line)
                v-list-item-content
                  v-list-item-title {{ item.xml.title }}
                  v-list-item-subtitle
                    p {{ item.xml.description }}
                    p {{ item.xml.pubDate }}
                v-list-item-icon
                  v-btn(icon @click="playItem(index)")
                    v-icon {{ (playerState && play === index) ? "mdi-pause" : "mdi-play" }}
            div(v-else)
              h1 Podcast has no items
        template(v-else-if="mode === 'edit'")
          v-card-title Edit Podcast
          v-card-text
            v-form
              v-row
                v-col(cols="6")
                  ImgEditHover(:editable="true" v-on:open="openImageDialog()" :src="podcast.xml.image.url").image-edit
                v-col(cols="6")
                  v-text-field(label="Title" v-model="podcast.xml.title")
                  v-text-field(label="Description" v-model="podcast.xml.description")
                  v-text-field(label="Copyright" v-model="podcast.xml.copyright")
              v-row
                v-col
                  h3 iTunes Fields
                  v-text-field(label="Author" v-model="podcast.xml['itunes:author']")
                  v-text-field(label="Keywords" v-model="podcast.xml['itunes:keywords']")
                  v-text-field(label="Subtitle" v-model="podcast.xml['itunes:subtitle']")
                  v-text-field(label="Summary" v-model="podcast.xml['itunes:summary']")
                  v-text-field(label="Explicit" v-model="podcast.xml['itunes:explicit']")
                  v-btn(@click.stop="updatePodcast()") Save
        template(v-else-if="mode === 'add'")
          v-card-title Add an item
          v-card-text
        template(v-else)
          v-card-title Invalid Mode {{ mode }}
      template(v-else-if="podcast === null")
        v-card-title 
          p Podcast with id {{ id }} was not found
      template(v-else)
        v-card-title
          p Loading
        v-card-text
          v-progress-circular(indeterminate large)
</template>

<script lang="ts">
import Vue from "vue";
import { format } from "date-fns";
import firebase, { firestore } from "firebase";

import ImgUpload from "@/components/ImgUpload.vue";
import ImgEditHover from "@/components/ImgEditHover.vue";

var db = firebase.firestore();

export default Vue.extend({
  components: { ImgEditHover, ImgUpload },
  data: () => ({
    mode: "view",
    id: "",
    imageDialog: false,
    podcast: {},
    items: null,
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
    openImageDialog() {
      this.imageDialog = true;
    },
    updateImg(image) {
      this.imageDialog = false;
      this.podcast.xml.image.url = image;
    },
    updatePodcast() {
      // write podcast updates to firestore
      db.collection("podcasts")
        .doc(this.id)
        .update(this.podcast)
        .then(function() {
          this.mode = "view";
        }.bind(this))
        .catch(function(error) {
          console.error("Error updating podcast: ", error);
        });
    },
    playItem(index) {
      this.play = index;
      // TO-DO play loads all items into playlist and skip to index, so playback continues through items when done
      // change to set on the master player component
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
                if (this.items === null) this.items = [];
                this.items.push(data);
              }.bind(this)
            );
            if (querySnapshot.docs.length === 0) this.items = [];
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

<style lang="sass" scoped>
.image-edit
  width: 100%
</style>