<template lang="pug">
  v-toolbar.view-toolbar(flat dense)
    template(v-if="menu === 'recipients' || !isRecipients")
      UserSelector(:previous="getOthers(conversation.members)" :contacts="getOthers(contacts)" @done="updateRecipients($event)")
    template(v-else-if="menu === 'search'")
      v-text-field.search(name="search" label="Search Conversation" single-line full-width hide-details clearable
        v-model="query"
        prepend-icon="mdi-magnify"
        append-outer-icon="mdi-check"
        @click:append-outer="menu = ''")
    template(v-else-if="menu === 'title'")
      v-text-field.title-edit(name="title" label="Conversation Title" single-line full-width hide-details
        v-model="title"
        prepend-icon="mdi-format-title"
        append-outer-icon="mdi-check"
        @click:append-outer="updateTitle")
    template(v-else)
      v-spacer
      v-toolbar-title.title-view {{ autoTitle(conversation) }}
      v-spacer
      v-menu(bottom left)
        template(v-slot:activator="{ on }")
          v-btn(icon v-on="on")
            v-icon mdi-dots-vertical
        v-list(dense)
          v-list-item(@click="menu = 'search'")
            v-list-item-action
              v-icon mdi-magnify
            v-list-item-title Search Conversation
          v-list-item(v-if="isMulti" @click="menu = 'title'")
            v-list-item-action
              v-icon mdi-format-title
            v-list-item-title Rename Conversation
          v-list-item(v-if="isMulti && isOwner" @click="menu = 'recipients'")
            v-list-item-action
              v-icon mdi-account-plus
            v-list-item-title Edit Recipients
          v-list-item(v-if="isMulti" @click="$emit('leave', conversation.id)")
            v-list-item-action
              v-icon mdi-minus-circle
            v-list-item-title Leave Conversation
          v-list-item(@click="$emit('delete', conversation.id)")
            v-list-item-action
              v-icon mdi-delete
            v-list-item-title Delete Conversation
          v-list-item(@click="$emit('pane', 'notifications')")
            v-list-item-action
              v-icon mdi-bell-off
            v-list-item-title Mute Notifications
          v-list-item(@click="$emit('pane', 'style')")
            v-list-item-action
              v-icon mdi-palette
            v-list-item-title Set Conversation Styles
          v-list-item(@click="$emit('pane', 'info')")
            v-list-item-action
              v-icon mdi-information
            v-list-item-title Info
</template>
<script>
import { Component, Vue } from "vue-property-decorator";
import UserSelector from "@/components/chat/UserSelector.vue";

@Component({
  components: { UserSelector },
  props: ["conversation", "contacts"],
  data: function() {
    return {
      menu: "",
      title: "",
      query: ""
    };
  },
  created: function() {
    this.title = this.conversation.title;
  },
  computed: {
    username: function() {
      return this.$store.getters.getUser.username;
    },
    isMulti: function() {
      return this.conversation.members.length > 2;
    },
    isOwner: function() {
      return this.conversation.creator === this.$store.getters.getUser.username;
    },
    isRecipients: function() {
      return this.conversation.members.length > 1;
    }
  },
  methods: {
    updateTitle: function() {
      this.menu = "";
      this.$emit("updateTitle", this.title);
      this.title = "";
    },
    updateRecipients: function(recipients) {
      this.menu = "";
      this.$emit("updateRecipients", recipients);
    },
    getOthers: function(members) {
      return members ? members.filter(m => m.username !== this.username) : [];
    },
    autoTitle: function(c) {
      let auto = this.getOthers(c.members)
        .map(m => this.titleCase(m.username))
        .join(", ");
      return c.title
        ? c.title
        : c.members.length > 1
        ? c.messages.length > 0
          ? auto
          : "New Message to " + auto
        : "New Message";
    },
    titleCase: function(string) {
      return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
    }
  }
})
export default class MessageBar extends Vue {}
</script>
<style lang="sass" scoped></style>
