import Vue from "vue";
import * as Sentry from "@sentry/browser";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

Sentry.init({
  dsn: "https://be427c7158c94035a0e835e44cddcdf2@sentry.io/1325746",
  integrations: [new Sentry.Integrations.Vue({ Vue })]
});
