<template>
  <div class="social-btns">
    <v-btn
      icon
      x-large
      @click="registerWithFacebook"
      class="ma-3"
      elevation="6"
    >
      <v-icon>mdi-facebook</v-icon>
    </v-btn>
    <v-btn icon x-large @click="registerWithGoogle" class="ma-3" elevation="6">
      <v-icon>mdi-google</v-icon>
    </v-btn>
    <v-btn icon x-large @click="registerWithTwitter" class="ma-3" elevation="6">
      <v-icon>mdi-twitter</v-icon>
    </v-btn>
    <v-btn icon x-large @click="registerWithGitHub" class="ma-3" elevation="6">
      <v-icon>mdi-github-circle</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  methods: {
    registerWithFacebook() {
      this.$store.dispatch("facebookSignIn");
    },
    registerWithGoogle() {
      this.$store.dispatch("googleSignIn");
    },
    registerWithTwitter() {
      this.$store.dispatch("twitterSignIn");
    },
    registerWithGitHub() {
      this.$store.dispatch("githubSignIn");
    }
  }
};
</script>
