import { isCardOwned, getCard, getCardType } from "../util/cardUtil";
import { dynamicSort, getRarity, soldOutSort } from "../helpers";

const typeIdsOnChain = [];

//push 2021
typeIdsOnChain.push(
  1,
  6,
  8,
  11,
  14,
  32,
  36,
  40,
  44,
  47,
  52,
  55,
  59,
  61,
  65,
  71,
  74,
  76,
  77,
  84,
  87,
  89,
  112,
  113,
  114,
  115
);
typeIdsOnChain.push(146, 147, 148, 149, 150, 151, 152, 153, 154, 155);
typeIdsOnChain.push(202, 203, 204, 205, 206);
typeIdsOnChain.push(217, 218, 219, 220, 221, 222, 223, 224);
typeIdsOnChain.push(259, 263, 269, 270, 271, 272, 273);
typeIdsOnChain.push(285, 287, 288, 289, 290, 291, 292, 293, 294, 295);
typeIdsOnChain.push(
  307,
  308,
  309,
  310,
  311,
  312,
  313,
  314,
  315,
  316,
  317,
  318,
  319,
  320,
  321,
  322,
  323,
  324
);
typeIdsOnChain.push(330, 332, 333, 334, 335, 348, 349, 350, 351, 352, 353);
typeIdsOnChain.push(
  366,
  367,
  368,
  369,
  370,
  371,
  372,
  373,
  374,
  375,
  376,
  377,
  378,
  379,
  380,
  381
);
typeIdsOnChain.push(410, 412, 413, 415, 418, 419, 421, 422, 423, 424, 425, 428);
typeIdsOnChain.push(429, 430, 431, 432, 433, 434, 435, 436, 437, 438);
typeIdsOnChain.push(439, 440, 441, 442, 444, 445);
typeIdsOnChain.push(450, 451, 452, 453, 454, 455, 459, 461, 462, 463);
typeIdsOnChain.push(473, 475, 476, 477, 483, 484, 489, 497);
typeIdsOnChain.push(498, 499, 504, 505, 508, 509, 510, 515, 516, 521, 522, 523);
typeIdsOnChain.push(525, 526, 527, 528, 530);
//typeIdsOnChain.push(545, 546, 547, 548, 549, 550);

const DEFAULT_CARD_STATE = {
  allShopCards: [],
  sortedCards: [],
  isLoadingShop: false,
  failedToLoadShop: false,
  shopLoaded: false,
};

export const CARD_MUTATIONS = {
  SET_SHOP_CARDS: "SET_SHOP_CARDS",
  LOADING_SHOP_CARDS: "LOADING_SHOP_CARDS",
  LOADING_SHOP_CARDS_FAILED: "LOADING_SHOP_CARDS_FAILED",
  SET_SORTED_CARDS: "SET_SORTED_CARDS",
  SET_CARD_BOUGHT: "SET_CARD_BOUGHT",
  SET_CARD_NOT_BOUGHT: "SET_CARD_NOT_BOUGHT",
  SET_CARD_EDITION: "SET_CARD_EDITION",
  CLEAR_STORE_CARDS: "CLEAR_STORE_CARDS",
};

