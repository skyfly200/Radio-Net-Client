<template>
  <div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <v-form action="#" @submit.prevent="submit">
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
      <v-btn type="submit">Login</v-btn>
    </v-form>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    submit() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          this.$router.replace({ name: "Dashboard" });
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  }
};
</script>
