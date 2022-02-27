<template>
  <div>
    <div class="wrapper">
      <div id="button-container">
        <div class="modifier-wrapper">
          <div class="primary-actions">
            <b-button
              id="view-change-button"
              v-b-tooltip.hover="tableButtonTooltip"
              variant="info"
              :disabled="!ownsCards"
              @click="() => toggleTableView()"
            >
              {{ "View " + (isTableView ? "Gallery" : "Table") }}
            </b-button>
            <SortDropdown :disabled="!ownsCards" @sort-by-attr="sortByAttr" />
          </div>
          <div class="filter-by-wrapper">
            <b-dropdown
              class="filter-by"
              :text="cardOriginFilterLabel"
              variant="secondary"
            >
              <b-dropdown-item
                :active="isActive('ORIGIN', cardOriginData.ALL)"
                @click="setOriginFilter(cardOriginData.ALL)"
              >
                All Cards
              </b-dropdown-item>
              <b-dropdown-item
                :active="isActive('ORIGIN', cardOriginData.STORE)"
                @click="setOriginFilter(cardOriginData.STORE)"
              >
                Store Cards
              </b-dropdown-item>
              <b-dropdown-item
                :active="isActive('ORIGIN', cardOriginData.BOOSTER)"
                @click="setOriginFilter(cardOriginData.BOOSTER)"
              >
                Booster cards
              </b-dropdown-item>
            </b-dropdown>
            <div class="filter-rarity-wrapper">
              <b-button-group>
                <b-button
                  v-for="rarity in options"
                  :key="rarity.value"
                  :variant="rarity.value"
                  :class="getRarityFilterActiveClass(rarity.value)"
                  @click="() => setRarityFilter(rarity.value)"
                >
                  {{ rarity.text }}
                </b-button>
              </b-button-group>
            </div>
          </div>
        </div>
        <div class="crypt-actions">
          <input
            id="my-crypt-link"
            ref="myCrypt"
            hidden
            :value="getMyCryptLink"
          />
          <b-button
            v-if="isOthersCrypt"
            class="my-crypt-button"
            variant="warning"
            @click="() => goBackToMyCrypt()"
          >
            Go To My NFT Crypt
          </b-button>
          <b-button
            v-else
            class="my-crypt-button"
            variant="warning"
            @click="() => copyMyCryptLink()"
          >
            Copy My NFT Crypt Link
          </b-button>
          <b-input-group class="crypt-search-input-group">
            <b-form-input
              v-model="addressToSearch"
              trim
              type="text"
              placeholder="Wallet Address"
              :state="addressToSearchState"
            />
            <b-input-group-append>
              <b-button
                :disabled="disableSearch"
                variant="success"
                @click="() => searchNewCrypt()"
              >
                Go
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>

      <div v-if="isLoading" class="loading">
        <b-spinner style="width: 3rem; height: 3rem" type="grow" />
      </div>
      <div
        v-else-if="isCardModified && modifiedPaginatedCryptCards.length === 0"
      >
        <h2>Your filter condition did not return any cards.</h2>
      </div>
      <div v-else>
        <div v-if="ownsCards">
          <div v-if="isOthersCrypt || isWalletConnected">
            <div v-if="!isTableView" class="cards-wrapper">
              <div
                v-for="(card, i) in displayCards"
                :key="card.id"
                class="card-wrapper"
              >
                <OwnedCardContent
                  :id="card.id"
                  :type_id="card.type_id"
                  :name="card.name"
                  :cost="card.cost"
                  :cset="card.card_set"
                  :edition_current="card.edition_current"
                  :edition_total="card.edition_total"
                  :level="card.card_level"
                  :unlock_czxp="card.unlock_czxp"
                  :buy_czxp="card.buy_czxp"
                  :sacrifice_czxp="card.sacrifice_czxp"
                  :image="card.image"
                  :card_class="card.rarity"
                  :in_store="card.in_store"
                  :card_owned="true"
                  :index="i"
                  :observer="observer"
                />
                <div v-if="!isOthersCrypt" class="sacrifice-wrapper">
                  <div>
                    <button
                      v-b-tooltip.hover="'Sacrifice'"
                      :disabled="
                        cardsBeingGifted[card.id] ||
                        cardsBeingSacrificed[card.id]
                      "
                      class="btn btn-danger"
                      @click="sacrificeCards([card.id])"
                    >
                      <span class="emoji">☠️</span>
                    </button>
                  </div>
                  <b-spinner
                    v-if="
                      cardsBeingGifted[card.id] || cardsBeingSacrificed[card.id]
                    "
                    label="Spinning"
                  />
                  <div class="float-right">
                    <b-button
                      v-b-tooltip.hover="'Gift'"
                      :disabled="
                        cardsBeingGifted[card.id] ||
                        cardsBeingSacrificed[card.id]
                      "
                      class="btn btn-danger btn-gift"
                      @click="openGiftModal(card.id)"
                    >
                      <b-icon-gift style="color: white" />
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="!isOthersCrypt" class="table">
              <div class="mass-sac">
                <span v-if="selectedCards.length === 0">
                  <b-icon-arrow-90deg-down />
                  Select Zoombies to Mass Sacrifice
                </span>
                <span v-else>
                  <b-button
                    v-b-modal="'mass-sacrifice-modal'"
                    variant="danger"
                    :disabled="Object.keys(cardsBeingSacrificed).length > 0"
                  >
                    ☠️ Sacrifice {{ selectedCards.length }} Zoombies
                  </b-button>
                </span>
              </div>
              <crypt-table
                :display-cards="displayCards"
                :table-fields="tableFields"
                :is-others-crypt="isOthersCrypt"
                :observer="observer"
                :cards-being-sacrificed="cardsBeingSacrificed"
                :cards-being-gifted="cardsBeingGifted"
                @giftCard="openGiftModal"
                @sacrificeCards="sacrificeCards"
                @loadMore="loadMoreCards"
              ></crypt-table>
            </div>
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
              your wallet.
            </h2>
          </div>
        </div>

        <div v-if="(isWalletConnected || isOthersCrypt) && !ownsCards">
          <h2 v-if="!isOthersCrypt">
            You do not own any Zoombies NFTs<br /><router-link to="/shop">
              To mint Free Zoombies NFTs or to Buy, visit the Minting Shop
            </router-link>
          </h2>
          <h2 v-else>No Avaliable NFTs</h2>
        </div>
      </div>
    </div>
    <b-modal
      id="mass-sacrifice-modal"
      :title="`Are you sure you want to Sacrifice ${selectedCards.length} Zoombies?`"
    >
      <div>
        <strong>You will be sacrificing:</strong>
        <ul>
          <li v-if="getSelectedCardCountByRarity('Diamond') > 0">
            {{ getSelectedCardCountByRarity("Diamond") }} Diamond Zoombie(s)
          </li>
          <li v-if="getSelectedCardCountByRarity('Platinum') > 0">
            {{ getSelectedCardCountByRarity("Platinum") }} Platinum Zoombie(s)
          </li>
          <li v-if="getSelectedCardCountByRarity('Epic') > 0" class="epic">
            {{ getSelectedCardCountByRarity("Epic") }} Epic Zoombie(s)
          </li>
          <li v-if="getSelectedCardCountByRarity('Rare') > 0" class="rare">
            {{ getSelectedCardCountByRarity("Rare") }} Rare Zoombie(s)
          </li>
          <li
            v-if="getSelectedCardCountByRarity('Uncommon') > 0"
            class="uncommon"
          >
            {{ getSelectedCardCountByRarity("Uncommon") }} Uncommon Zoombie(s)
          </li>
          <li v-if="getSelectedCardCountByRarity('Common') > 0" class="common">
            {{ getSelectedCardCountByRarity("Common") }} Common Zoombie(s)
          </li>
        </ul>
      </div>
      <template #modal-footer>
        <div class="mass-sac-modal-footer">
          <b-button variant="danger" @click="confirmMassSacrifice">
            ☠️ Sacrifice
          </b-button>
          <b-button
            variant="secondary"
            @click="$bvModal.hide('mass-sacrifice-modal')"
          >
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { ethers } from "ethers";
import debounce from "lodash/debounce";
import SortDropdown from "@/components/SortDropdown.vue";
import OwnedCardContent from "@/components/OwnedCardContent";
import CryptTable from "@/components/CryptTable";
import { showSuccessToast } from "../util/showToast";
import { FILTER_TYPES } from "../store/cryptStore";
import {
  BButton,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BSpinner,
  BDropdown,
  BDropdownItem,
  BButtonGroup,
} from "bootstrap-vue";
import dAppStates from "@/dAppStates";
import { MessageBus } from "@/messageBus";
import { mapGetters } from "vuex";
import { BIconArrow90degDown } from "bootstrap-vue";

