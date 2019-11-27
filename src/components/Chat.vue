<template lang="pug">
  div
    p Chat
    v-divider
    v-list(three-line)
      v-list-item(v-for="m in messages")
        v-list-item-content
          v-list-item-title {{ m.name }}
          p {{ m.text }}
          p {{ Date(m.timestamp) }}
        v-list-item-avatar
          v-img(:src="m.profilePicUrl")
    .input
      v-textarea(v-model="message")
      v-btn(icon @click="send")
        v-icon mdi-send
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase";
export default Vue.extend({
  data: function() {
    return {
      message: "",
      messages: []
    };
  },
  created() {
    this.loadMessages();
  },
  methods: {
    // Loads chat messages history and listens for upcoming ones.
    loadMessages() {
      // Create the query to load the last 12 messages and listen for new ones.
      var query = firebase
        .firestore()
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(12);

      let t = this;
      // Start listening to the query.
      query.onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === "removed") {
            //deleteMessage(change.doc.id);
          } else {
            var message = change.doc.data();
            t.messages.push(message);
            //displayMessage(change.doc.id, message.timestamp, message.name, message.text, message.profilePicUrl, message.imageUrl);
          }
        });
      });
    },
    send() {
      let user = this.$store.getters.user;
      let newMessage;
      if (!user) {
        newMessage = {
          name: "guest",
          text: this.message,
          profilePicUrl: "", // TO-DO default user images
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
      } else {
        newMessage = {
          name: user.displayName,
          text: this.message,
          profilePicUrl: user.photoURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
      }
      this.message = "";
      return firebase
        .firestore()
        .collection("messages")
        .add(newMessage)
        .catch(function(error) {
          console.error("Error writing new message to database", error);
        });
    }
  }
});
</script>

<style lang="sass" scoped>
.input
  display: flex
  flex-direction: horizontal
</style>