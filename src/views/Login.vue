<template>
  <v-container>
    <v-layout row wrap>
      <v-flex class="mx-5">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            required
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordShow ? 'text' : 'password'"
             @click:append="passwordShow = !passwordShow"
          ></v-text-field>

          <v-btn
            :disabled="!valid"
            color="success"
            @click="validate"
          >
            Login
          </v-btn>

          <v-btn
            color="error"
            @click="reset"
          >
            Reset Form
          </v-btn>
          <v-alert class="ma-4" v-if="error !== ''" type="error">
            {{ error }}
          </v-alert>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase'
export default {
  data: () => ({
    passwordShow: false,
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is Required'
    ],
    error: ''
  }),
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.error = ''
        this.snackbar = true
        this.loginWithFirebase()
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    loginWithFirebase () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
          this.error = error.message
        })
    }
  }
}
</script>