<template>
  <div class="chat-bar">
    <v-spacer />
    <v-fab-transition>
      <v-btn
        v-show="!showChatBar"
        @click="showChatBar = !showChatBar"
        fixed
        bottom
        right
        color="blue darken-2"
        dark
        fab
      >
        <v-icon>mdi-message</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-slide-y-reverse-transition>
      <v-toolbar v-show="showChatBar" dense bottom tile>
        <v-btn icon @click.stop.prevent="" text>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-spacer />
        <v-menu
          top
          offset-y
          v-model="menu"
          transition="scale-transition"
          :close-on-click="false"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click.stop.prevent text>
              <span>Public</span>
            </v-btn>
          </template>
          <v-sheet class="chat-window pb-3" height="50vh" width="300px">
            <v-toolbar dense tile>
              <h3>Chat</h3>
              <v-spacer />
              <v-btn @click="menu = false" right icon small>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <Chat />
          </v-sheet>
        </v-menu>
        <v-btn @click="showChatBar = !showChatBar" text small>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </v-toolbar>
    </v-slide-y-reverse-transition>
  </div>
</template>
<script>
import Chat from "@/components/Chat.vue";
export default {
  components: {
    Chat
  },
  data() {
    return {
      showChatBar: true,
      menu: false
    };
  }
};
</script>
<style lang="sass" scoped>
.chat-window
  overflow-y: hidden
</style>
