<template lang="pug">
  div
    v-navigation-drawer(app v-model="drawer")
      v-list.pa1
        template(avatar v-if='userLoggedIn')
          v-list-item
            v-list-item-avatar
              v-img(:src="user.photoURL")
            v-list-item-content
              .welcome
                span Welcome&nbsp;
                router-link(to='/profile') {{ name }}
          v-divider
          v-list-item(@click='signout')
            v-list-item-action
              v-icon mdi-logout-variant
            v-list-item-content
              v-list-item-title Logout
        template(v-else)
          v-list-item(to='/login')
            v-list-item-action
              v-icon mdi-login-variant
            v-list-item-content
              v-list-item-title Login
          v-list-item(to='/register')
            v-list-item-action
              v-icon mdi-account-plus
            v-list-item-content
              v-list-item-title Register
        v-divider
        v-list-item(to='/')
          v-list-item-action
            v-icon mdi-home
          v-list-item-content
            v-list-item-title Home
        v-list-item(to='/about')
          v-list-item-action
            v-icon mdi-information
          v-list-item-content
            v-list-item-title About
        template(v-if='userLoggedIn')
          v-list-item(to='/dashboard')
            v-list-item-action
              v-icon mdi-account
            v-list-item-content
              v-list-item-title Dashboard
          v-list-item(to='/groups')
            v-list-item-action
              v-icon mdi-account-group
            v-list-item-content
              v-list-item-title Groups
          v-list-item(to='/chat')
            v-list-item-action
              v-icon mdi-message
            v-list-item-content
              v-list-item-title Chat
          v-list-item(to='/share')
            v-list-item-action
              v-icon mdi-file-cloud
            v-list-item-content
              v-list-item-title Content
    v-app-bar(app dense dark)
      v-app-bar-nav-icon(@click="openDrawer")
      v-btn(text style="cursor: pointer" to="/") Radio Net
      v-spacer
      #user
        template(v-if='userLoggedIn')
          .user-img
            v-img(:src="user.photoURL" width="40")
          .controls.pt-3
            .welcome
              span Welcome&nbsp;
              router-link(to='/profile') {{ name }}
            .logout
              v-btn(text small @click='signout') Logout
        template(v-else)
          v-btn(text to='/login') Login
          v-btn(text to='/register') Register
      template(v-slot:extension)
        StreamPlayer
</template>
<script>
import StreamPlayer from "@/components/StreamPlayer.vue";
export default {
  components: {
    StreamPlayer
  },
  data: function() {
    return {
      drawer: false
    };
  },
  computed: {
    userLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.getUser;
    },
    name() {
      return this.$store.getters.getUser.name;
    }
  },
  methods: {
    openDrawer() {
      this.drawer = true;
    },
    signout() {
      this.$store.dispatch("signOutAction");
    }
  }
};
</script>

<style lang="sass">
#links
  margin: auto 1em
#user
  margin-left: 24px
  display: flex
  align-items: center
  justify-content: center
  .user-img
    margin-right: 0.5em
    .v-image
      border-radius: 50%
  .controls
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
</style>
