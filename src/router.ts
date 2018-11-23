import Vue from "vue";
import Router from "vue-router";

import store from "@/store";

Vue.use(Router);

function lazyRoute(path: string, name: string, view: string) {
  return {
    path,
    name,
    component: () => import(`./views/${view}.vue`)
  };
}

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: to => {
        return "/setup";
      }
    },
    lazyRoute("/setup", "setup", "Setup"),
    lazyRoute("/rooms", "rooms", "Rooms"),
    lazyRoute("/rooms/create", "create-room", "CreateRoom"),
    lazyRoute("/rooms/:id", "room", "Room")
  ]
});

// User has to setup before playing
router.beforeEach((to, from, next) => {
  if (to.path !== "/setup") {
    // not logged in
    if (!store.state.players || !store.state.players.current.name) {
      const playerName = sessionStorage.getItem("pepper-session-playerName");
      if (!playerName) {
        next("/setup");
      } else {
        store.commit("players/setCurrentName", playerName);
        next();
      }
    } else {
      next();
    }
  } else {
    // to /setup but already logged in
    if (store.state.players && store.state.players.current.name) {
      next("/rooms");
    } else {
      next();
    }
  }
});

export default router;
