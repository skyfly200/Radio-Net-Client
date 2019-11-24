<template>
  <!-- display the navigation bar -->
  <v-app-bar app dense dark>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-btn text style="cursor: pointer" to="/">
      Radio Net
    </v-btn>
    <v-spacer></v-spacer>
    <!-- navigation bar links -->
    <v-btn text class="hidden-xs-only" v-for="item in items" :key="item.title" :to="item.link">
      <v-icon class="mr-2" right>{{ item.icon }}</v-icon>
      <span>{{ item.title }}</span>
    </v-btn>
    <!-- sign out button -->
    <v-btn text class="hidden-xs-only">
      <v-icon class="mr-2" right>mdi-logout-variant</v-icon>
      <span>Logout</span>
    </v-btn>
  </v-app-bar>
</template>
<script>
export default {
  computed: {
    items() {
      let menuItems = [
        {
          title: "Register",
          icon: "mdi-login-variant",
          link: "/register"
        },
        {
          title: "Login",
          icon: "mdi-account-plus",
          link: "/login"
        }
      ];
      return menuItems;
    }
  }
};
</script>
