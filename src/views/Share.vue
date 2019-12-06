<template lang="pug">
  .content
    Upload(:multi="true" @close="fileDialog = false" @done="setFiles($event)" :toggle="fileDialog")
    h1 Upload Content
    v-stepper(v-model="step")
      v-stepper-header
        v-stepper-step(:complete="step > 1" step="1") Upload
        v-stepper-step(:complete="step > 2" step="2") Info
        v-stepper-step(:complete="step > 3" step="3") Verify
        v-stepper-step(:complete="step === 4" step="4") Done
      v-stepper-items
        v-stepper-content(step="1").ma-5
          h3 Select files to Upload
          p Image, audio and video files supported
          v-btn(@click="fileDialog = true").ma-5
            v-icon mdi-upload
            | Select Files
        v-stepper-content(step="2")
          v-form(v-model="valid" ref="info")
            v-text-field(v-for="(field,i) in fields" :label="field.label" :required="field.required" v-model="fields[i].value")
            v-btn(:disabled="!valid" @click="verifyInfo").ma-5 Next
        v-stepper-content(step="3")
          h3 Verify and Submit
          h4(v-for="field in fields") {{field.label}}: {{field.value}}
          v-btn(@click="setInfo").ma-5 Submit
        v-stepper-content(step="4")
          h2 Content Submited
          h4 add a content preview here
          br
          v-divider
          br
          v-btn(@click="reset").ma-5 Upload More Content
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase";

import Upload from "@/components/Upload.vue";

export default Vue.extend({
  components: { Upload },
  data: () => ({
    fileDialog: false,
    valid: true,
    step: 1,
    files: [],
    fields: [
      { label: "Title", type: "text", required: true, value: "" },
      { label: "Description", type: "text", required: true, value: "" },
      { label: "Collection", type: "text", value: "" }
    ]
  }),
  methods: {
    setFiles(files: Array<any>) {
      this.fileDialog = false;
      this.files = files;
      this.step = 2;
    },
    verifyInfo() {
      this.$refs.info.validate();
      this.step = 3;
    },
    setInfo() {
      // add entry in firestore for content info with url and ref to file
      var info = {};
      this.fields.forEach(v => {
        info[v.label] = v.value;
      });
      var data: Object = {
        files: this.files,
        info: info,
        username: this.$store.getters.getUser.name,
        uid: this.$store.getters.getUID,
        timestamp: new Date()
      };
      var db = firebase.firestore();
      db.collection("uploads")
        .add(data)
        .then(
          function() {
            this.step = 4;
          }.bind(this)
        )
        .catch(() => {});
    },
    reset() {
      this.files = [];
      this.fields = [
        { label: "Title", type: "text", required: true, value: "" },
        { label: "Description", type: "text", required: true, value: "" },
        { label: "Collection", type: "text", value: "" }
      ];
      this.step = 1;
    }
  }
});
</script>

<style lang="sass" scoped></style>
