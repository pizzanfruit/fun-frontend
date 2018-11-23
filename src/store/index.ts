import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";

import { DEFAULT_MAX_PLAYERS } from "@/config";
import players, { PlayersState } from "./modules/players";
import rooms, { RoomsState } from "./modules/rooms";
import Player from "@/models/player";

Vue.use(Vuex);

export interface RootState {
  DEFAULT_MAX_PLAYERS: number;
  onlinePlayers: Player[];
  rooms?: RoomsState;
  players?: PlayersState;
}

const store: StoreOptions<RootState> = {
  state: {
    DEFAULT_MAX_PLAYERS,
    onlinePlayers: [
      new Player("1", "Long"),
      new Player("2", "Son"),
      new Player("3", "Duc"),
      new Player("4", "Pepperoni Papaya"),
      new Player("5", "Quy"),
      new Player("6", "Manh"),
      new Player(),
      new Player(),
      new Player(),
      new Player()
    ]
  },
  modules: { players, rooms },
  mutations: {},
  actions: {},
  getters: {}
};

export default new Vuex.Store<RootState>(store);
