import Vue from "vue";
import * as Sentry from "@sentry/browser";

import App from "@/App.vue";
import router from "@/router";
import store, { db } from "@/store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch("setOnlinePlayersRef", db.collection("players"));
    this.$store.dispatch("rooms/setAllRef", db.collection("rooms"));
  }
}).$mount("#app");

Sentry.init({
  dsn: "https://be427c7158c94035a0e835e44cddcdf2@sentry.io/1325746",
  integrations: [new Sentry.Integrations.Vue({ Vue })]
});
