<template>
  <div class="social-btns">
    <v-btn icon x-large @click="signIn('fb')" class="ma-3" elevation="6">
      <v-icon>mdi-facebook</v-icon>
    </v-btn>
    <v-btn icon x-large @click="signIn('go')" class="ma-3" elevation="6">
      <v-icon>mdi-google</v-icon>
    </v-btn>
    <v-btn icon x-large @click="signIn('gh')" class="ma-3" elevation="6">
      <v-icon>mdi-github-circle</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  methods: {
    signIn(provider) {
      this.$store.dispatch("providerSignIn", provider).then(() => {
        let path = this.$route.params.redirect
          ? this.$route.params.redirect
          : "dashboard";
        this.$router.push(path);
      });
    }
  }
};
</script>
