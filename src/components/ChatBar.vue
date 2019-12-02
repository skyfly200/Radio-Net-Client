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
        <v-btn v-if="userLoggedIn" icon @click.stop.prevent="" text>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-spacer />
        <v-menu
          v-model="menu"
          v-for="chat in chats"
          :key="chat.id"
          top
          offset-y
          nudge-top="6"
          origin="bottom center"
          transition="scale-transition"
          :close-on-click="false"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click.stop.prevent text>
              <span>{{ chat.title }}</span>
            </v-btn>
          </template>
          <v-sheet>
            <conversation-view
              height="50vh"
              width="300px"
              :contacts="contacts"
              :conversation="activeConvo"
              @sendMessage="sendMessage($event)"
              @updateTitle="activeConvo.title = $event"
              @updateRecipients="updateRecipients($event)"
              @leave="leaveConvo($event)"
              @delete="deleteConvo($event)"
            />
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
import { mapGetters } from "vuex";
import { Conversation } from "@/models/conversation";
import { Contact } from "@/models/contact";
import { Message } from "@/models/message";
import { PropUpdate } from "@/models/propUpdate";
import { format, isToday, isThisWeek, isThisYear, getTime } from "date-fns";
import ConversationView from "@/components/chat/ConversationView.vue";
export default {
  components: {
    ConversationView
  },
  data() {
    return {
      showChatBar: false,
      menu: false,
      chats: [{ title: "Public", id: "public" }]
    };
  },
  computed: {
    isMulti: function() {
      return this.activeConvo.members.length > 2;
    },
    isRecipients: function() {
      return this.activeConvo.members.length > 1;
    },
    isFirst: function() {
      return this.activeConvo.messages.length === 0;
    },
    isNew: function() {
      return this.conversations[0] && this.conversations[0].members.length <= 1;
    },
    username: function() {
      return this.getUser.username;
    },
    ...mapGetters({
      getUser: "getUser",
      userLoggedIn: "isLoggedIn",
      contact: "getContact",
      contacts: "getContacts",
      conversation: "getConversation",
      conversations: "getConversations",
      active: "activeID",
      activeConvo: "getActiveConversation"
    })
  },
  methods: {
    sendMessage: function(body) {
      if (this.isFirst) {
        pass;
        //this.$socket.emit('start_conversation', this.activeConvo);
      }
      if (this.isRecipients) {
        let message = {
          convoID: this.active,
          author: this.username,
          body: body,
          timestamp: new Date()
        };
        //this.$socket.emit('message', this.active, message);
        this.$store.dispatch("send_message", new Message(message));
      }
    },
    newConversation: function() {
      if (!this.isNew) {
        let newConvo = new Conversation({
          id: new Date().getTime(),
          unread: false,
          title: "",
          styles: {
            color: "default",
            density: "medium"
          },
          notifications: {
            state: true
          },
          created: new Date(),
          creator: this.username,
          members: [
            {
              username: this.username,
              avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
            }
          ],
          messages: []
        });
        this.$store.dispatch("start_conversation", newConvo);
        this.$store.dispatch("select_conversation", newConvo.id);
      }
    },
    selectConvo: function(i) {
      this.$store.dispatch("select_conversation", i);
      this.$store.dispatch(
        "update_conversation",
        new PropUpdate({ id: i, property: "unread", value: false })
      );
    },
    deleteConvo: function(i) {
      this.$store.dispatch("delete_conversation", i);
    },
    leaveConvo: function(i) {
      //this.$store.dispatch("leave_conversation", i);
    },
    updateRecipients: function(recipients) {
      let self = new Contact({
        username: this.username,
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
      });
      let allRecpients = recipients;
      allRecpients.push(self);
      if (!this.isFirst)
        //this.$socket.emit('set_recipients', allRecpients, this.activeConvo);
        this.$store.dispatch("set_recipients", allRecpients);
    }
  }
};
</script>
<style lang="sass" scoped>
.chat-window
</style>
