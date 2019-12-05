<template lang="pug">
v-dialog(v-model="toggle" max-width="1000").upload-dialog
  v-card
    v-card-title(class="headline") Upload files
    v-card-text
      input.file-input(type="file" accept="image/*,audio/*,video/*" ref="fileInput" :multiple="multi" @change="select")
      .uploader(v-if="noFiles")
        v-form.drop-zone(v-if="dragAndDropCapable" ref="dropZone" :class="{ dragging: dragging }")
          v-icon mdi-file
          p Drag and drop here
          span or
          br
          v-btn.browse-btn(@click="browse" color="primary") Browse Files
          h4 {{ sizeLimitMB }}MB size limit
        v-form.browse-only(v-else)
          v-btn.browse-btn(@click="browse" color="primary") Browse Files
          h4 {{ sizeLimitMB }}MB size limit
        v-alert(:value="error" type="error") {{ message }}
      .items-preview(v-else)
        .items
          .preview(v-for="(f, index) in files")
            v-img.image(:src="f.type.match('image/*') ? getObj(f.name) : ''" width="200px" v-bind:ref="'preview'+parseInt( index )")
              v-icon.pa-9(v-if="!f.type.match('image/*') || (uploadStatus[f.name] && uploadStatus[f.name].status === 'loading')" large) {{ icons[types.map(t => !!f.type.match(t)).indexOf(true)] }}
              v-overlay(:absolute="true" :value="uploadStatus[f.name] && (uploadStatus[f.name].status === 'uploading' || uploadStatus[f.name].status === 'done')")
                v-progress-circular(v-if="uploadStatus[f.name] && uploadStatus[f.name].status === 'uploading'" :value="uploadStatus[f.name].percent" rotate=-90 size=50 width=6)
                v-icon.ma-9(v-else large color="green") mdi-check
            h4.img-title {{ f.name }}
            .img-size {{ toMB(f.size).toFixed(2) }}MB
            v-btn.remove-btn(v-if="multi" small text @click="remove(index)")
              v-icon(small) mdi-close
              | remove
        v-btn(v-if="multi" @click="browse") Add
        v-btn(@click="clear") Clear
        v-alert(:value="error" type="error") {{ message }}
    v-card-actions
      v-spacer
      v-btn(@click="closeDialog") Close
      v-btn(:disabled="noFiles" @click="upload") Save
