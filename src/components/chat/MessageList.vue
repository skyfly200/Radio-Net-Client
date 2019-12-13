<template lang="pug">
  .messages(v-chat-scroll="{always: false, smooth: true, scrollonremoved:true, smoothonremoved: false}")
    v-fade-transition(group)
      Message.message(v-for="m in conversation.messages"
        :key="m.author+'/'+m.timestamp"
        :author="m.author",
        :avatar="getAvatar(m.author)",
        :body="m.body",
        :timestamp="formatTimestamp(m.timestamp)",
        :own="m.author === username",
        :showName="isMulti && m.author !== username")
</template>
<script>
import { Component, Vue } from "vue-property-decorator";
import Message from "@/components/chat/Message.vue";
// import date-fns utils
import { format, isToday, isThisWeek, isThisYear, getTime } from "date-fns";

@Component({
  components: { Message },
  props: ["conversation"],
  computed: {
    username: function() {
      return this.$store.getters.isLoggedIn
        ? this.$store.getters.getUser.username
        : "";
    },
    isMulti: function() {
      return this.conversation.members.length > 2;
    }
  },
  methods: {
    formatTimestamp: function(x) {
      let t = x.toDate();
      let f = isToday(t)
        ? format(t, "h:mm a")
        : isThisWeek(t)
        ? format(t, "EEE")
        : isThisYear
        ? format(t, "MMM do")
        : format(t, "M/D/YY");
      return f;
    },
    getTime: getTime,
    getAvatar: function(author) {
      var member = this.conversation.members.find(m => m.username === author);
      return member ? member.avatar : "";
    }
  }
})
export default class MessageList extends Vue {}
</script>
<style lang="sass" scoped>
.messages
  display: flex
  flex-direction: column
  justify-content: flex-end
  height: 68vh
  span
    overflow-y: auto
</style>
