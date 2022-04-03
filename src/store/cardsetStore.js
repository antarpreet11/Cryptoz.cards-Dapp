import { getCardSets, queryMintedTypes } from "../util/cardUtil";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_STATE = {
  cardSets: null,
  filters: [],
};

export const CARDSET_MUTATIONS = {
  FETCH_CARDSETS: "FETCH_CARDSETS",
  APPLY_FILTERS: "APPLY_FILTERS",
  REMOVE_FILTERS: "REMOVE_FILTERS",
};

export const CardsetFilters = {
  notOwned: "not-owned",
  owned: "owned",
  neverMinted: "neverMinted",
};

const filterCardsOfSet = (cards, filter) => {
  if (filter.length === 0) return cards;

  return cards.filter((card) => {
    if (filter.includes(CardsetFilters.owned) && card.isOwned) {
      return true;
    }

    if (
      filter.includes(CardsetFilters.notOwned) &&
      !card.isOwned &&
      card.isMinted
    ) {
      return true;
    }

    if (
      filter.includes(CardsetFilters.neverMinted) &&
      !card.isMinted &&
      !card.isOwned
    ) {
      return true;
    }

    return false;
  });
};

const filterCardset = (cardset, filter) => {
  const filteredCardset = {
    cardSetName: cardset.cardSetName,
    id: cardset.id,
  };

  const filteredCards = filterCardsOfSet(cardset.cards, filter);

  return {
    ...filteredCardset,
    cards: filteredCards,
  };
};

const cardsetStore = {
  namespaced: true,
  state: DEFAULT_STATE,
  mutations: {
    [CARDSET_MUTATIONS.FETCH_CARDSETS](state, payload) {
      state.cardSets = payload;
    },
    [CARDSET_MUTATIONS.APPLY_FILTERS](state, payload) {
      state.filters.push(payload);
    },
    [CARDSET_MUTATIONS.REMOVE_FILTERS](state, payload) {
      const elementIndex = state.filters.indexOf(payload);
      if (elementIndex > -1) {
        state.filters.splice(elementIndex, 1);
      }
    },
  },
  actions: {
    async fetchAllCardSets({ commit, rootState }, payload) {
      const mintedTypes = await queryMintedTypes();

      const cardSets = await getCardSets();

      const transformedCardSets = Object.keys(cardSets).map((key) => {
        const cards = cardSets[key].sort((a, b) => {
          if (parseInt(a.rarity) < parseInt(b.rarity)) {
            return -1;
          } else if (parseInt(a.rarity) > parseInt(b.rarity)) {
            return 1;
          }

          return 0;
        });

        // add on the type is minted property
        const cardsWithMinted = cards.map((card) => {
          const isCardMinted =
            mintedTypes.filter((type) => type.id === card.id).length > 0;
          const ownedCards = rootState.crypt.allCryptCards;

          const isCardOwned =
            ownedCards.filter((ownedCard) => card.id === ownedCard.type_id)
              .length > 0;

          return {
            ...card,
            isMinted: isCardMinted,
            isOwned: isCardOwned,
          };
        });

        const cardSetName = key;
        return {
          cardSetName,
          cards: cardsWithMinted,
          id: uuidv4(),
        };
      });

      const sortedCardset = transformedCardSets.sort((a, b) => {
        if (a.cardSetName < b.cardSetName) {
          return -1;
        } else if (a.cardSetName > b.cardSetName) {
          return 1;
        }

        return 0;
      });

      commit(CARDSET_MUTATIONS.FETCH_CARDSETS, sortedCardset);
    },
    setFilter({ commit }, payload) {
      commit(CARDSET_MUTATIONS.APPLY_FILTERS, payload);
    },
    removeFilter({ commit }, payload) {
      commit(CARDSET_MUTATIONS.REMOVE_FILTERS, payload);
    },
  },
  getters: {
    getFilteredCardsets: (state) => {
      if (state.filters.length === 0) return state.cardSets;

      const filteredCardsets = [];
      state.cardSets.forEach((cardset) => {
        const filteredCardset = filterCardset(cardset, state.filters);

        filteredCardsets.push(filteredCardset);
      });

      return filteredCardsets;
    },
    getFilteredCardsetByIndex: (state) => (index) => {
      if (index !== null) {
        return state.cardSets[index];
      }

      return [];
    },
    getAllCardsets: (state) => state.cardSets,
    isCardsetLoaded: (state) => state.cardSets && state.cardSets.length > 0,
  },
};

export default cardsetStore;
