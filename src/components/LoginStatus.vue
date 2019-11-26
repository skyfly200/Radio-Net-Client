<template>
  <div>
    <img :src="photo" style="height: 120px" /> <br />
    <p>{{ name }}</p>
    <p>Email: {{ email }}</p>
    <p>User ID: {{ userId }}</p>
    <p>Auth Provider: {{ provider }}</p>
    <p>Last Login: {{ lastLogin }}</p>
    <p>Joined on: {{ joined }}</p>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  data() {
    return {
      photo: "",
      userId: "",
      name: "",
      email: "",
      provider: "",
      lastLogin: "",
      joined: "",
      user: {}
    };
  },
  created() {
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.name = this.user.displayName;
      this.email = this.user.email;
      this.photo = this.user.photoURL;
      this.userId = this.user.uid;
      this.provider = this.user.providerId;
      this.lastLogin = this.user.lastLoginAt;
      this.joined = this.user.createdAt;
    }
  }
};
</script>
