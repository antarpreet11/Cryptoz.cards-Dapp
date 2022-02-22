<template>
  <div>
    <b-modal
      id="buy-boosters-modal"
      title="Buy Booster Minting Credits @ 0.01 MOVR each"
    >
      <div class="booster-modal-content">
        <p class="booster-modal-title">
          Booster NFT cards will NEVER be sold in the shop
        </p>
        <p class="booster-modal-explain">
          Enter the number of booster NFT minting credits you would like to
          purchase:
        </p>
        <input
          id="toWallet"
          class="form-control"
          type="text"
          value="1"
          required
          @input="totalCreditsToBuy = $event.target.value"
        />
      </div>

      <template #modal-footer>
        <div class="booster-modal-footer">
          <b-button class="mt-3" variant="danger" @click="buyBoosters">
            Buy Credits
          </b-button>
          <b-button
            class="mt-3"
            variant="secondary"
            @click="$bvModal.hide('buy-boosters-modal')"
          >
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
    <div>
      <UniverseBalances />
      <div class="shop-description">
        <h1><b-icon-tag-fill /> Minting Shop</h1>
        <p>
          The Shop is a place to mint limited edition Zoombies Cards NFT tokens.
          Some cards are free, some have a cost. You may also buy and
          <router-link to="/my-zoombies-nfts"> open a booster card </router-link
          >, which will mint a random booster edition NFT token.
        </p>
        <p>
          To mint a FREE NFT Or buy a Limited edition NFT at cost, you will need
          the required minimum balance of ZOOM tokens displayed on the botton of
          the card to update the minting button.<br />
          You will automatically see a
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Emojione_1F680.svg"
            class="rocket-fp-icon"
          />
          Fast Pass price to bypass the ZOOM requirement and may pay 3x the cost
          to buy immediately on non-Free cards.
        </p>

        <p>
          The newly minted NFT will appear in
          <router-link to="/my-zoombies-nfts"> Your NFT Crypt </router-link>
          once the transaction is confirmed. ZOOM is NOT burned when minting.
        </p>
      </div>

      <div v-if="isWalletConnected">
        <div class="row">
          <div class="col">
            <b-button
              id="buy-boosters-btn"
              v-b-tooltip.hover="'Earn +500 ZOOM per credit'"
              v-b-modal.buy-boosters-modal
              class="btn btn-danger"
              :disabled="getBalance < 0.02 || isBuyingBooster"
            >
              Buy <b-icon-lightning-fill /> Booster NFT Minting Credits @ 0.01
              <img src="@/assets/movr_logo.png" class="mr-icon" />
            </b-button>
          </div>
        </div>
        <OwnerBalances />
      </div>

      <div v-else>
        <h2 class="centered">
          <b-button
            v-if="!isWalletConnected"
            id="connect-button"
            v-b-toggle.nav-collapse
            variant="primary"
            @click="onConnect"
          >
            Connect
          </b-button>
          your wallet to mint NFTs.
        </h2>
      </div>

      <div v-if="isLoadingShopCards" class="loading">
        <b-spinner style="width: 3rem; height: 3rem" type="grow" />
      </div>
      <div v-else>
        <div class="row sort-wrapper">
          <div class="col text-left">
            <SortDropdown @sort-by-attr="sortByAttr" />
          </div>
        </div>
      </div>
      <br />
      <div id="cards-wrapper">
        <div
          v-for="(card, i) in displayCards"
          :key="card.type_id"
          class="card-wrapper"
        >
          <OwnedCardContent
            :type_id="card.type_id"
            :name="card.name"
            :cost="card.cost"
            :cset="card.card_set"
            :edition_current="card.edition_current"
            :edition_total="card.edition_total"
            :in_store="card.in_store"
            :level="card.card_level"
            :unlock_czxp="card.unlock_czxp"
            :buy_czxp="card.buy_czxp"
            :sacrifice_czxp="card.sacrifice_czxp"
            :image="card.image"
            :card_class="card.rarity"
            :card_owned="false"
            :index="i"
            :observer="observer"
          />
          <div v-if="isWalletConnected" class="card-button-container">
            <div
              v-if="card.soldOut == 1"
              id="sold-button-wrapper"
              v-b-tooltip.hover="getSoldCardToolTipText"
              class="disabled-btn"
            >
              <button id="sold-button" disabled class="btn btn-danger">
                SOLD OUT
              </button>
            </div>

            <div
              v-else-if="parseInt(card.release_time * 1000) > getNowTimeStamp"
              id="unreleased-button-wrapper"
              class="disabled-btn"
            >
              <div v-b-tooltip.hover="getBtnTooltipTextUnreleased">
                <button id="unreleased-button" class="btn btn-warning" disabled>
                  <b-icon-lock-fill />
                  {{
                    getFormattedReleasedLabel(card.id, card.release_time * 1000)
                  }}
                </button>
              </div>
            </div>

            <div
              v-else-if="!card.isOwned"
              id="buy-get-button-wrapper"
              :class="
                (parseFloat(getBalance) <= parseFloat(3 * card.cost) &&
                  getZoomBalance < parseInt(card.unlock_czxp)) ||
                parseFloat(getBalance) <= card.cost
                  ? 'disabled-btn'
                  : ''
              "
            >
              <div
                v-if="card.cost > 0"
                id="buyBtnwrapper"
                v-b-tooltip.hover="
                  buyBtnTooltipText(card.cost, card.unlock_czxp)
                "
              >
                <b-button
                  id="buy-button"
                  :disabled="
                    (parseFloat(getBalance) <= parseFloat(3 * card.cost) &&
                      getZoomBalance < parseInt(card.unlock_czxp)) ||
                    parseFloat(getBalance) <= card.cost
                  "
                  variant="primary"
                  @click="buyCard(card)"
                >
                  <b-icon-lock-fill
                    v-if="
                      (parseFloat(getBalance) <= parseFloat(3 * card.cost) &&
                        getZoomBalance < parseInt(card.unlock_czxp)) ||
                      parseFloat(getBalance) <= card.cost
                    "
                  />
                  Mint NFT for
                  {{
                    getZoomBalance < parseInt(card.unlock_czxp)
                      ? (card.cost * 3).toFixed(3)
                      : card.cost
                  }}
                  <img src="@/assets/movr_logo.png" class="mr-icon" />
                </b-button>
                <img
                  v-if="getZoomBalance < parseInt(card.unlock_czxp)"
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Emojione_1F680.svg"
                  class="rocket-icon"
                />
              </div>
              <div
                v-else
                id="getBtnwrapper"
                v-b-tooltip.hover="getBtnTooltipText(card.unlock_czxp)"
                :class="{
                  'disabled-btn': getZoomBalance < parseInt(card.unlock_czxp),
                }"
              >
                <button
                  id="get-button"
                  class="btn btn-primary"
                  :disabled="getZoomBalance < parseInt(card.unlock_czxp)"
                  @click="getCardForFree(card)"
                >
                  <b-icon-lock-fill
                    v-if="getZoomBalance < parseInt(card.unlock_czxp)"
                  />
                  Mint for FREE
                </button>
              </div>
            </div>

            <div
              v-else
              id="owned-button-wrapper"
              v-b-tooltip.hover="getOwnedCardToolTipText"
              class="disabled-btn"
            >
              <button id="owned-button" disabled class="btn btn-info">
                You already minted one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import debounce from "lodash/debounce";
