import { Module, MutationTree, GetterTree, ActionTree } from "vuex";
import { RootState } from "@/store";
import { firebaseAction } from "vuexfire";

import { db } from "@/store";

export interface Room {
  id?: string;
  statusCode?: number;
  playerByIds?: number[];
  name: string;
  maxPlayers: number;
  type: string;
}

export interface RoomsState {
  all: Room[];
  currentId?: string;
  currentChat?: any;
}

// state
const initialState: RoomsState = {
  all: [],
  currentId: undefined,
  currentChat: {
    messages: []
  }
};

// getters
const getters: GetterTree<RoomsState, RootState> = {
  current: state => {
    return state.all.find(room => room.id === state.currentId);
  }
};

const setAllRef = firebaseAction(
  ({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
    bindFirebaseRef("all", ref);
  }
);

const setCurrentChatRef = firebaseAction(
  ({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
    bindFirebaseRef("currentChat", ref);
  }
);

// actions
const actions: ActionTree<RoomsState, RootState> = {
  setAllRef,
  setCurrentChatRef,
  setCurrentChat({ state, commit, dispatch }) {
    dispatch("setCurrentChatRef", db.collection("chats").doc(state.currentId));
  }
  // async createAsync({ commit }, room) {
  //   return new Promise((resolve, reject) => {
  //     const dummyId = "8";
  //     const dummyStatusCode = 0;
  //     const dummyplayerByIds = [1];
  //     commit("addNew", {
  //       ...room,
  //       id: dummyId,
  //       statusCode: dummyStatusCode,
  //       playerByIds: dummyplayerByIds
  //     });
  //     resolve(dummyId);
  //   });
  // }
};

// mutations
const mutations: MutationTree<RoomsState> = {
  addNew(state, payload) {
    state.all.push(payload);
  },
  setCurrentId(state, payload) {
    state.currentId = payload;
  },
  appendChat(state, payload) {
    if (!state.currentChat) {
      state.currentChat = {
        messages: []
      };
    }
    state.currentChat.messages.push(payload);
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
