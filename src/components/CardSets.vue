<template>
  <div class="container">
    <!--
        brown       - 585858
        light blue  - 03c1e8
        red         - d5005a
        purple      - b92ee4
    -->
    <div class="card-set-header">
      <h2>Zoombies World Inhabitants and item types catalog</h2>
      <p>
        Zoombies unlike other NFT collections are a unique world of strange and
        wonderful People, Creatures, Plants and Objects. Cards are grouped into
        sets and may contain any combination of rarity, store and booster,
        limited and unlimited edition minting.
      </p>
    </div>

    <div v-if="!isCardsetLoaded" class="loading-cardset">
      <b-spinner variant="light"></b-spinner>
    </div>
    <div v-else>
      <div class="card-set-tablist-wrapper">
        <b-tabs
          active-nav-item-class="font-weight-bold info"
          :nav-class="cardSetTabClass"
          pills
          card
          vertical
        >
          <b-tab
            v-for="cardset in getFilteredCardsets"
            :key="cardset.id"
            :title="cardset.cardSetName"
          >
            <div class="tab-content">
              <h3>Card Set: {{ cardset.cardSetName }}</h3>
              <b-form-group>
                <b-form-checkbox
                  v-model="ownedChecked"
                  class="check-owned"
                  size="lg"
                  inline
                  >Owned</b-form-checkbox
                >
                <b-form-checkbox
                  v-model="notOwnedChecked"
                  class="check-not-owned"
                  size="lg"
                  inline
                  >Not Owned</b-form-checkbox
                >
                <b-form-checkbox v-model="neverMintedChecked" size="lg" inline
                  >Never Minted</b-form-checkbox
                >
              </b-form-group>
              <div class="tab-content-cards">
                <owned-card-content
                  v-for="card in getSortedCards(cardset.cards)"
                  :id="parseInt(card.id)"
                  :key="card.id"
                  :buy_czxp="card.buy_czxp"
                  :is_single_card_view="false"
                  :cost="card.cost"
                  :edition_total="card.edition_total"
                  :in_store="card.in_store === '0' ? 'Store' : 'Booster'"
                  :name="card.name"
                  :sacrifice_czxp="card.sacrifice_czxp"
                  :type_id="card.type_id"
                  :unlock_czxp="card.unlock_czxp"
                  :card_class="getCardClass(card.rarity)"
                  :image="getCardImageUrl(card.svg)"
                  :level="card.card_level"
                  :cset="card.card_set"
                  :is_plat="card.rarity === '2'"
                  :used_in_cardsets="true"
                  :is_minted="card.isMinted"
                  :is_owned="card.isOwned"
                  :release_time="card.release_time"
                >
                </owned-card-content>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
      <div class="card-set-list-wrapper-mobile">
        <b-form-select v-model="mobileSelectedTab" :options="cardSetOptions">
        </b-form-select>
        <div class="mobile-cards-wrapper">
          <owned-card-content
            v-for="card in getCurrentlySelectedCardSet.cards"
            :id="parseInt(card.id)"
            :key="card.id"
            :buy_czxp="card.buy_czxp"
            :is_single_card_view="false"
            :cost="card.cost"
            :edition_total="card.edition_total"
            :in_store="card.in_store === '0' ? 'Store' : 'Booster'"
            :name="card.name"
            :sacrifice_czxp="card.sacrifice_czxp"
            :type_id="card.type_id"
            :unlock_czxp="card.unlock_czxp"
            :card_class="getCardClass(card.rarity)"
            :image="getCardImageUrl(card.svg)"
            :level="card.card_level"
            :cset="card.card_set"
            :is_plat="card.rarity === '2'"
            :used_in_cardsets="true"
            :is_minted="card.isMinted"
            :is_owned="card.isOwned"
            :release_time="card.release_time"
          >
          </owned-card-content>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BTab,
  BTabs,
  BFormSelect,
  BFormGroup,
  BFormCheckbox,
} from "bootstrap-vue";
import OwnedCardContent from "./OwnedCardContent.vue";
import { RARITY_CLASSES } from "../util/cardUtil";
import { CardsetFilters } from "../store/cardsetStore";
import { mapGetters } from "vuex";

