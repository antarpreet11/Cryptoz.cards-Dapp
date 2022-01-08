<template>
  <div class="container">
    <!--
        brown       - 585858
        light blue  - 03c1e8
        red         - d5005a
        purple      - b92ee4
    -->
    <div class="card-set-header">
      <h2>Zoombies World Card Type Collection</h2>
      <p>
        View the complete set of available card across the entire Zoombies World
      </p>
    </div>

    <div v-if="isLoadingCardset" class="loading-cardset">
      <b-spinner variant="light"></b-spinner>
    </div>
    <div v-else>
      <div v-if="cardSets" class="card-set-tablist-wrapper">
        <b-tabs :nav-class="cardSetTabClass" pills card vertical>
          <b-tab
            v-for="cardset in cardSets"
            :key="cardset.id"
            :title="cardset.cardSetName"
          >
            <div class="tab-content">
              <h3>Card Set: {{ cardset.cardSetName }}</h3>
              <div class="tab-content-cards">
                <owned-card-content
                  v-for="card in cardset.cards"
                  :id="parseInt(card.id)"
                  :key="card.id"
                  :buy_czxp="card.buy_czxp"
                  :is_single_card_view="false"
                  :cost="card.cost"
                  :edition_total="card.edition_total"
                  :in_store="card.in_store === '0' ? 'Booster' : 'Store'"
                  :name="card.name"
                  :sacrifice_czxp="card.sacrifice_czxp"
                  :type_id="card.type_id"
                  :unlock_czxp="card.unlock_czxp"
                  :card_class="getCardClass(card.rarity)"
                  :image="getCardImageUrl(card.svg)"
                  :level="card.card_level"
                  :cset="card.card_set"
                >
                </owned-card-content>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
      <div v-if="cardSets" class="card-set-list-wrapper-mobile">
        <b-form-select v-model="mobileSelectedTab" :options="cardSetOptions">
        </b-form-select>
        <div class="mobile-cards-wrapper">
          <owned-card-content
            v-for="(card) in getCurrentlySelectedCardSet.cards"
              :id="parseInt(card.id)"
                :key="card.id"
                :buy_czxp="card.buy_czxp"
                :is_single_card_view="false"
                :cost="card.cost"
                :edition_total="card.edition_total"
                :in_store="card.in_store === '0' ? 'Booster' : 'Store'"
                :name="card.name"
                :sacrifice_czxp="card.sacrifice_czxp"
                :type_id="card.type_id"
                :unlock_czxp="card.unlock_czxp"
                :card_class="getCardClass(card.rarity)"
                :image="getCardImageUrl(card.svg)"
                :level="card.card_level"
                :cset="card.card_set"
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
} from "bootstrap-vue";
import { getCardSets } from "../util/cardUtil";
import { v4 as uuidv4 } from "uuid";
import OwnedCardContent from "./OwnedCardContent.vue";
import { RARITY_CLASSES } from "../store/cardStore";

export default {
  name: "CardSets",
  components: {
    BTab,
    BTabs,
    BFormSelect,
    OwnedCardContent,
  },
  props: ["query"],
  data() {
    return {
      msg: "Here we go, here we go",
      wagerSample: 0,
      isLoadingCardset: true,
      cardSets: null,
      cardSetTabClass: "card-set-tab",
      mobileSelectedTab: null,
      enlargedCard: null,
    };
  },
  computed: {
    cardSetOptions: function () {
      if (this.cardSets) {
        return this.cardSets.map((cardset, index) => ({
          text: cardset.cardSetName,
          value: index,
        }));
      }

      return [];
    },
    getCurrentlySelectedCardSet: function () {
      if (this.mobileSelectedTab !== null && this.cardSets !== null) {
        const index = parseInt(this.mobileSelectedTab);

        return this.cardSets[index];
      }

      return [];
    },
  },
  mounted() {
    this.fetchCardSets();
  },
  methods: {
    async fetchCardSets() {
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
        const cardSetName = key;
        return {
          cardSetName,
          cards,
          id: uuidv4(),
        };
      });

      this.cardSets = transformedCardSets;
      this.mobileSelectedTab = 0;
      this.isLoadingCardset = false;
    },
    selectCardForEnlarge(cardIndex) {
      const index = parseInt(this.mobileSelectedTab);

      const currentCardset = this.cardSets[index];

      this.enlargedCard = currentCardset.cards[cardIndex];
      console.log(this.enlargedCard);
    },
    isCardEnlarged: function (cardId) {
      if (cardId && this.enlargedCard) {
        return this.enlargedCard.id === cardId;
      }

      return null;
    },
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
  background-color: white !important;
  border-radius: 5px !important;
  max-height: 800px;
  overflow: auto;
  flex-wrap: nowrap !important;

  a:link {
    color: black;
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
  max-height: 1000px;
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
</style>
