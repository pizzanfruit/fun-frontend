import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import Vuex, { StoreOptions } from "vuex";
import { firebaseMutations, firebaseAction } from "vuexfire";

import { DEFAULT_MAX_PLAYERS, PROJECT_ID } from "@/config";
import players, { PlayersState } from "./modules/players";
import rooms, { RoomsState } from "./modules/rooms";
import Player from "@/models/player";

firebase.initializeApp({
  apiKey: "AIzaSyCZkf74YzoEd0177IhFAs13gDnOj3LDJt0",
  authDomain: "fpt-building.firebaseapp.com",
  projectId: PROJECT_ID
});

export const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

Vue.use(Vuex);

export interface RootState {
  showGlobalLoading: boolean;
  DEFAULT_MAX_PLAYERS: number;
  socket?: WebSocket;
  onlinePlayers: Player[];
  rooms?: RoomsState;
  players?: PlayersState;
}

const setOnlinePlayersRef = firebaseAction(
  ({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
    bindFirebaseRef("onlinePlayers", ref);
  }
);

const store: StoreOptions<RootState> = {
  state: {
    showGlobalLoading: false,
    DEFAULT_MAX_PLAYERS,
    socket: undefined,
    onlinePlayers: []
  },
  modules: { players, rooms },
  mutations: {
    setSocket(state, socket: WebSocket) {
      state.socket = socket;
    },
    setGlobalLoading(state, payload: boolean) {
      state.showGlobalLoading = payload;
    },
    ...firebaseMutations
  },
  actions: {
    setOnlinePlayersRef
  },
  getters: {}
};

export default new Vuex.Store<RootState>(store);
