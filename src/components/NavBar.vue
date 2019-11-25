<template>
  <!-- display the navigation bar -->
  <v-app-bar app dense dark>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
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
</template>
<script>
export default {
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
    signout() {
      this.$store.dispatch("signOutAction");
    }
  }
};
</script>
