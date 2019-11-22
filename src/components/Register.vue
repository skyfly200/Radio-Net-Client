<template>
  <div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <v-form action="#" @submit.prevent="submit">
      <v-text-field
        label="Name"
        id="name"
        type="name"
        class="form-control"
        name="name"
        value
        required
        autofocus
        v-model="form.name"
      />
      <v-text-field
        label="Email"
        id="email"
        type="email"
        class="form-control"
        name="email"
        value
        required
        autofocus
        v-model="form.email"
      />
      <v-text-field
        label="Password"
        id="password"
        type="password"
        class="form-control"
        name="password"
        required
        v-model="form.password"
      />
      <v-btn tye="submit">Register</v-btn>
    </v-form>
    <v-divider class="my-4"/>
    <v-btn class="mx-2" @click="facebookRegister">
      <span>Sign Up with Facebook</span>
      <v-icon>mdi-facebook</v-icon>
    </v-btn>
    <v-btn class="mx-2" @click="googleRegister">
      <span>Sign Up with Google</span>
      <v-icon>mdi-google</v-icon>
    </v-btn>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    facebookRegister() {
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("user_birthday");
      firebase.auth().signInWithRedirect(provider);
    },
    googleRegister() {},
    submit() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.form.name
            })
            .then(() => {});
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  }
};
</script>
