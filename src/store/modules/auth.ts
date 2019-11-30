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
  status: string | null = "";
  user: User | null = new User();
  error: string | null = "";

  @Mutation
  setStatus(status: string | null) {
    this.status = status;
  }

  @Mutation
  setAuth(payload: any) {
    this.status = payload.status;
    this.user = payload.user;
    this.error = payload.error;
  }

  @MutationAction({ mutate: ["status", "user", "error"] })
  async signInAction(payload: { email: string; password: string }) {
    firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        router.push("dashboard");
        return { status: "success", user: response.user, error: null };
      })
      .catch(error => {
        return { status: "failure", user: null, error: error.message };
      });
  }

  @MutationAction({ mutate: ["status", "user", "error"] })
  async signOutAction() {
    firebase
      .auth()
      .signOut()
      .then(response => {
        router.push("login");
        return { status: "success", user: null, error: null };
      })
      .catch(error => {
        return { status: "failure", user: null, error: error.message };
      });
  }

  @MutationAction({ mutate: ["status", "user", "error"] })
  async signUpAction(payload: { email: string; password: string }) {
    this.context.commit("setStatus", "loading");
    firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        router.push("dashboard");
        return { status: "success", user: response.user, error: null };
      })
      .catch(error => {
        return { status: "failure", user: null, error: error.message };
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
    return !!this.user;
  }
  get getUser() {
    return this.user;
  }
  get getStatus() {
    return this.status;
  }
  get getError() {
    return this.error;
  }
}
