const DEFAULT_EVENT_STATE = {
  events: [],
};

export const EVENT_MUTATIONS = {
  ADD_EVENTS: "ADD_EVENTS",
  CLEAR_EVENTS: "CLEAR_EVENTS",
};

const eventStore = {
  namespaced: true,
  state: DEFAULT_EVENT_STATE,
  mutations: {
    [EVENT_MUTATIONS.CLEAR_EVENTS](state) {
      state.events = [];
    },
    [EVENT_MUTATIONS.ADD_EVENTS](state, payload) {
      state.events = [payload, ...state.events];
    },
  },
  actions: {
    addEvents({ commit, state }, payload) {
      commit(EVENT_MUTATIONS.ADD_EVENTS, payload);
    },
    clearEvents({ commit }) {
      commit(EVENT_MUTATIONS.CLEAR_EVENTS);
    },
  },
  getters: {
    getEventCount: (state) => {
      return state.events.length;
    },
    getEvents: (state) => {
      return state.events;
    },
  },
};

export default eventStore;
