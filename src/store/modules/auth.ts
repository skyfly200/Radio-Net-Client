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
  raw: object | null = null;
  user: User | null = new User();
  error: string | null = null;

  @Mutation
  setStatus(status: string | null) {
    this.status = status;
  }

  @Mutation
  setAuth(payload: any) {
    this.status = payload.status;
    this.raw = payload.user;
    this.error = payload.error;
  }

  @Action
  async signInAction(payload: { email: string; password: string }) {
    let t = this;
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        router.push("dashboard");
        t.context.commit("setAuth", {
          status: "success",
          user: response.user,
          error: null
        });
      })
      .catch(error => {
        t.context.commit("setAuth", {
          status: "failure",
          user: null,
          error: error.message
        });
      });
  }

  @Action
  async signOutAction() {
    this.context.commit("setStatus", "loading");
    let t = this;
    await firebase
      .auth()
      .signOut()
      .then(response => {
        router.push("login");
        t.context.commit("setAuth", {
          status: "success",
          user: null,
          error: null
        });
      })
      .catch(error => {
        t.context.commit("setAuth", {
          status: "failure",
          user: null,
          error: error.message
        });
      });
  }

  @Action
  async signUpAction(payload: { email: string; password: string }) {
    this.context.commit("setStatus", "loading");
    let t = this;
    firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        router.push("dashboard");
        t.context.commit("setAuth", {
          status: "success",
          user: response.user,
          error: null
        });
      })
      .catch(error => {
        t.context.commit("setAuth", {
          status: "failure",
          user: null,
          error: error.message
        });
      });
  }

  @Action({ rawError: true })
  async providerSignIn(p: string) {
    this.context.commit("setStatus", "loading");
    var provider;
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
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        if (result.user) {
          router.push("dashboard");
          t.context.commit("setAuth", {
            status: "success",
            user: result.user,
            error: null
          });
        } else {
          t.context.commit("setAuth", {
            status: "failure",
            user: null,
            error: ""
          });
        }
      })
      .catch(function(error: any) {
        return { status: "failure", user: null, error: error.message };
      });
  }

  get isLoggedIn() {
    return !!this.raw;
  }
  get getUser() {
    return this.raw;
  }
  get getStatus() {
    return this.status;
  }
  get getError() {
    return this.error;
  }
}
