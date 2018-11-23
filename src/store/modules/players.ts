import { Module, MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState } from "@/store";

export type PlayerStatus = "ready" | "unready";

export interface Player {
  name: string;
  status: PlayerStatus;
}

export interface PlayersState {
  current: Player;
  allInRoom: Player[];
}

// state
const initialState: PlayersState = {
  current: {
    name: "",
    status: "unready"
  },
  allInRoom: []
};

// getters
const getters: GetterTree<PlayersState, RootState> = {
  // allInRoom: state => {
  //   return [...state.allInRoom];
  // }
};

// actions
const actions: ActionTree<PlayersState, RootState> = {
  async getAllInRoomInfo({ commit }, ids) {
    return new Promise((resolve, reject) => {
      commit("setAllInRoom", [
        { name: "Player 1", status: "ready" },
        { name: "Player 2", status: "unready" },
        { name: "Player 3", status: "unready" },
        { name: "Player 4", status: "ready" }
      ]);
    });
  }
};

// mutations
const mutations: MutationTree<PlayersState> = {
  setCurrentName(state, payload) {
    sessionStorage.setItem("pepper-session-playerName", payload);
    state.current.name = payload;
  },
  setAllInRoom(state, payload) {
    state.allInRoom = payload;
  }
};

const player: Module<PlayersState, RootState> = {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};

export default player;
