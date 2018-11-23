import { Module, MutationTree, GetterTree, ActionTree } from "vuex";
import { RootState } from "@/store";

interface Room {
  id: string;
  name: string;
  statusCode: number;
  playersById?: number[];
}

export interface RoomsState {
  all: Room[];
}

// state
const initialState: RoomsState = {
  all: [
    {
      id: "1",
      name: "Room 1",
      statusCode: 0,
      playersById: [1, 3]
    },
    {
      id: "2",
      name: "Room 2",
      statusCode: 1,
      playersById: [1, 2, 3]
    },
    {
      id: "3",
      name: "Room 3",
      statusCode: 2,
      playersById: [1, 2, 3]
    },
    {
      id: "4",
      name: "Room 4",
      statusCode: 0,
      playersById: [1, 2, 3, 4]
    },
    {
      id: "5",
      name: "Room 5",
      statusCode: 0,
      playersById: [1, 2, 3]
    },
    {
      id: "6",
      name: "Room 6",
      statusCode: 1,
      playersById: [1, 2, 3]
    },
    {
      id: "7",
      name: "Room 7",
      statusCode: 2,
      playersById: [1, 2, 3]
    }
  ]
};

// getters
const getters: GetterTree<RoomsState, RootState> = {
  getById: state => (id: string) => {
    return state.all.find(room => room.id === id);
  }
};

// actions
const actions: ActionTree<RoomsState, RootState> = {
  async createAsync({ commit }, room) {
    return new Promise((resolve, reject) => {
      const dummyId = "8";
      const dummyStatusCode = 0;
      const dummyPlayersById = [1];
      commit("addNew", {
        ...room,
        id: dummyId,
        statusCode: dummyStatusCode,
        playersById: dummyPlayersById
      });
      resolve(dummyId);
    });
  }
};

// mutations
const mutations: MutationTree<RoomsState> = {
  addNew(state, payload) {
    state.all.push(payload);
  }
};

const player: Module<RoomsState, RootState> = {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};

export default player;
