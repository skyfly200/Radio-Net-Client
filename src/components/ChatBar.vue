<template lang="pug">
  .chat-bar
    v-spacer
    v-fab-transition
      v-btn(
        v-show="!showChatBar"
        @click="showChatBar = !showChatBar"
        fixed
        bottom
        right
        color="blue darken-2"
        dark
        fab)
        v-icon mdi-message
    v-slide-y-reverse-transition
      v-toolbar(v-show="showChatBar" dense bottom tile)
        v-btn(v-if="userLoggedIn" icon @click.stop.prevent text)
          v-icon mdi-plus
        v-spacer
        v-menu(
          v-for="convo in conversations"
          v-model="menu[convo.id]"
          :key="convo.id"
          top
          offset-y
          nudge-top="6"
          origin="bottom center"
          transition="scale-transition"
          :close-on-click="false"
          :close-on-content-click="false")
          template(v-slot:activator="{ on }")
            v-btn(v-on="on" @click.stop.prevent text)
              span {{ convo.title }}
          v-sheet(height="50vh" width="300px")
            conversation-view(
              :contacts="contacts"
              :conversation="convo"
              @sendMessage="sendMessage($event)"
              @updateTitle="convo.title = $event"
              @updateRecipients="updateRecipients($event)"
              @leave="leaveConvo($event)"
              @delete="deleteConvo($event)")
        v-btn(@click="showChatBar = !showChatBar" text small)
          v-icon mdi-chevron-down
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
      menu: { public: false }
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
      return this.getUser.name;
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
      if (this.isRecipients) {
        this.$store.dispatch("send_message", {
          author: this.username ? this.username : "guest",
          body: body,
          timestamp: new Date()
        });
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
      // TO-DO remove coversation from users list
    },
    leaveConvo: function(i) {
      this.$store.dispatch("leave_conversation", i);
    },
    updateRecipients: function(recipients) {
      let self = new Contact({
        username: this.username,
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
      });
      let allRecpients = recipients;
      allRecpients.push(self);
      if (!this.isFirst) this.$store.dispatch("set_recipients", allRecpients);
    }
  }
};
</script>
<style lang="sass" scoped>
.chat-window
</style>
