<template lang="pug">
v-container(fluid grid-list-md).profile
  ImgUpload(:type="imageDialogType" @done="console.log($event)" @close="imageDialog = false" :toggle="imageDialog" :multi="false")
  v-layout.layout(v-if="status === 'ready'")
    v-flex.heading
      v-card(color='grey lighten-4')
        .header-image
          ImgEditHover(:editable="ownProfile" v-on:open="openImageDialog('header')" :src="headerImg")
        .header-body
          .profile-image
            ImgEditHover(profile="true" :editable="ownProfile" v-on:open="openImageDialog('profile')" width='200px' :src="profileImg")
          .profile-info
            h1 {{ titleCase(user.name) }}
            h3(v-if="ownProfile") Joined: {{ dateJoined }}
            h3(v-if="ownProfile") Last Login: {{ lastLogin }}
    v-flex.sections
      v-card.bio.section(color='grey lighten-4')
        v-card-title
          h2 Bio
        v-card-text
          .section-view(v-if="!edit.bio")
            p {{ user.bio }}
          .section-edit(v-else)
            v-form
              v-textarea(name="bio" label="Bio" :value="user.bio")
              v-btn(@click="edit.bio = false") Cancel
              v-btn(@click="") Save
        v-card-actions(v-if="ownProfile && !edit.bio")
          v-spacer
          v-btn(@click="edit.bio = true" fab dark small color="primary")
            v-icon mdi-pencil
      v-card.fields.section(color='grey lighten-4')
        v-card-title
          h2 Profile Info
        v-card-text
          .section-view(v-if="!edit.info")
            .field(v-for="field in user.profile")
              h3 {{ field.title }}: {{ field.value }}
              br
          .section-edit(v-else)
            v-form
              .field-edit(v-for="field in user.profile")
                v-text-field(:name="field.title" :label="field.title" :value="field.value")
              v-btn(@click="edit.info = false") Cancel
              v-btn(@click="") Save
        v-card-actions(v-if="ownProfile && !edit.info")
          v-spacer
          v-btn(@click="edit.info = true" fab dark small color="primary")
            v-icon mdi-pencil
      v-card.groups.section(v-if="user.groups !== undefined && user.groups.length" color='grey lighten-4')
        v-card-title
          h2 Groups
        v-card-text
          v-list.groups-list
            v-list-item.group(v-for="group in user.groups")
              v-list-item-avatar
                v-img(:src="group.img")
              v-list-item-content
                v-list-item-title
                  h2 {{ titleCase(group.title) }}
                  h3 {{ group.role }}
              v-list-item-action
                v-btn(:to="'/group/' + group.title" text small) Visit
      v-card.activity.section(v-if="user.activity !== undefined && user.activity.length" color='grey lighten-4')
        v-card-title
          h2 Recent Activity
        v-card-text
          v-timeline
            v-timeline-item.event(v-for="event in user.activity")
              template(v-slot:opposite)
                h4 {{ fullDateFormat(event.time) }}
              v-card.elevation-2
                v-card-title.headline
                  h3 {{ event.title }}
                v-card-text
                  h4 {{ event.type }}
                  p {{ event.details }}
  v-layout(v-else-if="status === 'missing'")
    v-flex
      v-card(color='grey lighten-4')
        h1 The user {{ username }} doesn't exist
  v-layout(v-else-if="status === 'loading'")
    v-flex
        v-progress-circular.loading.ma-6(indeterminate)
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { format } from "date-fns";
import firebase from "firebase";

import ImgUpload from "@/components/ImgUpload.vue";
import ImgEditHover from "@/components/ImgEditHover.vue";

var db = firebase.firestore();

@Component({
  components: { ImgUpload, ImgEditHover },
  data: () => ({
    user: {},
    username: "",
    status: "loading",
    imageDialogType: "",
    imageDialog: false,
    imgUpload: "",
    profileImg: "",
    headerImg: "",
    edit: {
      info: false,
      bio: false
    }
  }),
  watch: {
    $route(to, from) {
      this.username = this.$route.params.username
        ? this.$route.params.username
        : this.$store.getters.getUser.name;
      this.getProfile(this.username);
    }
  },
  created() {
    this.username = this.$route.params.username
      ? this.$route.params.username
      : this.$store.getters.getUser.name;
    this.getProfile(this.username);
  },
  computed: {
    dateJoined: function() {
      let joined = this.$store.getters.getJoined;
      let date = new Date(joined);
      return this.fullTimestampFormat(date);
    },
    lastLogin: function() {
      let last = this.$store.getters.getLastLogin;
      let date = new Date(last);
      return this.fullTimestampFormat(date);
    },
    ownProfile: function() {
      return !this.$route.params.username;
    }
  },
  methods: {
    openImageDialog: function(type) {
      this.imageDialog = true;
      this.imageDialogType = type;
    },
    fullDateFormat: function(d) {
      return format(d, "LLLL do y");
    },
    fullTimestampFormat: function(d) {
      return format(d, "PPpp");
    },
    titleCase: function(string) {
      if (string) return string.charAt(0).toUpperCase() + string.slice(1);
      else return "";
    },
    getProfile: function(username) {
      let query = db.collection("users").where("name", "==", username);
      let t = this;
      query
        .get()
        .then(function(querySnapshot) {
          if (!querySnapshot.empty) {
            let data = {};
            querySnapshot.forEach(function(doc) {
              data = doc.data();
            });
            t.user = data;
            t.profileImg = data.profileImg;
            t.headerImg = data.headerImg;
          } else {
            t.status = "missing";
          }
        })
        .catch(function(error) {
          console.log("Error getting user profle: ", error);
        });

      this.user.groups = [
        {
          title: "test",
          role: "admin",
          img: "http://lorempixel.com/200/200/nature"
        }
      ];
      this.user.activity = [
        {
          title: "Event 1",
          time: new Date("4/29/19"),
          type: "Test",
          details: "Test Event 1"
        },
        {
          title: "Event 2",
          time: new Date("4/27/19"),
          type: "Test",
          details: "Test Event 2"
        },
        {
          title: "Event 3",
          time: new Date("4/22/19"),
          type: "Test",
          details: "Test Event 3"
        }
      ];
      this.user.bio =
        "This is the users bio section. It can be customized to serve as an introduction for other users visiting their profile page.";
      this.status = "ready";
    }
  }
})
export default class Profile extends Vue {}
</script>

<style lang="sass" scoped>
.layout
  display: flex
  flex-direction: column
  justify-content: center
.header-image img
  width: 100%
.header-body
  display: flex
  justify-content: left
  flex-wrap: wrap
  .profile-image
    margin-left: 10%
  .profile-info
    margin: 0 1em 1em 3em
.sections
  display: flex
  justify-content: center
  flex-wrap: wrap
  .section
    padding: 0.5em
    width: 100%
    margin: 0.5em 0
    display: flex
    flex-direction: column
    justify-content: center
    .v-card__text
      height: 100%
      min-height: 20vh
  .bio, .fields
    flex: 1 50%
</style>
