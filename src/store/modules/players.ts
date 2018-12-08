import { Module, MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState } from "@/store";
export interface Player {
  name: string;
}

export interface PlayersState {
  current: Player;
}

// state
const initialState: PlayersState = {
  current: {
    name: ""
  }
};

// getters
const getters: GetterTree<PlayersState, RootState> = {
  allInRoom: (state, _, rootState: any, rootGetters) => {
    return rootState.onlinePlayers.filter(
      (p: any) =>
        rootGetters["rooms/current"] &&
        rootGetters["rooms/current"].playerByIds.includes(p.id)
    );
  }
};

// actions
const actions: ActionTree<PlayersState, RootState> = {
  // async getAllInRoomInfo({ commit }, ids) {
  //   return new Promise((resolve, reject) => {
  //     commit("setAllInRoom", [
  //       { name: "Player 1", status: "ready" },
  //       { name: "Player 2", status: "unready" },
  //       { name: "Player 3", status: "unready" },
  //       { name: "Player 4", status: "ready" }
  //     ]);
  //   });
  // }
};

// mutations
const mutations: MutationTree<PlayersState> = {
  setCurrentName(state, payload) {
    sessionStorage.setItem("pepper-session-playerName", payload);
    state.current.name = payload;
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
