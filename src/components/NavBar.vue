<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-btn to="/">
        <v-icon>mdi-bullhorn</v-icon>
        <span>Radio Net</span>
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <template v-if="!user.loggedIn">
      <v-btn to="/login" icon>
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>
      <v-btn to="/register" icon>
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </template>
    <template v-else>
      <v-btn @click="signOut" icon>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>
<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "user"
    })
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "home"
          });
        });
    }
  }
};
</script>