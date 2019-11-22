<template>
  <div v-if="user.loggedIn" class="alert alert-success" role="alert">You are logged in!</div>
  <v-btn v-else>Login</v-btn>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  }
};
</script>
