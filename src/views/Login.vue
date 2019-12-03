<template>
  <v-container>
    <v-layout row wrap>
      <v-flex class="mx-5">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            required
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordShow ? 'text' : 'password'"
            @click:append="passwordShow = !passwordShow"
          ></v-text-field>

          <v-btn :disabled="!valid" color="success" @click="validate">Login</v-btn>

          <v-btn color="error" @click="reset">Reset Form</v-btn>
          <v-alert class="ma-4" v-if="alert" type="error">{{ alert }}</v-alert>
        </v-form>
        <div class="pt-6">
          <span>or</span>
        </div>
        <h3 class="ma-4">Sign in with</h3>
        <SocialLogin></SocialLogin>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";
import SocialLogin from "@/components/SocialLogin.vue";

export default {
  components: {
    SocialLogin
  },
  computed: {
    error() {
      return this.$store.getters.getUser;
    },
    status() {
      return this.$store.getters.status;
    }
  },
  data: () => ({
    passwordShow: false,
    valid: true,
    email: "",
    alert: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    passwordRules: [v => !!v || "Password is Required"]
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.loginWithFirebase();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    loginWithFirebase() {
      const user = {
        email: this.email,
        password: this.password
      };
      this.$store
        .dispatch("signInAction", user)
        .then(() => {
          let path = this.$route.query.redirect
            ? this.$route.query.redirect
            : "dashboard";
          this.$router.push(path);
        })
        .catch(error => {
          switch (error.code) {
            case "auth/user-not-found":
              this.alert = "No record matches that email.";
              break;
            case "auth/wrong-password":
              this.alert = "Incorect password provided.";
              break;
            case "auth/too-many-requests":
              this.alert = "Too many invalid attempts. Please try again later.";
              break;
            default:
              console.error(error);
          }
        });
    }
  }
};
</script>