</template>
<script>
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component({
  props: ["toggle", "multi"],
  data: () => ({
    reader: new FileReader(),
    files: [],
    fileObjects: {},
    fileRefs: [],
    uploads: [],
    uploadStatus: {},
    dragAndDropCapable: false,
    dragging: false,
    uploading: false,
    types: ["image/*", "audio/*", "video/*"],
    icons: ["mdi-file-image", "mdi-file-music", "mdi-file-video", "mdi-file"],
    message: "",
    error: false,
    sizeLimitMB: 100 // in MB
  }),
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
  },
  updated() {
    // wait until the entire view has been rendered
    this.$nextTick(() => {
      if (this.dragAndDropCapable && this.$refs.dropZone) {
        this.register();
      }
    });
  },
  computed: {
    sizeLimit() {
      return this.sizeLimitMB * 1048576;
    },
    noFiles: function() {
      return this.files.length < 1;
    },
    uid: function() {
      return this.$store.getters.getUID;
    }
  },
  methods: {
    register: function() {
      // bind an event listener to all of the drag events
      ["drag", "dragstart"].forEach(
        function(evt) {
          this.$refs.dropZone.addEventListener(
            evt,
            function(e) {
              e.preventDefault();
              e.stopPropagation();
            }.bind(this),
            false
          );
        }.bind(this)
      );
      ["dragover", "dragenter"].forEach(
        function(evt) {
          this.$refs.dropZone.addEventListener(
            evt,
            function(e) {
              e.preventDefault();
              e.stopPropagation();
              this.dragging = true;
              e.dataTransfer.dropEffect = "copy";
            }.bind(this)
          );
        }.bind(this),
        false
      );
      ["dragleave", "dragend"].forEach(
        function(evt) {
          this.$refs.dropZone.addEventListener(
            evt,
            function(e) {
              e.preventDefault();
              e.stopPropagation();
              this.dragging = false;
            }.bind(this)
          );
        }.bind(this),
        false
      );
      this.$refs.dropZone.addEventListener(
        "drop",
        function(e) {
          if (this.dragging) {
            e.preventDefault();
            e.stopPropagation();
            this.dragging = false;
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
              this.load(e.dataTransfer.files[i]);
            }
          }
        }.bind(this)
      );
    },
    browse: function() {
      this.message = "";
      this.error = false;
      this.$refs.fileInput.click();
    },
    select: function(e) {
      var fileList = e.target.files;
      if (!this.multi) this.clear();
      for (var i = 0; i < fileList.length; i++) {
        this.load(fileList[i]);
      }
    },
    load: function(file) {
      if (!this.checkType(file)) {
        this.message = "Invalid File Type";
        this.error = true;
      } else if (!this.checkSize(file)) {
        this.message = "Oversized File";
        this.error = true;
      } else {
        this.files.push(file);
        this.$set(this.uploadStatus, file.name, { status: "loading" });
        this.show(file);
      }
    },
    show: function(file) {
      var reader = new FileReader();
      // Register file reader events
      reader.onload = (cb => {
        return e => {
          cb(e.target.result);
        };
      })(result => {
        this.fileObjects[file.name] = result;
        this.uploadStatus[file.name] = { status: "loaded" };
      });
      reader.onerror = (cb => {
        return e => {
          cb(e.target.error);
        };
      })(error => {
        this.message = error;
        this.error = true;
      });
      // Call reader with file
      reader.readAsDataURL(file);
    },
    remove: function(key) {
      this.files.splice(key, 1);
    },
    toMB: function(bytes) {
      return bytes / 1048576.0;
    },
    getObj(name) {
      return this.fileObjects[name];
    },
    determineDragAndDropCapable() {
      var div = document.createElement("div");
      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },
    checkType: function(file) {
      return (
        !!file.type &&
        this.types.reduce((acc, type) => acc || file.type.match(type))
      );
    },
    checkSize: function(file) {
      return !!file.size && file.size <= this.sizeLimit;
    },
    clear: function() {
      this.uploadStatus = {};
      this.fileObjects = {};
      this.fileUrls = [];
      this.files = [];
      this.uploading = false;
      this.error = false;
      this.message = "";
    },
    upload: function() {
      // upload selected files and show progress
      this.uploading = true;
      this.error = false;
      this.message = "";

      this.files.forEach((file, index) => {
        // TO-DO upload each fle one by one and show individual loaders on each file preview
        let name = file.name;
        this.uploadStatus[name] = {
          percent: 0,
          status: "uploading"
        };
        var path = "content/" + name;
        var storage = firebase.storage();
        var imageRef = storage.ref().child(path);

        var uploadTask = imageRef.put(file);
        this.uploads.push(uploadTask);

        uploadTask.on(
          "state_changed",
          function(snapshot) {
            this.uploadStatus[snapshot.ref.name].percent =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                this.message = "Upload is paused";
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                this.message = "Upload is running";
                break;
            }
          }.bind(this),
          function(error) {
            // Display upload Error message
            this.uploadStatus[name].status = "error";
            this.message = error;
            this.error = true;
          }.bind(this),
          function() {
            this.uploadStatus[name].status = "done";
            this.fileRefs.push({
              path: uploadTask.snapshot.ref.fullPath,
              type: file.type,
              size: file.size
            });
          }.bind(this)
        );
      });

      Promise.all(this.uploads).then(
        function() {
          this.$emit("done", this.fileRefs);
          this.clear();
        }.bind(this)
      );
    },
    closeDialog: function() {
      this.$emit("close");
      this.clear();
    }
  }
})
export default class Upload extends Vue {}
</script>
<style lang="sass">
.upload
  display: flex
  justify-content: center
  flex-direction: column
  h3
    text-align: center
    margin: 10px
.drop-zone
  border: 2px dashed #bbb
  border-radius: 5px
  padding: 25px
  text-align: center
  color: #bbb
.dragging
  background-color: grey
.browse-only
  text-align: center
.file-input
  display: none
.browse-btn
  margin: 1.5em auto
.v-alert
  width: 100%
.items
  display: flex
  flex-wrap: wrap
  justify-content: flex-start
  .preview
    padding: 10px
    border: 1px solid #ddd
    .image
      width: 100px
    .remove-btn, .v-btn
      color: red
      margin: auto
progress
  width: 400px
  margin: auto
  display: block
  margin-top: 20px
  margin-bottom: 20px
</style>
