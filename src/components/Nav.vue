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
        <span>{{ item.title }}</span>
      </v-btn>
      <template v-slot:extension>
        <audio ref="stream" src="//65.183.82.82:8000/KWHR">
          Your browser does not support the
          <code>audio</code> element.
        </audio>
        <v-btn icon @click="toggleStream">
          <v-icon>{{ streamState ? "mdi-stop" : "mdi-play" }}</v-icon>
        </v-btn>
        <span>{{ trackInfo }}</span>
        <v-btn icon @click="mute">
          <v-icon>{{ (volume === 0) ? "mdi-volume-high" : "mdi-volume-off" }}</v-icon>
        </v-btn>
        <v-slider class="mt-5" v-model="volume"></v-slider>
      </template>
    </v-app-bar>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      drawer: false,
      streamState: false,
      trackInfo: "",
      volume: 100,
      volumeHold: 100
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
    getInfo() {
      this.trackInfo = "";
      // axios fetch sream servers json data from url
      // http://65.183.82.82:8000/status-json.xsl
      // set alternating text from title to server_description on each update time interval
      // TODO - scroll text if to long for view, set text width to autofill, hide vol slider
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
