<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/about">
          <v-list-item-action>
            <v-icon>mdi-information</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <template v-if="userLogedIn">
          <v-divider></v-divider>
          <v-list-item link to="/dashboard">
            <v-list-item-action>
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link to="/share">
            <v-list-item-action>
              <v-icon>mdi-file-cloud</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Content</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="signout">
            <v-list-item-action>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Signout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense dark>
      <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
      <v-btn text style="cursor: pointer" to="/">Radio Net</v-btn>
      <v-spacer></v-spacer>
      <!-- sign out button -->
      <v-btn text v-if="userLogedIn" @click="signout" class="hidden-xs-only">
        <v-icon class="mr-2" right>mdi-logout-variant</v-icon>
        <span>Logout</span>
      </v-btn>
      <!-- navigation bar links -->
      <v-btn
        text
        v-else
        class="hidden-xs-only"
        v-for="item in items"
        :key="item.title"
        :to="item.link"
      >
        <v-icon class="mr-2" right>{{ item.icon }}</v-icon>
        <span id="stream-info">{{ item.title }}</span>
      </v-btn>
      <template v-slot:extension>
        <audio ref="stream" :src="streams[selectedStream].url">
          Your browser does not support the
          <code>audio</code> element.
        </audio>
        <v-btn icon @click="toggleStream">
          <v-icon>{{ streamState ? "mdi-stop" : "mdi-play" }}</v-icon>
        </v-btn>
        <v-progress-circular v-if="streamLoading" indeterminate></v-progress-circular>
        <marquee behavior="scroll" direction="left">{{ caption }}</marquee>
        <v-spacer />
        <v-hover v-slot:default="{ hover }" close-delay="500">
          <div class="volume-controls">
            <v-btn icon @click="mute">
              <v-icon>
                {{
                volume === 0 ? "mdi-volume-high" : "mdi-volume-off"
                }}
              </v-icon>
            </v-btn>
            <v-expand-x-transition>
              <v-slider v-if="hover" id="stream-volume" v-model="volume"></v-slider>
            </v-expand-x-transition>
          </div>
        </v-hover>
      </template>
    </v-app-bar>
  </div>
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
      return this.$store.getters.user;
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

<style lang="sass">
#stream-info
  flex: 1
.volume-controls
  display: flex
  .v-slider
    width: 150px
    margin-top: 7px
</style>
