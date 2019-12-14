<template lang="pug">
  v-img(:src="src" :width="width" :height="height")
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase";

export default Vue.extend({
  props: ["path", "width", "height"],
  data: () => ({
    src: ""
  }),
  mounted() {
    this.loadImg(this.path)
      .then(
        function(url: string) {
          this.src = url;
        }.bind(this)
      )
      .catch(function(error) {
        console.error(error);
      });
  },
  methods: {
    loadImg(path: string) {
      return firebase
        .storage()
        .ref()
        .child(path)
        .getDownloadURL();
    }
  }
});
</script>

<style lang="sass" scoped>

</style>