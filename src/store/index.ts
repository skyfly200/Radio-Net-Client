import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    status: null,
    error: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },

    removeUser(state) {
      state.user = null;
    },

    setStatus(state, payload) {
      state.status = payload;
    },

    setError(state, payload) {
      state.error = payload;
    }
  },
  actions: {
    signUpAction({ commit }, payload) {
      commit("setStatus", "loading");
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          commit("setUser", response.user);
          commit("setStatus", "success");
          commit("setError", null);
          router.push("dashboard");
        })
        .catch(error => {
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    },

    googleSignIn({ commit }) {
      commit("setStatus", "loading");
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          if (result.user) {
            commit("setUser", result.user);
            commit("setStatus", "success");
            commit("setError", null);
            router.push("dashboard");
          } else {
            commit("setStatus", "failure");
          }
        })
        .catch(function(error) {
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // var email = error.email;
          // var credential = error.credential;
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    },

    facebookSignIn({ commit }) {
      commit("setStatus", "loading");
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          if (result.user) {
            commit("setUser", result.user);
            commit("setStatus", "success");
            commit("setError", null);
            router.push("dashboard");
          } else {
            commit("setStatus", "failure");
          }
        })
        .catch(function(error) {
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // var email = error.email;
          // var credential = error.credential;
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    },

    githubSignIn({ commit }) {
      commit("setStatus", "loading");
      var provider = new firebase.auth.GithubAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          if (result.user) {
            commit("setUser", result.user);
            commit("setStatus", "success");
            commit("setError", null);
            router.push("dashboard");
          } else {
            commit("setStatus", "failure");
          }
        })
        .catch(function(error) {
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // var email = error.email;
          // var credential = error.credential;
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    },

    signInAction({ commit }, payload) {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          commit("setUser", response.user);
          commit("setStatus", "success");
          commit("setError", null);
          router.push("dashboard");
        })
        .catch(error => {
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    },

    signOutAction({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(response => {
          commit("setUser", null);
          commit("setStatus", "success");
          commit("setError", null);
          router.push("login");
        })
        .catch(error => {
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    }
  },

  getters: {
    status(state) {
      return state.status;
    },

    user(state) {
      return state.user;
    },

    error(state) {
      return state.error;
    }
  }
});
