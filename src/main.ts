import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import * as firebase from "firebase";

Vue.config.productionTip = false;

const configOptions = {
  apiKey: "AIzaSyCAvVOwSbFv8kpzNZ-HudoLmQcvNw6rmWg",
  authDomain: "community-radio-network.firebaseapp.com",
  databaseURL: "https://community-radio-network.firebaseio.com",
  projectId: "community-radio-network",
  storageBucket: "community-radio-network.appspot.com",
  messagingSenderId: "358483205735",
  appId: "1:358483205735:web:fda760a487ef48a31e3ec2",
  measurementId: "G-59F4W77BGH"
};

firebase.initializeApp(configOptions);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
