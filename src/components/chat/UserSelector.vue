<template lang="pug">
  v-autocomplete.recipients(label="To" chips full-width return-object hide-details hide-no-data hide-selected multiple single-line dense
    v-model="members"
    :items="contacts"
    item-text="username"
    item-value="username"
    prepend-icon="mdi-contacts"
    append-outer-icon="mdi-check"
    @click:append-outer="$emit('done', members)")
    template(v-slot:selection='data')
      v-chip.chip--select-multi(:input-value='data.selected' close @input='removeRecipient(data.item)')
        v-avatar
          img(:src='data.item.avatar')
        | {{ data.item.username }}
    template(v-slot:item='data')
      v-list-item-avatar
        img(:src='data.item.avatar')
      v-list-item-content
        v-list-item-title {{ data.item.username }}
</template>
<script>
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: ["previous", "contacts"],
  data: function() {
    return {
      members: this.previous
    };
  },
  methods: {
    removeRecipient: function(user) {
      const index = this.members.findIndex(m => m.username === user.username);
      if (index >= 0) this.members.splice(index, 1);
    }
  }
})
export default class UserSelector extends Vue {}
</script>
<style lang="sass" scoped></style>
