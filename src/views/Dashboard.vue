<template lang="pug">
v-container(fluid).dashboard
  v-layout.heading
    h1 Welcome to the dashboard {{ name }}
  v-divider
  v-layout(row).body
    v-flex(shrink).links.card
      v-card
        v-card-title
          h3 Quick Links
        v-card-text
          v-btn(primary to="/profile").ma-2
            v-icon(left) mdi-account
            span Profile
          v-btn(primary to="/groups").ma-2
            v-icon(left) mdi-account-group
            span Groups
          v-btn(primary to="/chat").ma-2
            v-icon(left) mdi-message
            span Chat
    v-flex(grow).settings.card
      v-card
        v-card-title
          h3 Account Setting
        v-card-text
          EditableField(@edit="changeName($event)" title="Display Name" :v="name" icon="mdi-account").account-field.username
          v-divider
          EditableField(@edit="changeEmail($event)" title="Email" :v="email" icon="mdi-email").account-field.email
          v-divider
          br
          v-btn(primary @click="").password-btn
            v-icon(left) mdi-lock
            span Change Password
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";
import EditableField from "@/components/EditableField.vue";

var db = firebase.firestore();

@Component({
  components: { EditableField },
  data: () => ({
    email: "",
    name: "",
    photo: "",
    userId: "",
    user: {}
  }),
  created() {
    this.user = this.$store.getters.getUser;
    if (this.user) {
      this.name = this.user.name;
      this.email = this.user.email;
      this.photo = this.user.photoURL;
      this.userId = this.user.uid;
    }
  },
  methods: {
    changeName(name) {
      this.name = name;
      var user = firebase.auth().currentUser;
      user
        .updateProfile({ displayName: name })
        .then(function() {
          // Update successful.
        })
        .catch(function(error) {
          // An error happened.
        });
      // update in firestore
      db.collection("users")
        .doc(user.uid)
        .update({
          name: name
        })
        .then(function() {
          console.log("Name updated succesfuly!");
        })
        .catch(function(error) {
          console.error("Error updating name: ", error);
        });
    },
    changeEmail(email) {
      this.email = email;
      var user = firebase.auth().currentUser;
      user
        .updateEmail(email)
        .then(function() {
          // Update successful.
        })
        .catch(function(error) {
          // An error happened.
        });
      // update in firestore
      db.collection("users")
        .doc(user.uid)
        .update({
          email: email
        })
        .then(function() {
          console.log("Email updated succesfuly!");
        })
        .catch(function(error) {
          console.error("Error updating email: ", error);
        });
    }
  }
})
export default class Dashboard extends Vue {}
</script>

<style lang="sass" scoped>
.body
  margin-top: 25px
.links
  padding-right: 1em
  .v-card__text
    display: flex
    flex-direction: column
  .v-btn
    width: strech
.settings
  .password-btn
    margin-left: auto
  .v-card__text
    display: flex
    flex-direction: column
.v-btn
  width: fit-content
</style>
