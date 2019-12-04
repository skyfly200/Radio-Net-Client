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

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :rules="passwordRules"
            required
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordShow ? 'text' : 'password'"
            @click:append="passwordShow = !passwordShow"
          ></v-text-field>

          <v-btn :disabled="!valid" color="success" @click="validate">Register</v-btn>

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
      return this.$store.getters.error;
    },
    status() {
      return this.$store.getters.status;
    },
    passwordsMatch() {
      return this.password === this.confirmPassword;
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
    confirmPassword: "",
    passwordRules: [v => !!v || "Password Required"]
  }),
  methods: {
    registerWithEmail() {
      const user = {
        email: this.email,
        password: this.password
      };
      // pass this.$route.params.redirect as a param to redirect to
      this.$store.dispatch("signUpAction", user).then(() => {
        let path = this.$route.query.redirect
          ? this.$route.query.redirect
          : "dashboard";
        this.$router.push(path);
      });
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (this.passwordsMatch) this.registerWithEmail();
        else this.alert = "passwords do not match";
      }
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
