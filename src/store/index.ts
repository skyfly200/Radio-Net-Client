import Vue from "vue";
import Vuex from "vuex";

import Chat from "./modules/chat";
import Auth from "./modules/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    chat: Chat,
    auth: Auth
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {}
});
