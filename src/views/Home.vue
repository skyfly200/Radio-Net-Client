<template lang="pug">
  v-container.home(fluid)
    v-row.ma-8
      v-col
        h1.appTitle Welcome to Radio Net
        h2 The platform built entirely
        h2 For community radio stations
        h2 By community radio stations
        v-btn(to="auth" large color="primary").mt-7 Sign Up
    v-row
      v-col(center)
        v-card.ma-6
          v-card-title 
            h3 Project is still in alpha stage development!
          v-card-subtitle
            p This means there will be things that are buggy or broken. Feel free to report them by submitting issue on the github page for this project and we will work on them as time allows.
            v-btn(href="https://github.com/skyfly200/Radio-Net-Client" target="new").ma-4
              v-icon mdi-github
              span Project on Github
            p If you would like to contribute to this projects development plase email us at 
              a(href="mailto:wayhighradio@gmail.com") wayhighradio@gmail.com
            v-alert(type="error") This release is solely for preview purposes, don't store anything you would not want to lose on here. Features may also change and your data may not be saved properly. Data may be deleted or become unaccesable without notice! You have been warned!
          v-divider
          v-card-actions.pa-4
            template(v-if="subscribed")
              h3 Thanks for signing up!
            template(v-else)
              v-form(v-model="valid").ma-4
                h3.ma-2 Subscribe for email updates on our progress towards beta and beyond
                v-text-field(v-model="name" solo required label="Name")
                v-text-field(v-model="email" :rules="emailRules" solo required label="Email")
                p We promise not to spam your inbox or give your email to anyone.
                v-btn(:disabled="!valid" @click="subscribe") Subscribe
    v-row
      v-col(center)
        v-card.ma-6(center)
          v-card-title Stay Connected
          v-card-subtitle
            p Integrated chats allow station DJs to stay connected with listeners, peers, and admin
            p Alert systems allow for faster response to outages and logging helps root out persistant issues
            p Notifications on mobile, so you can stay up to date anywherewith a signal
        v-card.ma-6(center)
          v-card-title Less Friction
          v-card-subtitle
            p Radio Net's goal is to simplify managment of small community radio stations
            p Create oppertunities and platforms for independent/home broacasters 
            p Simultaniuosly opening doors to new possibilities for more fluid community involvement
        v-card.ma-6
          v-card-title User Friendly
          v-card-subtitle
            p Built with Vuetify a Material Design framework for a clean, intuitive and familiar interface.
            p Designed with simplicity and ease of use in mind, so anyone can use it!
        v-card.ma-6
          v-card-title Groups and Profiles
          v-card-subtitle
            p Get to know and start discussions with your community members and fellow DJs
            p Follow your favorite stations and groups to stay up to date on there latest happenings
        v-card.ma-6
          v-card-title Live Streams
          v-card-subtitle
            p Listen to all your favorite community stations streams in one location
            p Sing Up to be a DJ and get your relay stream to broacast on stations in the network
        v-card.ma-6
          v-card-title Podcasting Platform
          v-card-subtitle
            p An automatic and seamless podcasting platform
            p Syndication and distribution of shows is a few clicks away
            p Explore past shows by your favorite DJs, or see recent shows on you local station
        v-btn(to="auth" large color="primary").ma-7 Sign Up
        br
        br
</template>
<script>
import firebase from "firebase";
import Vue from "vue";
import { VueReCaptcha } from "vue-recaptcha-v3";

export default {
  components: {},
  data: () => ({
    valid: true,
    name: "",
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    subscribed: false
  }),
  mounted() {
    Vue.use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY });
  },
  methods: {
    async recaptcha(action) {
      try {
        // (optional) Wait until recaptcha has been loaded.
        await this.$recaptchaLoaded();

        // Execute reCAPTCHA with provided action
        const token = await this.$recaptcha(action);
        return token;
      } catch (error) {
        console.error(error);
      }
    },
    subscribe: async function() {
      let t = this;
      var db = firebase.firestore();
      let recaptcha = await this.recaptcha("newsletter");
      db.collection("newsletter")
        .add({
          email: this.email,
          name: this.name,
          subscribedAt: new Date(),
          ua: navigator.userAgent,
          recaptcha: recaptcha
        })
        .then(function() {
          t.subscribed = true;
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  }
};
</script>
<style lang="sass" scoped></style>