export default {
  name: "CardSets",
  components: {
    BTab,
    BTabs,
    BFormSelect,
    BFormGroup,
    BFormCheckbox,
    OwnedCardContent,
  },
  props: ["query"],
  data() {
    return {
      cardSetTabClass: "card-set-tab",
      mobileSelectedTab: 0,
      ownedChecked: false,
      notOwnedChecked: false,
      neverMintedChecked: false,
    };
  },
  computed: {
    cardSetOptions: function () {
      if (this.getAllCardsets) {
        const sortedCardsets = this.getAllCardsets
          .map((cardset) => cardset.cardSetName)
          .sort();

        const cardSetNames = sortedCardsets.map((cardset, index) => ({
          text: cardset,
          value: index,
        }));

        return cardSetNames;
      }

      return [];
    },
    getCurrentlySelectedCardSet: function () {
      if (this.mobileSelectedTab !== null) {
        const index = parseInt(this.mobileSelectedTab);
        return this.$store.getters["cardset/getFilteredCardsetByIndex"](index);
      }

      return [];
    },
    ...mapGetters({
      getCryptCards: "crypt/getAllCryptCards",
      isCryptLoaded: "crypt/isCryptLoaded",
      getFilteredCardsets: "cardset/getFilteredCardsets",
      getAllCardsets: "cardset/getAllCardsets",
      isCardsetLoaded: "cardset/isCardsetLoaded",
    }),
  },
  watch: {
    isCryptLoaded(val) {
      if (val) {
        this.$store.dispatch("cardset/fetchAllCardSets");
      }
    },
    ownedChecked(val) {
      if (val) {
        this.$store.dispatch("cardset/setFilter", CardsetFilters.owned);
      } else {
        this.$store.dispatch("cardset/removeFilter", CardsetFilters.owned);
      }
    },
    notOwnedChecked(val) {
      if (val) {
        this.$store.dispatch("cardset/setFilter", CardsetFilters.notOwned);
      } else {
        this.$store.dispatch("cardset/removeFilter", CardsetFilters.notOwned);
      }
    },
    neverMintedChecked(val) {
      if (val) {
        this.$store.dispatch("cardset/setFilter", CardsetFilters.neverMinted);
      } else {
        this.$store.dispatch(
          "cardset/removeFilter",
          CardsetFilters.neverMinted
        );
      }
    },
  },
  mounted() {
    if (this.isCryptLoaded) {
      this.$store.dispatch("cardset/fetchAllCardSets");
    }
  },
  methods: {
    getCardImageUrl(svg) {
      return `https://zoombies.world/card-gen/assets/${svg}`;
    },
    getCardClass(rarity) {
      switch (rarity) {
        case "1":
          return RARITY_CLASSES.Diamond;
        case "2":
          return RARITY_CLASSES.Platinum;
        case "3":
          return RARITY_CLASSES.Epic;
        case "4":
          return RARITY_CLASSES.Rare;
        case "5":
          return RARITY_CLASSES.Uncommon;
        case "6":
          return RARITY_CLASSES.Common;
        default:
          return null;
      }
    },
    getSortedCards(cards) {
      if (cards) {
        cards = cards.slice().sort((a, b) => {
          return a.release_time - b.release_time;
        });

        return cards;
      }

      return [];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  margin-bottom: 64px;

  .loading-cardset {
    text-align: center;
    margin: 24px;
  }
}

.card-set-tab {
  background-color: #1d1d1d !important;
  border-radius: 5px !important;
  flex-wrap: nowrap !important;

  a:link {
    color: white;
  }
}

.card-set-header {
  margin: 24px 0px;

  @media screen and (max-width: 768px) {
    text-align: center;

    h2 {
      font-size: 1.5rem;
    }
    // p {
    //   font-size: 0.8rem;
    // }
  }
}

.card-set-tablist-wrapper {
  padding: 32px 0px;
  display: none;

  @media screen and (min-width: 768px) {
    display: block;
  }
}

.card-set-list-wrapper-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (min-width: 768px) {
    display: none;
  }

  .mobile-cards-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    max-height: 600px;
    overflow: auto;
    margin-top: 12px;
  }
}

.tab-content {
  display: flex;
  padding-left: 8px;
  flex-direction: column;

  overflow-y: auto;
  overflow-x: hidden;

  .tab-pane {
    overflow: hidden !important;
  }

  h1 {
    margin: 0;
  }

  .tab-content-cards {
    display: grid;
    grid-template-columns: 1fr;

    @media screen and (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
      column-gap: 8px;
      row-gap: 24px;
    }

    @media screen and (min-width: 1200px) {
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: 8px;
      row-gap: 24px;
    }
  }
}

.form-check-input {
  width: 16px;
  height: 16px;
}

.check-owned {
  color: #7ef4f6;
}
.check-not-owned {
  color: #f566e2;
}
.check-not-minted {
  color: #cccccc;
}
</style>
