<template lang="pug">
v-list-item.conversation(@click="$emit('select')")
  v-list-item-avatar
    v-img(v-if="c.members.length > 1" :src="selectConvoAvatar(c)")
    v-icon(v-else large) mdi-account
  v-list-item-content(:class="{ unread: c.unread }")
    v-list-item-title
      h5 {{ autoTitle(c) }}
      span(v-if="c.messages.length").message-body {{ c.messages[c.messages.length - 1].body }}
  v-list-item-action
    v-btn(v-if="!c.messages.length" icon text @click="$emit('delete')")
      v-icon mdi-close
    span(v-else).timestamp {{ formatTimestamp(c.messages[c.messages.length - 1].timestamp) }}
</template>
<script>
import { Component, Vue } from "vue-property-decorator";
// import date-fns utils
import { format, isToday, isThisWeek, isThisYear } from "date-fns";

@Component({
  props: ["c"],
  computed: {
    username: function() {
      return this.$store.getters.getUser.username;
    }
  },
  methods: {
    formatTimestamp: function(t) {
      let f = isToday(t)
        ? format(t, "h:mm a")
        : isThisWeek(t)
        ? format(t, "ddd")
        : isThisYear
        ? format(t, "MMM Do")
        : format(t, "M/D/YY");
      return f;
    },
    autoTitle: function(c) {
      let auto = this.getOtherMembers(c.members)
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
    getOtherMembers: function(members) {
      return members ? members.filter(m => m.username !== this.username) : [];
    },
    selectConvoAvatar: function(c) {
      let members = this.getOtherMembers(c.members);
      return members.length && members[0] ? members[0].avatar : null;
    },
    titleCase: function(string) {
      return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
    }
  }
})
export default class ConvoTile extends Vue {}
</script>
<style lang="sass" scoped>
.conversation
  .v-list__tile__content
    margin-top: -15px
  .unread .message-body
    font-weight: bold
    color: black
  .message-body
    margin: 0
  .timestamp
    font-size: 0.8em
</style>
