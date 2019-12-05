import {
  Module,
  VuexModule,
  Mutation,
  MutationAction,
  Action
} from "vuex-module-decorators";

import router from "../../router";
import firebase from "firebase";
import { User } from "@/models/user";

@Module
export default class Auth extends VuexModule {
  status: string | null = null;
  token: string | null = null;
  provider: string | null = null;
  raw: object | null = null;
  user: User | null = null;
  error: string | null = null;

  @Mutation
  setStatus(status: string | null) {
    this.status = status;
  }

  @Mutation
  setProvider(provider: string | null) {
    this.provider = provider;
  }

  @Mutation
  setAuth(payload: any) {
    let raw = payload.user;
    this.status = payload.status;
    this.token = payload.token;
    this.raw = raw;
    this.user = raw
      ? new User({
          uid: raw.uid,
          name: raw.displayName,
          email: raw.email,
          phone: raw.phoneNumber,
          photoURL: raw.photoURL,
          providers: raw.providerData,
          active: raw.emailVerified
        })
      : null;
    this.error = payload.error;
  }

  @Action({ rawError: true })
  async signOutAction() {
    let t = this;
    t.context.commit("setAuth", {
      status: "success",
      token: null,
      user: null,
      error: null
    });
    await firebase
      .auth()
      .signOut()
      .then(response => {
        if (router.currentRoute.name !== "auth") router.push("auth");
      })
      .catch(error => {
        t.context.commit("setAuth", {
          status: "failure",
          token: null,
          user: null,
          error: error
        });
      });
  }

  @Action({ rawError: true })
  syncAuth() {
    let t = this;
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function(user: any) {
        if (user) {
          t.context.commit("setAuth", {
            status: "success",
            token: null,
            user: user,
            error: null
          });
          resolve(true);
        } else {
          t.context.commit("setAuth", {
            status: "success",
            token: null,
            user: null,
            error: null
          });
          resolve(false);
        }
      });
    });
  }

  @Action({ rawError: true })
  signUpAction(payload: { email: string; password: string; name: string }) {
    this.context.commit("setStatus", "loading");
    this.context.commit("setProvider", "email");
    let t = this;
    var db = firebase.firestore();
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          t.context.commit("setAuth", {
            status: "success",
            token: null,
            user: response.user,
            error: null
          });
          db.collection("users")
            .doc(response.user.uid)
            .update({
              name: payload.name
            })
            .catch(function(error) {
              console.error("Error updating name in firestore: ", error);
            });
          var user = firebase.auth().currentUser;
          user
            .updateProfile({ displayName: payload.name })
            .then(() => {
              resolve();
            })
            .catch(function(error) {
              console.error("Error updating name in user properties: ", error);
              resolve();
            });
        })
        .catch(error => {
          t.context.commit("setAuth", {
            status: "failure",
            token: null,
            user: null,
            error: error
          });
          reject(error);
        });
    });
  }

  @Action({ rawError: true })
  signInAction(payload: { email: string; password: string }) {
    this.context.commit("setStatus", "loading");
    this.context.commit("setProvider", "email");
    let t = this;
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          t.context.commit("setAuth", {
            status: "success",
            user: response.user,
            token: null,
            error: null
          });
          resolve();
        })
        .catch(error => {
          t.context.commit("setAuth", {
            status: "failure",
            user: null,
            token: null,
            error: error
          });
          reject(error);
        });
    });
  }

  @Action({ rawError: true })
  providerSignIn(p: string) {
    this.context.commit("setStatus", "loading");
    this.context.commit("setProvider", p);
    var provider: any;
    switch (p) {
      case "fb":
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case "go":
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case "gh":
        provider = new firebase.auth.GithubAuthProvider();
        break;
    }
    let t = this;
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          if (result.user) {
            t.context.commit("setAuth", {
              status: "success",
              user: result.user,
              token: result.credential ? result.credential.accessToken : null,
              error: null
            });
            resolve();
          } else {
            t.context.commit("setAuth", {
              status: "failure",
              token: null,
              user: null,
              error: ""
            });
            reject(null);
          }
        })
        .catch((error: any) => {
          t.context.commit("setAuth", {
            status: "failure",
            user: null,
            token: null,
            error: error
          });
          reject(error);
        });
    });
  }

  get isLoggedIn() {
    return !!this.raw;
  }
  get getUser() {
    return this.user;
  }
  get getUID() {
    return this.raw.uid;
  }
  get getStatus() {
    return this.status;
  }
  get getJoined() {
    let raw: any = this.raw;
    return raw ? raw.metadata.creationTime : null;
  }
  get getLastLogin() {
    let raw: any = this.raw;
    return raw ? raw.metadata.lastSignInTime : null;
  }
  get getError() {
    return this.error;
  }
}