import { BButton, BSpinner } from "bootstrap-vue";

import OwnedCardContent from "@/components/OwnedCardContent.vue";
import UniverseBalances from "@/components/UniverseBalances.vue";
import OwnerBalances from "@/components/OwnerBalances.vue";
import SortDropdown from "@/components/SortDropdown.vue";
import dAppStates from "@/dAppStates";
import { showErrorToast } from "../util/showToast";
import { MessageBus } from "@/messageBus";
import { ethers } from "ethers";

export default {
  components: {
    OwnedCardContent,
    UniverseBalances,
    OwnerBalances,
    SortDropdown,
    BButton,
    BSpinner,
  },
  data() {
    return {
      buyBtnTooltipTextContent:
        "Click to mint a limited edition NFT of this card",
      buyBtnBlockedTooltipTextContent:
        "You do not have enough MOVR tokens to unlock minting",
      buyBtnFastPassTooltipTextContent:
        "Fast Pass the ZOOM requirement and mint the NFT now",
      getBtnTooltipTextContent: "Click to mint a copy of this card at no cost",
      getBtnBlockedTooltipTextContent:
        "You do not have the required ZOOM to claim this for FREE",
      getOwnedCardToolTipText: "You can only mint 1 card of each type",
      getSoldCardToolTipText:
        "All NFTs of this type have been minted, check markets",
      getBtnTooltipTextUnreleased:
        "This type has not been released for NFT minting yet",
      totalCreditsToBuy: 1,
      isBuyingBooster: false,
      isCardSorted: false,
      pageSize: 15,
      paginatedCards: [],
      sortedPaginatedCards: [],
      pageNext: 0,
      sortedPageNext: 0,
      observer: null,
      nowTimeStamp: 0,
    };
  },
  beforeUnmount() {
    this.observer.disconnect();
    clearInterval(window.nowTimer);
  },
  created() {
    this.observer = new IntersectionObserver(this.onElementObserved, {
      root: this.$el,
      threshold: 1.0,
    });
    this.loadMoreCards = debounce(
      () => {
        if (this.isCardSorted) {
          const newCards = this.$store.getters.getPaginatedShopCards(
            this.pageSize,
            this.sortedPageNext,
            this.isCardSorted
          );
          this.sortedPaginatedCards = [
            ...this.sortedPaginatedCards,
            ...newCards.cards,
          ];
          this.sortedPageNext = newCards.next;
        } else {
          const newCards = this.$store.getters.getPaginatedShopCards(
            this.pageSize,
            this.pageNext,
            this.isCardSorted
          );
          this.paginatedCards = [...this.paginatedCards, ...newCards.cards];
          this.pageNext = newCards.next;
        }
      },
      500,
      { leading: true }
    );
  },
  mounted() {
    if (this.getAllShopCards.length > 0) {
      this.setStoreCard();
    }
    window.nowTimer = setInterval(this.setNow, 1000);
  },
  computed: {
    dAppState() {
      return this.$store.state.dAppState;
    },
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    getNowTimeStamp() {
      return this.nowTimeStamp;
    },
    displayCards() {
      return this.isCardSorted
        ? this.sortedPaginatedCards
        : this.paginatedCards;
    },
    canLoadMore() {
      if (this.isCardSorted) {
        return this.sortedPageNext !== null;
      } else {
        return this.pageNext !== null;
      }
    },
    ...mapGetters([
      "isLoadingShopCards",
      "isShopLoadingFinished",
      "getAllShopCards",
    ]),
    ...mapGetters({
      getWalletAddress: "blockChain/getWalletAddress",
      getBalance: "blockChain/getBalance",
      getZoomBalance: "blockChain/getZoomBalance",
      getSignedZoombiesContract: "blockChain/getSignedZoombiesContract",
    }),
  },
  // watch: {
  //   getWalletAddress(newVal, oldVal) {
  //     if (newVal && newVal !== oldVal) {
  //       this.fetchStoreCards();
  //     }
  //   },
  // },
  watch: {
    getAllShopCards(newVal) {
      if (newVal.length > 0) {
        this.setStoreCard();
      }
    },
  },
  methods: {
    setStoreCard: async function () {
      // await this.$store.dispatch("fetchStoreCards");

      const pageStart = this.isCardSorted ? this.sortedPageNext : this.pageNext;
      const newCards = this.$store.getters.getPaginatedShopCards(
        this.pageSize,
        pageStart,
        this.isCardSorted
      );

      if (this.isCardSorted) {
        this.sortedPaginatedCards = [
          ...this.sortedPaginatedCards,
          ...newCards.cards,
        ];
        this.sortedPageNext = newCards.next;
      } else {
        this.paginatedCards = [...this.paginatedCards, ...newCards.cards];
        this.pageNext = newCards.next;
      }
    },
    setNow() {
      this.nowTimeStamp = Date.now();
    },
    getBuyZoom(val) {
      //unlock * 10 * baseCost   =    val * 10 * 100000000000000
      return parseFloat(0.0000001 * 10 * val);
    },
    getFormattedReleasedLabel(id, releaseTime) {
      var timeRemaining = new Date(
        releaseTime - new Date().getTime()
      ).getTime();

      var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    },
    getBtnTooltipText(unlock_czxp) {
      if (this.getZoomBalance < parseInt(unlock_czxp)) {
        return this.getBtnBlockedTooltipTextContent;
      } else {
        return this.getBtnTooltipTextContent;
      }
    },
    getCardForFree: async function (cardAttributes) {
      try {
        this.showTransactionModal();
        this.$store.dispatch("setCardAsBought", {
          cardId: cardAttributes.type_id,
          isSorted: this.isCardSorted,
        });

        let freeCost = 0;

        const result = await this.getSignedZoombiesContract.getFreeCard(
          cardAttributes.type_id,
          {
            value: freeCost,
          }
        );
        this.hideTransactionModal();
        await result.wait();

        if (result) {
          this.$store.dispatch("setCurrentEdition", {
            cardId: cardAttributes.type_id,
            edition: (cardAttributes.edition_current += 1),
            isSorted: this.isCardSorted,
          });
        }
      } catch (err) {
        this.$store.dispatch("setCardAsNotBought", {
          cardId: cardAttributes.type_id,
          isSorted: this.isCardSorted,
        });

        if (err.code !== 4001) {
          console.log(err);
          showErrorToast(this, "Failed to mint card");
        }
      }
    },
    buyCard: async function (cardAttributes) {
      try {
        this.$store.dispatch("setCardAsBought", {
          cardId: cardAttributes.id,
          isSorted: this.isCardSorted,
        });

        this.showTransactionModal();
        let cardBNValue = ethers.utils
          .parseEther(cardAttributes.cost)
          .toString();

        //HAck for cemetary wolf
        if (cardAttributes.type_id == 147) {
          cardBNValue = "8999999999999999";
        }

        if (cardAttributes.type_id == 149 || cardAttributes.type_id == 151) {
          cardBNValue = "70000000000000008";
        }

        if (this.getZoomBalance < cardAttributes.unlock_czxp) {
          cardBNValue = ethers.utils
            .parseEther((cardAttributes.cost * 3).toFixed(5))
            .toString();

          if (cardAttributes.type_id == 147) {
            cardBNValue = "26999999999999997";
          }

          if (cardAttributes.type_id == 149 || cardAttributes.type_id == 151) {
            cardBNValue = "210000000000000024";
          }
        }

        const result = await this.getSignedZoombiesContract.buyCard(
          cardAttributes.type_id,
          {
            value: cardBNValue.toString(),
          }
        );

        this.hideTransactionModal();

        await result.wait();

        if (result) {
          this.$store.dispatch("setCurrentEdition", {
            cardId: cardAttributes.id,
            edition: (cardAttributes.edition_current += 1),
            isSorted: this.isCardSorted,
          });
        }
      } catch (err) {
        console.log(err);
        this.$store.dispatch("setCardAsNotBought", {
          cardId: cardAttributes.id,
          isSorted: this.isCardSorted,
        });
        this.hideTransactionModal();
        if (err.code !== 4001) {
          console.log(err);
          showErrorToast(this, "Failed to mint card");
        }
      }
    },
    buyBoosters: async function () {
      try {
        this.$bvModal.hide("buy-boosters-modal");
        this.isBuyingBooster = true;

        this.showTransactionModal();

        var totalBoostersCost = ethers.utils
          .parseEther((0.01 * parseInt(this.totalCreditsToBuy)).toString())
          .toString();

        const result = await this.getSignedZoombiesContract.buyBoosterCredits(
          parseInt(this.totalCreditsToBuy),
          {
            value: totalBoostersCost,
          }
        );
        this.hideTransactionModal();
        await result.wait();
      } catch (error) {
        console.error(error);
        if (error.code !== 4001) {
          showErrorToast(this, "Failed to mint card");
        }
        this.hideTransactionModal();
      } finally {
        this.isBuyingBooster = false;
      }
    },
    buyBtnTooltipText(cost, unlock_czxp) {
      if (
        (parseFloat(this.getBalance) <= parseFloat(3 * cost) &&
          parseInt(this.getZoomBalance) < parseInt(unlock_czxp)) ||
        parseFloat(this.getBalance) <= parseFloat(3 * cost)
      ) {
        return this.buyBtnBlockedTooltipTextContent;
      } else if (
        parseFloat(this.getBalance) > parseFloat(3 * cost) &&
        parseInt(this.getZoomBalance) < parseInt(unlock_czxp)
      ) {
        return this.buyBtnFastPassTooltipTextContent;
      } else {
        return this.buyBtnTooltipTextContent;
      }
    },
    sortByAttr: async function (param, isDescending) {
      if (!param) {
        // We cleared sort.
        // Clear all data so we start with a new page of sort
        this.isCardSorted = false;
        this.sortedPaginatedCards = [];
        this.sortedPageNext = 0;
        return;
      }

      this.sortedPaginatedCards = [];
      this.sortedPageNext = 0;
      this.isCardSorted = true;
      await this.$store.dispatch("sortCards", {
        param,
        isDescending,
      });

      const newCards = this.$store.getters.getPaginatedShopCards(
        this.pageSize,
        this.sortedPageNext,
        this.isCardSorted
      );

      this.sortedPaginatedCards = [...newCards.cards];
      this.sortedPageNext = newCards.next;
    },
    showTransactionModal() {
      this.$store.dispatch("setIsTransactionPending", true);
    },
    hideTransactionModal() {
      this.$store.dispatch("setIsTransactionPending", false);
    },
    onConnect: function () {
      MessageBus.$emit("connect");
    },
    onElementObserved(entries) {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) {
          return;
        }

        this.observer.unobserve(target);

        const index = parseInt(target.getAttribute("data-index"));
        // if the 10th last card scrolls into view, load more
        if (index === this.displayCards.length - 10) {
          if (this.canLoadMore) {
            this.loadMoreCards();
          }
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#buy-get-button-wrapper,
#owned-button-wrapper,
#sold-button-wrapper {
  position: relative;
  text-align: center;
  width: 80%;
}

#sold-button,
#owned-button {
  color: #7d012a;
  background-image: url("~@/assets/red_button.png");
}
#unreleased-button {
  color: #e60e00;
  background-image: url("~@/assets/yellow_button.png");
}

