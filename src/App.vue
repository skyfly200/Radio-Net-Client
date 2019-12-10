<template>
  <v-app id="app">
    <Nav />
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <ChatBar v-if="showChat" />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Nav from "./components/Nav.vue";
import ChatBar from "@/components/ChatBar.vue";
import firebase from "firebase";

@Component({
  components: {
    Nav,
    ChatBar
  },
  watch: {
    $route(to, from) {
      this.showChat = !["chat"].includes(to.name);
    }
  },
  mounted() {
    this.$store.dispatch("syncAuth").then(authed => {
      console.log("Authed: ", authed);
      this.$store.dispatch("sync", this.$store.getters.getUID);
    });
  },
  data: () => ({
    showChat: true
  }),
  methods: {}
})
export default class App extends Vue {}
</script>

<style lang="sass">
#app
  font-family: "Avenir", Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
.grecaptcha-badge
  display: none !important
.container
  padding: 0 12px
</style>
