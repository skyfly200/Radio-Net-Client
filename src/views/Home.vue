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
          v-card-title Project is still in alpha stage development
          v-card-subtitle
            p This means there will be things that are buggy or broken. Feel free to let me know by submitting issue on the github page for ths project
            v-btn(href="").ma-4
              v-icon mdi-github
              span Project on Github
            v-alert(type="error") This release is solely for preview purposes, don't store anything you would not want to lose on here. Features may also change and your data may not be saved properly. Data may be deleted or become unaccesable without notice! You have been warned!
          v-divider
          v-card-action
            template(v-if="subscribed")
              h2 Thanks for signing up!
            template(v-else)
              h2 Subscribe for email updates on our progress towards beta and beyond
              p We will not spam your inbox and we promise not to give your email to anyone.
              v-text-field(v-model="email" label="Email")
              v-btn Subscribe
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
        v-btn(to="auth" large color="primary").mt-7 Sign Up
</template>
<script>
export default {
  components: {},
  data: () => ({
    email: "",
    subscribed: false
  })
};
</script>
