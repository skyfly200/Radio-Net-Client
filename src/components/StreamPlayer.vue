<template lang="pug">
  .stream-player
    audio(ref="stream" :src="streams[selectedStream].url")
      | Your browser does not support the
      code audio
      | element.
    v-btn( icon @click="toggleStream")
      v-icon {{ streamState ? "mdi-stop" : "mdi-play" }}
    v-progress-circular(v-if="streamLoading" indeterminate)
    marquee( behavior="scroll" direction="left").pt-3 {{ caption }}
    v-spacer
    v-hover( v-slot:default="{ hover }" close-delay="300")
      div( class="volume-controls")
        v-btn( icon @click="mute")
          v-icon {{ volume === 0 ? "mdi-volume-high" : "mdi-volume-off" }}
        v-expand-x-transition
          v-slider(v-if="hover" id="stream-volume" v-model="volume")
</template>
<script>
import firebase from "firebase";

export default {
  data: function() {
    return {
      drawer: false,
      streamState: false,
      streamLoading: false,
      trackInfo: "",
      infoIndex: 0,
      caption: "",
      volume: 100,
      volumeHold: 100,
      selectedStream: 0,
      streams: [{ title: "Way High Radio", url: "//65.183.82.82:8000/KWHR" }]
    };
  },
  created() {
    this.streamInfoSync();
    var intervalID = window.setInterval(this.nextInfo, 5000);
  },
  mounted() {
    this.$refs.stream.onplay = function() {
      this.streamLoading = false;
    };
    this.$refs.stream.onplaying = function() {
      this.streamLoading = false;
    };
    this.$refs.stream.onsuspend = function() {
      this.streamLoading = false;
    };
    this.$refs.stream.onended = function() {
      this.streamLoading = false;
    };
    this.$refs.stream.onerror = function() {
      this.streamLoading = false;
    };
    this.$refs.stream.onloadstart = function() {
      this.streamLoading = true;
    };
    this.$refs.stream.onstalled = function() {
      this.streamLoading = true;
    };
    this.$refs.stream.onwaiting = function() {
      this.streamLoading = true;
    };
  },
  watch: {
    volume: function() {
      this.$refs.stream.volume = this.volume / 100.0;
    }
  },
  computed: {
    userLogedIn() {
      return this.$store.getters.getUser;
    },
    items() {
      let menuItems = [
        {
          title: "Register",
          icon: "mdi-account-plus",
          link: "/register"
        },
        {
          title: "Login",
          icon: "mdi-login-variant",
          link: "/login"
        }
      ];
      return menuItems;
    }
  },
  methods: {
    nextInfo() {
      let keys = ["title", "description"];
      this.caption = this.trackInfo[keys[this.infoIndex]];
      this.infoIndex = (this.infoIndex + 1) % 2;
    },
    streamInfoSync() {
      var query = firebase
        .firestore()
        .collection("streams")
        .doc("wayhigh");
      var t = this;
      query.onSnapshot(function(snapshot) {
        t.trackInfo = snapshot.data();
      });
    },
    mute() {
      if (this.volume === 0) {
        this.volume = this.volumeHold;
      } else {
        this.volumeHold = this.volume;
        this.volume = 0;
      }
    },
    toggleStream() {
      this.streamState ? this.$refs.stream.pause() : this.$refs.stream.play();
      this.streamState = !this.streamState;
    },
    openDrawer() {
      this.drawer = true;
    },
    signout() {
      this.$store.dispatch("signOutAction");
    }
  }
};
</script>

<style lang="sass" scoped>
.stream-player
  display: flex
  width: 100%
#stream-info
  flex: 1
.volume-controls
  display: flex
  .v-slider
    width: 150px
    margin-top: 7px
</style>
