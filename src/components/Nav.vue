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
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense dark>
      <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
      <v-btn text style="cursor: pointer" to="/">
        Radio Net
      </v-btn>
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
    </v-app-bar>
  </div>
</template>
<script>
export default {
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
