<template>
  <v-app id="app">
    <Nav />
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right
      direction="left"
      transition="slide-x-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon>mdi-message</v-icon>
        </v-btn>
      </template>
      <v-menu
        top
        offset-y
        allow-overflow
        v-model="menu"
        transition="scale-transition"
        :close-on-click="false"
        :close-on-content-click="false"
        max-height="50vh"
        max-width="300px"
      >
        <template v-slot:activator="{ on }">
          <v-btn fab v-on="on" @click.stop.prevent dark small color="green">
            <span>SF</span>
          </v-btn>
        </template>
        <v-sheet class="pb-3">
          <v-toolbar>
            <h3>Chat</h3>
            <v-spacer />
            <v-btn @click="menu = false" right icon small>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider />
          <Chat />
        </v-sheet>
      </v-menu>
      <v-btn fab dark @click.stop.prevent="" small color="indigo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Nav from "./components/Nav.vue";
import Chat from "@/components/Chat.vue";
import firebase from "firebase";

@Component({
  components: {
    Nav,
    Chat
  },
  data() {
    return {
      fab: false,
      menu: false
    };
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
