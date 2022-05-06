import { NETWORK_NAMES } from "../util/constants/networks";

const DEFAULT_NETWORK_STATE = {
  network: NETWORK_NAMES.MOONBASE,
};

export const NETWORK_MUTATIONS = {
  SET_NETWORK: "SET_NETWORK",
};

const networkStore = {
  namespaced: true,
  state: DEFAULT_NETWORK_STATE,
  mutations: {
    [NETWORK_MUTATIONS.SET_NETWORK](state, payload) {
      state.network = payload.network;
    },
  },
  actions: {
    setNetwork({ commit }, payload) {
      commit(NETWORK_MUTATIONS.SET_NETWORK, {
        network: payload,
      });
    },
  },
  getters: {
    getNetwork: (state) => state.network,
  },
};

export default networkStore;
