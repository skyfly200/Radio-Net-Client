<template>
  <v-app id="app">
    <Nav />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Nav from "./components/Nav.vue";
import firebase from "firebase";

@Component({
  components: {
    Nav
  },
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
</style>