#get-button,
#buy-button {
  color: #003523;
  background-image: url("~@/assets/green_button.png");
}

.loading {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 36px;
}

.sort-wrapper {
  margin-bottom: 36px;
}

.spinner {
  width: 2em;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.shop-card-item {
  display: flex;
  flex-direction: column;
  width: 260px;
}

.flex-row {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.card-button-container {
  display: flex;
  justify-content: center;
}

.card-button-container button {
  font-size: 16px;
}

#cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  place-items: center;

  button {
    background-color: transparent;
    background-size: 100% 100%;
    border: none;
    /* color: white; */
    font-weight: 650;
    width: 100%;
    font-family: "Oswald", sans-serif;
  }

  /* let' get colour specific on why we disabled, sold vs unreleased
  .disabled-btn {
    button {
      color: #333;
      text-shadow: none;
    }
  }
*/
}

.shop-description {
  a {
    color: #7ef4f6;
  }
}

#buy-boosters-btn {
  background-color: transparent;
  background-image: url("assets/pink_button_wide.png");
  background-size: 100% 100%;
  border: none;
  color: #111;
  font-weight: 650;
  padding: 10px 14px;
}

.card-wrapper {
  display: flex;
  min-width: 0;
  flex-direction: column;
  width: 260px;
}

.load-more {
  width: 100%;
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.centered {
  display: flex;
  justify-content: center;
}

#connect-button {
  font-size: 20px;
  padding: 5px 10px;
  margin-right: 10px;
}

.booster-modal-footer {
  display: flex;
  align-items: flex-end;

  button {
    margin-left: 16px;
  }
}

.booster-modal-title {
  font-weight: bold;
  font-size: 1.5rem;
}

.booster-modal-explain {
  font-size: 1.2rem;
}

.booster-modal-content {
  padding: 36px 36px;
}

.rocket-icon {
  height: 2.2em;
  position: absolute;
  top: -6px;
  left: -22px;
}

@media screen and (max-width: 1000px) {
  #cards-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(calc(0.55 * 260px), 1fr));

    .card-wrapper {
      width: calc(0.55 * 260px);

      .card-button-container {
        margin-top: 5px;

        button {
          padding: 3%;
          font-size: 12px;
          width: 90%;
        }

        .disabled-btn {
          button {
            text-shadow: none;
          }
        }
      }
    }
  }

  .rocket-icon {
    height: 1.8em;
    top: -6px;
    left: -4px;
  }

  .booster-modal-content {
    padding: 10px 10px;
  }

  #buy-get-button-wrapper {
    text-shadow: 1px 1px black;
  }
}

.mr-icon {
  height: 20px;
}

.rocket-fp-icon {
  max-height: 30px;
}
</style>