export default {
  name: "CardsContainer",
  components: {
    SortDropdown,
    OwnedCardContent,
    BButton,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BSpinner,
    CryptTable,
    BDropdown,
    BDropdownItem,
    BButtonGroup,
    BIconArrow90degDown,
  },
  props: {
    addressToLoad: {
      type: String,
      default: null,
    },
    isOthersCrypt: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["cryptChanged"],
  beforeUnmount() {
    this.observer.disconnect();
  },
  created() {
    this.observer = new IntersectionObserver(this.onElementObserved, {
      root: this.$el,
      threshold: 1.0,
    });

    this.loadMoreCards = debounce(
      () => {
        const pageNext = this.isCardModified
          ? this.modifiedPageNext
          : this.pageNext;

        const newCards = this.getPaginatedCryptCards(
          this.pageSize,
          pageNext,
          this.isCardModified
        );

        if (this.isCardModified) {
          this.modifiedPaginatedCryptCards = _.uniqBy(
            [...this.modifiedPaginatedCryptCards, ...newCards.cards],
            "id"
          );
          this.modifiedPageNext = newCards.next;
        } else {
          this.paginatedCryptCards = _.uniqBy(
            [...this.paginatedCryptCards, ...newCards.cards],
            "id"
          );
          this.pageNext = newCards.next;
        }
      },
      500,
      { leading: true }
    );
  },
  mounted() {
    this.$store.dispatch("crypt/setSelectedCards", []);
    if (this.getSignedZoombiesContract && this.addressToLoad) {
      this.fetchCryptCards();
    }

    MessageBus.$on("boosterOpened", this.boosterOpened);
  },
  data() {
    return {
      cardOriginData: {
        ALL: {
          value: "ALL",
          label: "All Cards",
        },
        STORE: {
          value: "STORE",
          label: "Store Cards",
        },
        BOOSTER: {
          value: "BOOSTER",
          label: "Booster Cards",
        },
      },
      selected: [], // Must be an array reference!
      options: [
        { text: "E", value: "epic" },
        { text: "R", value: "rare" },
        { text: "U", value: "uncommon" },
        { text: "C", value: "common" },
      ],
      cardsBeingGifted: {},
      cardsBeingSacrificed: {},
      isTableView: false,
      addressToSearch: null,
      disableSearch: true,
      isCardModified: false,
      pageSize: 15,
      paginatedCryptCards: [],
      modifiedPaginatedCryptCards: [],
      pageNext: 0,
      modifiedPageNext: 0,
      observer: null,
      filterBy: {
        [FILTER_TYPES.CARD_ORIGIN]: null,
        [FILTER_TYPES.CARD_RARITY]: [],
      },
      sortParam: null,
    };
  },
  computed: {
    ...mapGetters({
      getPaginatedCryptCards: "crypt/getPaginatedCryptCards",
      ownsCards: "crypt/getIfOwnsCards",
      isLoading: "crypt/isLoadingCrypt",
      isCryptLoaded: "crypt/isCryptLoaded",
      getReadOnlyZoombiesContract: "blockChain/getReadOnlyZoombiesContract",
      getSignedZoombiesContract: "blockChain/getSignedZoombiesContract",
      getWalletAddress: "blockChain/getWalletAddress",
    }),
    displayCards() {
      return this.isCardModified
        ? this.modifiedPaginatedCryptCards
        : this.paginatedCryptCards;
    },
    canLoadMore() {
      if (this.isCardModified) {
        return this.modifiedPageNext !== null;
      } else {
        return this.pageNext !== null;
      }
    },
    dAppState() {
      return this.$store.state.dAppState;
    },
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    addressToSearchState() {
      return ethers.utils.isAddress(this.addressToSearch);
    },
    tableFields() {
      if (this.isOthersCrypt) {
        return [
          "name",
          "minted_from",
          "card_level",
          "edition_number",
          "unlock_zoom",
          "sacrifice_zoom",
        ];
      } else {
        return [
          "name",
          "minted_from",
          "card_level",
          "edition_number",
          "unlock_zoom",
          "sacrifice_zoom",
          "sacrifice",
          "gift",
        ];
      }
    },
    tableButtonTooltip() {
      return this.isTableView || this.isOthersCrypt
        ? ""
        : "Use Table to Sacrifice multiple Zoombies at once";
    },
    getMyCryptLink() {
      let url;
      if (window.location.host === "moonbase.zoombies.world") {
        url = "https://moonbase.zoombies.world";
      } else if (process.env.NODE_ENV === "development") {
        url = "localhost:8080";
      } else {
        url = "https://movr.zoombies.world";
      }

      return `${url}/my-zoombies-nfts/${this.getWalletAddress}`;
    },
    isModified() {
      return {
        sortParam: this.sortParam,
        filterBy: this.filterBy,
      };
    },
    selectedCards() {
      return this.$store.state.crypt.selectedCryptCards;
    },
    cardOriginFilterLabel() {
      const originFilter = this.filterBy[FILTER_TYPES.CARD_ORIGIN];
      if (originFilter) return originFilter.label;
      return "Card Origin";
    },
  },
  watch: {
    cardsBeingSacrificed(val) {
      console.log({ cardsBeingSacrificed: val });
    },
    getSignedZoombiesContract(newVal) {
      if (newVal && this.addressToLoad && !this.isCryptLoaded) {
        this.fetchCryptCards();
      }
    },
    isWalletConnected(val) {
      if (val && !this.isCryptLoaded) {
        this.fetchCryptCards();
      }
    },
    addressToSearch: function (newVal, oldVal) {
      const isSearchAddressValid = ethers.utils.isAddress(newVal.toLowerCase());
      if (isSearchAddressValid) {
        this.disableSearch = false;
      } else {
        this.disableSearch = true;
      }
    },
    isModified: {
      handler: function (val) {
        const { filterBy, sortParam } = val;
        if (
          filterBy[FILTER_TYPES.CARD_ORIGIN] === null &&
          filterBy[FILTER_TYPES.CARD_RARITY].length === 0 &&
          sortParam === null
        ) {
          this.isCardModified = false;
        } else {
          this.isCardModified = true;
        }
      },
      deep: true,
    },
    addressToLoad: function (newVal, oldVal) {
      if (newVal && newVal !== oldVal && !this.isCryptLoaded) {
        this.fetchCryptCards();
      }
    },
    getWalletAddress: function (val, oldVal) {
      if (val && oldVal && val !== oldVal) {
        this.fetchCryptCards();
      }
    },
  },
  methods: {
    isActive(type, criteria) {
      switch (type) {
        case FILTER_TYPES.CARD_ORIGIN:
          return this.filterBy[FILTER_TYPES.CARD_ORIGIN] === criteria;
        case FILTER_TYPES.CARD_RARITY:
          return this.filterBy[FILTER_TYPES.CARD_RARITY].includes(criteria);
        default:
          return false;
      }
    },
    getRarityFilterActiveClass(rarity) {
      const isCurrentRarityFilterActive = this.isActive("RARITY", rarity);

      return isCurrentRarityFilterActive ? "filter-button-active" : null;
    },
    getSelectedCardCountByRarity(rarity) {
      return this.selectedCards.filter((card) => card.rarityValue === rarity)
        .length;
    },
    setOriginFilter: async function (criteria) {
      this.filterBy = {
        ...this.filterBy,
        [FILTER_TYPES.CARD_ORIGIN]: criteria,
      };

      await this.$store.dispatch("crypt/filterCryptCards", {
        sortParam: this.sortParam,
        filterBy: this.filterBy,
      });

      this.modifiedPageNext = 0;
      const newCards = this.getPaginatedCryptCards(
        this.pageSize,
        this.modifiedPageNext,
        this.isCardModified
      );

      if (newCards) {
        this.modifiedPaginatedCryptCards = [...newCards.cards];
        this.modifiedPageNext = newCards.next;
      } else {
        this.modifiedPaginatedCryptCards = [];
        this.modifiedPageNext = 0;
      }

      this.$store.dispatch("crypt/setSelectedCards", []);
    },
    setRarityFilter: async function (criteria) {
      this.$store.dispatch("crypt/setSelectedCards", []);
      if (this.filterBy[FILTER_TYPES.CARD_RARITY].includes(criteria)) {
        // remove it from filter by
        this.filterBy[FILTER_TYPES.CARD_RARITY] = this.filterBy[
          FILTER_TYPES.CARD_RARITY
        ].filter((rarity) => rarity !== criteria);
      } else {
        this.filterBy[FILTER_TYPES.CARD_RARITY].push(criteria);
      }

      await this.$store.dispatch("crypt/filterCryptCards", {
        sortParam: this.sortParam,
        filterBy: this.filterBy,
      });

      this.modifiedPageNext = 0;

      const newCards = this.getPaginatedCryptCards(
        this.pageSize,
        this.modifiedPageNext,
        this.isCardModified
      );

      if (newCards) {
        this.modifiedPaginatedCryptCards = [...newCards.cards];
        this.modifiedPageNext = newCards.next;
      } else {
        this.modifiedPaginatedCryptCards = [];
        this.modifiedPageNext = 0;
      }
    },
    addHashToLocation(params) {
      const currentPath = this.$route.path;
      const newPath = currentPath.substring(
        0,
        currentPath.indexOf("my-cryptoz-nfts")
      );
      history.pushState({}, null, newPath + `${params}`);
    },
    clearCards: function () {
      this.$store.dispatch("crypt/clearCards");
      this.pageNext = 0;
      this.modifiedPageNext = 0;
      this.paginatedCryptCards = [];
      this.modifiedPaginatedCryptCards = [];
    },
    toggleTableView: function () {
      this.$store.dispatch("crypt/setSelectedCards", []);
      const nextVal = !this.isTableView;
      this.isTableView = nextVal;
    },
    boosterOpened: function (newCard) {
      this.paginatedCryptCards.unshift(newCard);
      if (this.modifiedPaginatedCryptCards.length > 0) {
        this.modifiedPaginatedCryptCards.unshift(newCard);
      }
    },
    searchNewCrypt: function () {
      if (this.isOthersCrypt) {
        this.clearCards();
        this.addHashToLocation(`my-zoombies-nfts/${this.addressToSearch}`);
        this.fetchCryptCards();
        this.$emit("cryptChanged", this.addressToSearch);
      } else {
        this.navigateToNewCrypt();
      }
    },
    openGiftModal: function (id) {
      const h = this.$createElement;
      const titleVNode = h(
        "h5",
        `Gift Zoombies NFT Token #${id} to another address`,
        { class: ["modal-title"] }
      );
      const messageVNode = h("div", { class: ["modal-message"] }, [
        h("p", "Enter a valid Moonriver wallet address to send this card to:", {
          class: [""],
        }),
        h("input", {
          on: { input: (e) => (this.receivingWallet = e.target.value) },
          props: {
            id: "toWallet",
          },
          style: {
            width: "100%",
          },
        }),
      ]);
      // We must pass the generated VNodes as arrays
      this.$bvModal
        .msgBoxConfirm([messageVNode], {
          title: [titleVNode],
          buttonSize: "md",
          centered: true,
          size: "md",
          id: "gift-modal",
        })
        .then((value) => {
          if (value) {
            // user pressed ok
            this.transferCard(id);
          } else {
            // user canceled
          }
        })
        .catch((err) => {
          // An error occurred
          console.error(err);
        });
    },
    navigateToNewCrypt: function () {
      this.$router.push(`/my-zoombies-nfts/${this.addressToSearch}`);
    },
    fetchCryptCards: async function () {
      if (!this.isOthersCrypt && !this.isWalletConnected) {
        return;
      }

      this.clearCards();

      await this.$store.dispatch("crypt/loadCryptCards", {
        addressToLoad: this.addressToLoad,
        isOwnCrypt: !this.isOthersCrypt,
      });

      if (this.ownsCards) {
        const pageStart = this.isCardModified
          ? this.modifiedPageNext
          : this.pageNext;
        const newCards = this.getPaginatedCryptCards(
          this.pageSize,
          pageStart,
          this.isCardModified
        );

        if (this.isCardModified) {
          this.modifiedPaginatedCryptCards = [...newCards.cards];
          this.modifiedPageNext = newCards.next;
        } else {
          this.paginatedCryptCards = [...newCards.cards];
          this.pageNext = newCards.next;
        }
      }
    },
    sacrificeCards: async function (ids) {
      try {
        this.$store.dispatch("setIsTransactionPending", true);
        ids.forEach((id) => {
          Vue.set(this.cardsBeingSacrificed, id, true);
        });

        const sacrificeRes = await this.getSignedZoombiesContract.sacrificeNFTs(
          ids
        );
        this.$store.dispatch("setIsTransactionPending", false);
        await sacrificeRes.wait();
        if (sacrificeRes) {
          this.$store.dispatch("crypt/cardsSacrificed", { ids });
          this.paginatedCryptCards = this.paginatedCryptCards.filter(
            (card) => !ids.includes(card.id)
          );
          this.modifiedPaginatedCryptCards = this.modifiedPaginatedCryptCards.filter(
            (card) => !ids.includes(card.id)
          );
          showSuccessToast(this, "Card(s) sacrificed.");
        }
      } catch (err) {
        if (err.code !== 4001) {
          console.log(err);
          showErrorToast(this, "Failed to sacrifice card(s)");
        }
      } finally {
        ids.forEach((id) => {
          Vue.delete(this.cardsBeingSacrificed, id);
        });
      }
    },
    transferCard: async function (id) {
      try {
        Vue.set(this.cardsBeingGifted, id, true);
        this.$store.dispatch("setIsTransactionPending", true);

        const giftRes = await this.getSignedZoombiesContract.transferFrom(
          this.getWalletAddress,
          this.receivingWallet,
          id
        );

        this.$store.dispatch("setIsTransactionPending", false);

        await giftRes.wait();

        if (giftRes) {
          this.$store.dispatch("crypt/cardGifted", {
            id: id,
          });

          this.paginatedCryptCards = this.paginatedCryptCards.filter(
            (card) => card.id !== id
          );
          this.modifiedPaginatedCryptCards = this.modifiedPaginatedCryptCards.filter(
            (card) => card.id !== id
          );

          showSuccessToast(this, "Card Gifted.");
        }
      } catch (err) {
        if (err.code !== 4001) {
          console.log("Error: ", err);
        }
      } finally {
        Vue.set(this.cardsBeingGifted, id, false);
      }
    },
    confirmMassSacrifice: function () {
      this.isSacrificing = true;
      this.$bvModal.hide("mass-sacrifice-modal");
      this.sacrificeCards(this.selectedCards.map((card) => card.id));
    },
    sortByAttr: async function (param, isDescending) {
      this.$store.dispatch("crypt/setSelectedCards", []);
      if (!param) {
        this.sortParam = null;
      } else {
        this.sortParam = {
          param,
          isDescending,
        };
      }

      this.modifiedPageNext = 0;

      await this.$store.dispatch("crypt/sortCryptCards", {
        sortParam: this.sortParam,
        filterBy: this.filterBy,
      });

      const newCards = this.getPaginatedCryptCards(
        this.pageSize,
        this.modifiedPageNext,
        this.isCardModified
      );

      this.modifiedPaginatedCryptCards = [...newCards.cards];
      this.modifiedPageNext = newCards.next;
    },
    goBackToMyCrypt: function () {
      this.$router.push("/my-zoombies-nfts");
    },
    copyMyCryptLink: function () {
      const textToCopy = this.$refs.myCrypt.value;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showSuccessToast(this, "Link Copied.");
        })
        .catch((error) => {
          console.log("Copy Failed: ", error);
        });
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

        const dataIndex = target.getAttribute("data-index");
        const dataId = target.getAttribute("data-id");
        const index = dataIndex
          ? parseInt(dataIndex)
          : this.displayCards.findIndex((card) => card.id === parseInt(dataId));

        // if the 10th last card scrolls into view, load more
        if (index >= this.displayCards.length - 10) {
          if (this.canLoadMore) {
            this.loadMoreCards();
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
#button-container {
  display: flex;
  margin-bottom: 2rem;
  flex-direction: column;

  & button {
    white-space: nowrap !important;
  }
}

#view-change-button {
  margin-right: 0.5rem;
}

.loading {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 36px;
}

.wrapper {
  display: flex;
  flex-direction: column;
}

.crypt-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.filter-by-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.primary-actions {
  display: flex;
  justify-content: center;
}

.my-crypt-button {
  width: 300px;
  margin-bottom: 16px;
}

.crypt-search-input-group {
  max-width: 500px;
}

.card-bg {
  padding: 2px;
}

.card-bg-6 {
  background-color: rgba(84, 81, 97, 0.5);
  border: 2px solid rgb(84, 81, 97);
}

.card-bg-5 {
  background-color: rgba(43, 164, 250, 0.5);
  border: 2px solid rgb(43, 164, 250);
}

.card-bg-4 {
  background-color: rgba(202, 60, 44, 0.5);
  border: 2px solid rgb(202, 60, 44);
}

.card-bg-3 {
  background-color: rgba(87, 69, 229, 0.5);
  border: 2px solid rgb(87, 69, 229);
}

.sacrifice-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(0.55 * 260px), 1fr));
  place-items: center;
}

