<template lang="pug">
v-container(fluid grid-list-md).chat
  v-layout.layout
    v-flex.conversations(sm4)
      ConversationIndex(:conversations="conversations"
        @select="selectConvo($event)"
        @new="newConversation"
        @delete="deleteConvo($event)")
    v-divider(vertical)
    v-flex.active-conversation(sm8)
      ConversationView(:contacts="contacts" :conversation="activeConvo"
        @sendMessage="sendMessage($event)"
        @updateTitle="activeConvo.title = $event"
        @updateRecipients="updateRecipients($event)"
        @leave="leaveConvo($event)"
        @delete="deleteConvo($event)")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { format, isToday, isThisWeek, isThisYear, getTime } from "date-fns";
import firebase from "firebase";

import ConversationIndex from "@/components/chat/ConversationIndex.vue";
import ConversationView from "@/components/chat/ConversationView.vue";

// vuex stuff
import { mapGetters } from "vuex";
import { Conversation } from "@/models/conversation";
import { Contact } from "@/models/contact";
import { Message } from "@/models/message";
import { PropUpdate } from "@/models/propUpdate";

var db = firebase.firestore();

@Component({
  components: { ConversationIndex, ConversationView },
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
      return this.getUser.displayName;
    },
    ...mapGetters({
      getUser: "getUser",
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
        let message = {
          convoID: this.active,
          author: this.getUser ? this.username : "guest",
          body: body,
          timestamp: new Date()
        };
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
})
export default class Chat extends Vue {}
</script>

<style lang="sass" scoped>
.layout
  height: 100%
.container
  height: 100%
.flex
  display: flex
  flex-direction: column
.container.grid-list-md .layout .flex
  padding: 0
</style>
