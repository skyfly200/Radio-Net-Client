<template lang="pug">
  div
    p Chat
    v-divider
    v-list(three-line)
      v-list-item(v-for="m in messages")
        v-list-item-content {{ m.name }}: {{ m.text }}
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
  methods: {
    send() {
      let user = this.$store.getters.user;
      let newMessage;
      if (!user) {
        newMessage = {
          name: "anonmous",
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
      this.messages.push(newMessage);
      this.message = "";
    },
    // Saves a new message to your Cloud Firestore database.
    saveMessage(messageText: String) {
      // Add a new message entry to the database.
      let user = this.$store.getters.user;
      return firebase
        .firestore()
        .collection("messages")
        .add({
          name: user.displayName,
          text: messageText,
          profilePicUrl: user.imageURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
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