.modifier-wrapper {
  display: flex;
  flex-direction: column;
}

.filter-button-active {
  font-weight: 800px;
  transform: translateY(1px);
  outline: none;
  -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
  -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
  box-shadow: inset 0px 0px 5px #c1c1c1;
}

.btn-epic {
  color: #fff;
  background-color: #b92ee4;
  border-color: #b92ee4;
}

.btn-rare {
  color: #fff;
  background-color: #d5005a;
  border-color: #d5005a;
}

.btn-uncommon {
  color: #fff;
  background-color: #03c1e8;
  border-color: #03c1e8;
}

.btn-common {
  color: #fff;
  background-color: #585858;
  border-color: #585858;
}

/* Desktop CSS */
@media only screen and (min-width: 1300px) {
  #button-container {
    flex-direction: row;
    justify-content: space-between;
  }

  .modifier-wrapper {
    display: flex;
    flex-direction: row;
  }

  .filter-by-wrapper {
    margin: 0;
    width: fit-content;
    margin-left: 8px;
  }

  .crypt-actions {
    flex-direction: row;
    justify-content: initial;
    align-items: flex-start;
  }

  .my-crypt-button {
    width: 300px;
    margin-bottom: 0;
    margin-right: 16px;
  }
}
@media only screen and (min-width: 1000px) {
  .cards-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
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

.filter-rarity-wrapper {
  margin-left: 10px;
}

.table {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 4px 4px 0 4px;
}

.mass-sac {
  font-weight: 700;
  box-shadow: 0 4px 5px -5px gray;
  padding: 10px 15px;
  margin-bottom: 5px;
  height: 55px;
  display: flex;
  align-items: center;

  svg {
    stroke-width: 2;
    margin-right: 15px;
  }
}

.mass-sac-modal-footer {
  display: flex;
  align-items: flex-end;

  button {
    margin-left: 16px;
  }
}

.common {
  color: #585858;
}

.uncommon {
  color: #03c1e8;
}

.rare {
  color: #d5005a;
}

.epic {
  color: #b92ee4;
}
</style>
