<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link on="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link on="/about">
          <v-list-item-action>
            <v-icon>mdi-information</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <template v-if="userLogedIn">
          <v-divider></v-divider>
          <v-list-item link on="/dashboard">
            <v-list-item-action>
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
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
        <audio ref="stream" src="//65.183.82.82:8000/KWHR">
          Your browser does not support the
          <code>audio</code> element.
        </audio>
        <v-btn icon @click="toggleStream">
          <v-icon>{{ streamState ? "mdi-stop" : "mdi-play" }}</v-icon>
        </v-btn>
        <span>{{ trackInfo[infoDisplay] }}</span>
        <v-spacer />
        <v-hover v-slot:default="{ hover }" close-delay="500">
          <div class="volume-controls">
            <v-btn icon @click="mute">
              <v-icon>{{
                volume === 0 ? "mdi-volume-high" : "mdi-volume-off"
              }}</v-icon>
            </v-btn>
            <v-expand-x-transition>
              <v-slider
                v-if="hover"
                id="stream-volume"
                v-model="volume"
              ></v-slider>
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
      trackInfo: "",
      infoDisplay: "title",
      volume: 100,
      volumeHold: 100
    };
  },
  created() {
    this.getInfo();
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
    getInfo() {
      // get new info on datastore update (see chat message fetch)
      // set alternating text from title to server_description on each update time interval
      // TODO - scroll text if to long for view, set text width to autofill, hide vol slider
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
#stream-volume
</style>
