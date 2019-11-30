import {
  Module,
  VuexModule,
  Mutation,
  MutationAction,
  Action
} from "vuex-module-decorators";

import { User } from "@/models/user";

@Module
export default class Auth extends VuexModule {
  status: string = "";
  token: string = localStorage.getItem("token") || "";
  user: User = new User();

  @MutationAction({ mutate: ["status", "token", "user"] })
  async load_session() {
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    if (user != null) user = JSON.parse(user);
    return { status: "success", token: token, user: user };
  }
  @MutationAction({ mutate: ["status", "token", "user"] }) async login(
    data: object
  ) {
    try {
      const response: any = {};
      if (response.data.auth) {
        const token = response.data.token;
        const user = response.data.user;
        // MUST be changed to store JWT in cookie for security!!!
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return { status: "success", token: token, user: user };
      } else {
        return { status: "failed", token: "", user: {} };
      }
    } catch (error) {
      console.error("error", error);
      return { status: "error", token: true, user: {} };
    }
  }
  @MutationAction({ mutate: ["status", "token", "user"] }) async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { status: "", token: "", user: {} };
  }

  @Action register(data: object) {
    return;
  }

  get isLoggedIn() {
    return !!this.token;
  }
  get authStatus() {
    return this.status;
  }
  get getUser() {
    return this.user;
  }
}
