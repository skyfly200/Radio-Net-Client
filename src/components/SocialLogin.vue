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
  mounted() {
    this.$store
      .dispatch("syncAuth")
      .then(flag => {
        let path = this.$route.query.redirect
          ? this.$route.query.redirect
          : "dashboard";
        if (flag) this.$router.push(path);
      })
      .catch(error => {
        console.error(error);
      });
  },
  methods: {
    signIn(provider) {
      this.$store
        .dispatch("providerSignIn", provider)
        .then(() => {
          let path = this.$route.query.redirect
            ? this.$route.query.redirect
            : "dashboard";
          this.$router.push(path);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
