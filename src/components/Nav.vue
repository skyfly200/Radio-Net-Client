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
        <StreamPlayer />
      </template>
    </v-app-bar>
  </div>
</template>
<script>
import StreamPlayer from "@/components/StreamPlayer.vue";
export default {
  components: {
    StreamPlayer
  },
  data: function() {
    return {
      drawer: false
    };
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

</style>