const cardStore = {
  state: DEFAULT_CARD_STATE,
  mutations: {
    [CARD_MUTATIONS.CLEAR_STORE_CARDS](state) {
      state = DEFAULT_CARD_STATE;
    },
    [CARD_MUTATIONS.SET_CARD_EDITION](state, payload) {
      const { cardId, edition, isSorted } = payload;

      if (isSorted) {
        const sortedIndex = state.sortedCards.findIndex(
          (card) => card.id === cardId
        );
        state.sortedCards[sortedIndex].edition_current = edition;
      }

      const index = state.allShopCards.findIndex((card) => card.id === cardId);
      state.allShopCards[index].edition_current = edition;
    },
    [CARD_MUTATIONS.SET_CARD_BOUGHT](state, payload) {
      const { cardId, isSorted } = payload;
      const parsedCardId = parseInt(cardId);

      if (isSorted) {
        const cardSortedIndex = state.sortedCards.findIndex(
          (card) => card.id === parsedCardId
        );
        state.sortedCards[cardSortedIndex].isOwned = true;
      } else {
        const cardBoughtIndex = state.allShopCards.findIndex(
          (card) => card.id === parsedCardId
        );
        state.allShopCards[cardBoughtIndex].isOwned = true;
      }
    },
    [CARD_MUTATIONS.SET_CARD_NOT_BOUGHT](state, payload) {
      const { cardId, isSorted } = payload;
      const parsedCardId = parseInt(cardId);

      if (isSorted) {
        const cardSortedIndex = state.sortedCards.findIndex(
          (card) => card.id === parsedCardId
        );
        state.sortedCards[cardSortedIndex].isOwned = false;
      } else {
        const cardBoughtIndex = state.allShopCards.findIndex(
          (card) => card.id === parsedCardId
        );
        state.allShopCards[cardBoughtIndex].isOwned = false;
      }
    },
    /**
     * @param {DEFAULT_CARD_STATE} state
     * @param {Array<card>} payload
     *
     */
    [CARD_MUTATIONS.SET_SHOP_CARDS](state, payload) {
      state.allShopCards = [...payload].sort(soldOutSort);
      state.shopLoaded = true;
      state.isLoadingShop = false;
      state.failedToLoadShop = false;
    },
    [CARD_MUTATIONS.LOADING_SHOP_CARDS](state) {
      state.isLoadingShop = true;
      state.shopLoaded = false;
    },
    [CARD_MUTATIONS.LOADING_SHOP_CARDS_FAILED](state) {
      state.failedToLoadShop = true;
      state.shopLoaded = false;
    },
    [CARD_MUTATIONS.SET_SORTED_CARDS](state, payload) {
      const { allShopCards, sortParam } = payload;
      const shopCards = [...allShopCards];

      switch (sortParam.param) {
        case "edition_number":
          shopCards.sort(
            dynamicSort("edition_current", sortParam.isDescending, false)
          );
          break;
        case "rarity":
          shopCards.sort(
            dynamicSort(
              sortParam.param,
              sortParam.isDescending,
              true,
              getRarity
            )
          );
          break;
        default:
          shopCards.sort(dynamicSort(sortParam.param, sortParam.isDescending));
          break;
      }

      state.sortedCards = shopCards;
    },
    updateMintedCountForCard(state, payload) {
      const { cardTypeId, editionNumber } = payload;

      const cardIndex = state.allShopCards.findIndex(
        (card) => card.type_id === cardTypeId
      );
      if (cardIndex > -1) {
        state.allShopCards[cardIndex].edition_current = editionNumber;
      }

      if (state.sortedCards.length > 0) {
        const sortedIndex = state.sortedCards.findIndex(
          (card) => card.type_id === cardTypeId
        );
        state.sortedCards[sortedIndex].edition_current = editionNumber;
      }
    },
  },
  actions: {
    async setCurrentEdition({ commit, rootState }, payload) {
      try {
        const CryptozInstance =
          rootState.blockChain.contracts.readOnlyZoombiesContract;

        const { cardId, edition, isSorted } = payload;
        const parsedId = parseInt(cardId);

        commit(CARD_MUTATIONS.SET_CARD_EDITION, {
          cardId: parsedId,
          edition,
          isSorted,
        });
      } catch (err) {
        console.error(err);
      }
    },
    async fetchStoreCards({ commit, rootState }) {
      try {
        commit(CARD_MUTATIONS.LOADING_SHOP_CARDS);

        console.log("typeIdsOnChain:",typeIdsOnChain);

        const results = await Promise.all(
          typeIdsOnChain.map(async (id) => {
            const cardData = await getCard(
              id,
              rootState.blockChain.contracts.signedZoombiesContract
              //rootState.blockChain.contracts.readOnlyZoombiesContract
            );
            if (!cardData) {
              return;
            }

            if (rootState.blockChain.walletAddress) {
              const isOwned = await isCardOwned(
                cardData,
                rootState.blockChain.contracts.signedZoombiesContract,
                rootState.blockChain.walletAddress
              );

              return {
                ...cardData,
                isOwned,
              };
            }

            return cardData;
          })
        );
        const storeCards = results.filter((result) => result !== undefined);
        commit(CARD_MUTATIONS.SET_SHOP_CARDS, storeCards);
      } catch (err) {
        console.error("Failed to load shop cards", { err });
        commit(CARD_MUTATIONS.LOADING_SHOP_CARDS_FAILED);
      }
    },
    sortCards({ commit, state }, payload) {
      commit(CARD_MUTATIONS.SET_SORTED_CARDS, {
        allShopCards: state.allShopCards,
        sortParam: payload,
      });
    },
    setCardAsBought({ commit }, payload) {
      commit(CARD_MUTATIONS.SET_CARD_BOUGHT, payload);
    },
    setCardAsNotBought({ commit }, payload) {
      commit(CARD_MUTATIONS.SET_CARD_NOT_BOUGHT, payload);
    },
    updateMintedCountForCard({ commit }, payload) {
      commit("updateMintedCountForCard", payload);
    },
    clearShopCards({ commit }) {
      commit(CARD_MUTATIONS.CLEAR_STORE_CARDS);
    },
  },
  getters: {
    getPaginatedShopCards: (state) => (pageSize, start, isSorted) => {
      const cardsToReturn = isSorted ? state.sortedCards : state.allShopCards;
      if (cardsToReturn.length === 0) {
        return [];
      }

      let pageNext, endIndex;
      if (!!start) {
        if (start + pageSize > cardsToReturn.length) {
          pageNext = null;
          endIndex = cardsToReturn.length;
        } else {
          pageNext = start + pageSize;
          endIndex = start + pageSize;
        }
      } else {
        if (pageSize > cardsToReturn.length) {
          pageNext = null;
          endIndex = cardsToReturn.length;
        } else {
          pageNext = pageSize;
          endIndex = pageSize;
        }
      }

      if (!!start) {
        // Return pagesize from this start
        return {
          cards: cardsToReturn.slice(start, endIndex),
          next: pageNext,
        };
      } else {
        return {
          cards: cardsToReturn.slice(0, endIndex),
          next: pageNext,
        };
      }
    },
    isLoadingShopCards: (state) => {
      return state.isLoadingShop;
    },
    isLoadingShopFailed: (state) => {
      return state.failedToLoadShop;
    },
    isShopLoadingFinished: (state) => {
      return state.shopLoaded;
    },
    getCardByTypeId: (state) => (typeId) => {
      const card = state.allShopCards.filter(
        (card) => card.type_id === typeId.toString()
      );
    },
    getAllShopCards: (state) => {
      return state.allShopCards;
    },
  },
};

export default cardStore;
