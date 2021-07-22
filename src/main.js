import Vue from "vue";
import App from "./App.vue";
import store from "./store";
// import firebaseDb from "./firebase"

Vue.config.productionTip = false;

new Vue({
  store,
  // firebaseDb,
  render: (h) => h(App),
}).$mount("#app");
