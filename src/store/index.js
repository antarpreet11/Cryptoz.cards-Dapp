import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import { showSuccessToast } from "../util/showToast";
import cardStore from "./cardStore";
import cryptStore from "./cryptStore";
import eventStore from "./eventsStore";
import blockchainStore from "./blockChainStore";
import cardsetStore from "./cardsetStore";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state,
  mutations: {
    setDAppState(state, payload) {
      state.dAppState = payload;
    },
    setIsTransactionPending(state, payload) {
      state.isTransactionPending = payload;
    },
  },
  actions: {
    setDAppState({ commit }, payload) {
      commit("setDAppState", payload);
    },
    setIsTransactionPending({ commit }, payload) {
      commit("setIsTransactionPending", payload);
    },
  },
  modules: {
    cards: cardStore,
    crypt: cryptStore,
    events: eventStore,
    blockChain: blockchainStore,
    cardset: cardsetStore,
  },
});
