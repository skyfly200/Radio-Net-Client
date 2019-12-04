<template>
  <v-container>
    <v-layout row wrap>
      <v-flex class="mx-5">
        <v-form v-if="register" ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="name" label="Display Name" required></v-text-field>
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

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :rules="[passwordRules[0], passwordsMatch]"
            required
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordShow ? 'text' : 'password'"
            @click:append="passwordShow = !passwordShow"
          ></v-text-field>

          <v-btn :disabled="!valid" color="success" @click="validate">Register</v-btn>
          <v-btn color="error" @click="reset">Reset Form</v-btn>
          <v-alert class="ma-4" v-if="alert" type="error">{{ alert }}</v-alert>
          <p class="mt-4">Already have an account?</p>
          <v-btn color="info" @click="register = false">Login</v-btn>
        </v-form>
        <v-form v-else ref="form" v-model="valid" lazy-validation>
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
          <p class="mt-4">Dont have an account yet?</p>
          <v-btn color="info" @click="register = true">Register</v-btn>
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
    },
    passwordsMatch() {
      return () =>
        this.password === this.confirmPassword || "Passwords must match";
    }
  },
  data: () => ({
    register: false,
    passwordShow: false,
    valid: true,
    alert: "",
    name: "",
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    confirmPassword: "",
    passwordRules: [v => !!v || "Password is Required"]
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) this.login();
    },
    reset() {
      this.$refs.form.reset();
    },
    login() {
      const user = {
        email: this.email,
        password: this.password
      };
      if (this.register) user.name = this.name;
      let action = this.register ? "signUpAction" : "signInAction";
      this.$store
        .dispatch(action, user)
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
            case "auth/weak-password":
              this.alert = "Too weak of a password.";
              break;
            case "auth/invalid-email":
              this.alert = "Invalid email address.";
              break;
            case "auth/email-already-in-use":
              this.alert =
                "The email address is already in use by another account.";
              break;
            default:
              this.alert = error.message;
              console.error(error);
          }
        });
    }
  }
};
</script>
