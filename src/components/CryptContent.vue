<template>
  <div>
    <div>
      <!-- Open Booster Modal -->
      <b-modal
        id="open-booster-modal"
        title="Enter a ZOOM burn wager amount to increase the probabilty of pulling better rarity:"
        ok-variant="danger"
        ok-title="Open Booster"
        hide-footer
      >
        <div>Default probability for a 0 ZOOM wager</div>

        <b-progress show-progress :max="pBarMax" height="30px" class="mb-3">
          <b-progress-bar
            v-b-tooltip.hover="`0.01% chance to pull an Epic`"
            class="p-bar-purple"
            :value="pBarDefaultValues[0]"
          ></b-progress-bar>
          <b-progress-bar
            v-b-tooltip.hover="`${pBarDefaultValues[1]}% chance to pull a Rare`"
            variant="danger"
            :value="pBarDefaultValues[1]"
          ></b-progress-bar>
          <b-progress-bar
            v-b-tooltip.hover="
              `${pBarDefaultValues[2]}% chance to pull an Uncommon`
            "
            variant="primary"
            :value="pBarDefaultValues[2]"
          ></b-progress-bar>
          <b-progress-bar
            v-b-tooltip.hover="
              `${pBarDefaultValues[3]}% chance to pull a Common`
            "
            variant="secondary"
            :value="pBarDefaultValues[3]"
          ></b-progress-bar>
        </b-progress>

        <div>
          <b>To wager:</b>
          <br />Minimum = 1,000,000<br />
          Maximum = 20,000,000
        </div>
        <b-form-input
          v-model="wagerAmount"
          class="form-control"
          :state="isWagerValid"
          required
          type="range"
          min="0"
          max="20000000"
          step="1"
          @input="calculateProbability"
        />
        <b-form-input
          v-model="wagerAmount"
          class="form-control"
          :state="isWagerValid"
          required
          type="number"
          @input="calculateProbability"
        />
        <b-form-invalid-feedback v-if="isWagerValid">
          <div>
            You need to enter a number between 1,000,000 and 20,000,000 to
            wager.
          </div>
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!hasEnoughCZXP">
          <div>You do not have enough ZOOM tokens</div>
        </b-form-invalid-feedback>

        <b-row>
          <b-col>
            <b-progress show-progress :max="pBarMax" height="30px" class="mb-3">
              <b-progress-bar
                v-b-tooltip.hover="
                  wagerAmount == 0
                    ? `0.01% chance to pull an Epic`
                    : `${
                        pBarWagerValues[0].toFixed(2) / 1
                      }% chance to pull an Epic`
                "
                class="p-bar-purple"
                :value="wagerAmount == 0 ? 1 : pBarWagerValues[0]"
              ></b-progress-bar>
              <b-progress-bar
                v-b-tooltip.hover="
                  `${pBarWagerValues[1].toFixed(2) / 1}% chance to pull a Rare`
                "
                variant="danger"
                :value="pBarWagerValues[1]"
              ></b-progress-bar>
              <b-progress-bar
                v-b-tooltip.hover="
                  `${
                    pBarWagerValues[2].toFixed(2) / 1
                  }% chance to pull an Uncommon`
                "
                variant="primary"
                :value="pBarWagerValues[2]"
              ></b-progress-bar>
              <b-progress-bar
                v-b-tooltip.hover="
                  `${
                    pBarWagerValues[3].toFixed(2) / 1
                  }% chance to pull a Common`
                "
                variant="secondary"
                :value="pBarWagerValues[3]"
              ></b-progress-bar>
            </b-progress>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-button
              v-b-tooltip.hover="'Open Booster'"
              class="mt-3"
              variant="danger"
              block
              :disabled="!isWagerValid"
              @click="openBooster"
            >
              Mint random NFT
            </b-button>
          </b-col>
          <b-col>
            <b-button
              class="mt-3"
              block
              @click="$bvModal.hide('open-booster-modal')"
            >
              Cancel
            </b-button>
          </b-col>
        </b-row>
        <span class="text-danger"><strong>NOTE:</strong></span> ZOOM is burned
        permanently when you wager
      </b-modal>
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

      <b-modal
        id="open-probability-modal"
        title="Booster Minting Probability by Rarity"
        header-bg-variant="warning"
        centered
        hide-footer
        size="lg"
      >
        <div class="probablity-modal">
          <h4>
            The base probabilities of minting by rarity are hard coded in the
            Zoombies contract and will never change
          </h4>
          <div class="cards-image-container">
            <div class="booster-card-wrapper">
              <img
                src="https://zoombies.world/images/dapp/zoombies_card_epic_purple.svg"
              />
              <span class="rarity-text">Epic</span>
              <span class="prob-text">0.01%</span>
            </div>
            <div class="booster-card-wrapper">
              <img
                src="https://zoombies.world/images/dapp/zoombies_card_rare_red.svg"
              />
              <span class="rarity-text">Rare</span>
              <span class="prob-text">4.98%</span>
            </div>
            <div class="booster-card-wrapper">
              <img
                src="https://zoombies.world/images/dapp/zoombies_card_uncommon_blue.svg"
              />
              <span class="rarity-text uncommon">Uncommon</span>
              <span class="prob-text">29.9%</span>
            </div>
            <div class="booster-card-wrapper">
              <img
                src="https://zoombies.world/images/dapp/zoombies_card_common_brown.svg"
              />
              <span class="rarity-text common">Common</span>
              <span class="prob-text">64.9%</span>
            </div>
          </div>
        </div>
      </b-modal>

      <div>
        <UniverseBalances :is-in-own-crypt="true" />

        <h1>Your NFT Crypt</h1>
        <p>
          This is where all your NFT Zoombies tokens can be accessed. Sort,
          search, gift and sacrifice. Sacrificing is permanent, not only in your
          wallet but across the entire Zoombies World. That unique NFT is burned
          forever.
        </p>

        <!-- Loads cards here -->
        <div v-if="isWalletConnected" class="action-buttons">
          <div class="left-buttons">
            <b-button
              v-b-tooltip.hover="'Mint 1 random booster NFT'"
              v-b-modal="'open-booster-modal'"
              class="mint-booster-btn btn btn-danger"
              :disabled="getBoosterCreditOwned < 1"
            >
              <span class="booster-counter">
                {{ getBoosterCreditOwned }}
                <b-icon-lightning-fill />
              </span>
              Mint Booster NFT
            </b-button>
            <OwnerBalances />
          </div>
          <div class="right-buttons">
            <b-button
              id="buy-boosters-btn"
              v-b-tooltip.hover="'Earn +500 ZOOM per credit'"
              v-b-modal.buy-boosters-modal
              class="buy-and-open-booster btn btn-danger"
              :disabled="getBalance < 0.02 || isBuyingBooster"
            >
              Buy <b-icon-lightning-fill /> Booster NFT Credits @ 0.01 Each
              <img src="../assets/movr_logo.png" class="mr-icon" />
            </b-button>
            <b-button
              v-b-tooltip.hover="'Mint 1 random booster NFT +500 ZOOM'"
              class="buy-and-open-booster btn btn-dange"
              :disabled="getBalance < 0.02"
              @click="buyAndOpenBooster"
            >
              Buy and Mint <b-icon-lightning-fill /> Booster NFT 0.01
              <img src="../assets/movr_logo.png" class="mr-icon" />
            </b-button>
          </div>
        </div>
        <br />
        <div class="cards-wrapper">
          <cards-container
            :is-others-crypt="false"
            :address-to-load="getWalletAddress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UniverseBalances from "@/components/UniverseBalances.vue";
import OwnerBalances from "@/components/OwnerBalances.vue";
import CardsContainer from "./CardsContainer.vue";
import {
  BFormInput,
  BFormInvalidFeedback,
  BRow,
  BCol,
  BButton,
  BProgress,
  BProgressBar,
} from "bootstrap-vue";
import { showErrorToast } from "../util/showToast";
import dAppStates from "@/dAppStates";
import { MessageBus } from "@/messageBus";
import { mapGetters } from "vuex";
import { ethers } from "ethers";

export default {
  name: "CryptContent",
  components: {
    UniverseBalances,
    OwnerBalances,
    CardsContainer,
    BFormInput,
    BFormInvalidFeedback,
    BRow,
    BCol,
    BButton,
    BProgress,
    BProgressBar,
  },
  data() {
    return {
      wagerAmount: 0,
      receivingWallet: "",
      pBarDefaultValues: [1, 4.999, 29.999, 64.999],
      pBarWagerValues: [1, 4.99, 29.9, 64.9],
      pBarMax: 100,
      isBuyingBooster: false,
      totalCreditsToBuy: 1,
    };
  },
  computed: {
    ...mapGetters({
      getBalance: "blockChain/getBalance",
      getWalletAddress: "blockChain/getWalletAddress",
      getSignedZoombiesContract: "blockChain/getSignedZoombiesContract",
      getZoomBalance: "blockChain/getZoomBalance",
      getBoosterCreditOwned: "blockChain/getBoosterCreditOwned",
    }),
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    isWagerValid() {
      const wagerAmount = parseInt(this.wagerAmount);
      if (wagerAmount === 0) {
        return true;
      }

      if (this.getZoomBalance < wagerAmount) {
        return false;
      }

      return wagerAmount >= 1000000 && wagerAmount <= 20000000;
    },
    hasEnoughCZXP() {
      const wagerAmount = parseInt(this.wagerAmount);
      if (wagerAmount > 0) {
        return this.getZoomBalance > wagerAmount;
      }

      return true;
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
  },
  watch: {
    getWalletAddress(val, oldVal) {
      if (val !== oldVal) {
        this.$bvModal.hide("gift-modal");
        this.$bvModal.hide("open-booster-modal");
      }
    },
  },
  methods: {
    buyBoosters: async function () {
      try {
        this.$bvModal.hide("buy-boosters-modal");
        this.isBuyingBooster = true;
        this.showTransactionModal();
        var totalBoostersCost = ethers.utils
          .parseEther((0.01 * parseInt(this.totalCreditsToBuy)).toString())
          .toString();

        const res = await this.getSignedZoombiesContract.buyBoosterCredits(
          parseInt(this.totalCreditsToBuy),
          {
            value: totalBoostersCost.toString(),
          }
        );

        this.hideTransactionModal();

        await res.wait();
      } catch (error) {
        console.error(error);
        if (error.code !== 4001) {
          showErrorToast(this, "Failed to get booster credit");
        }
      } finally {
        this.isBuyingBooster = false;
      }
    },
    setLastMintTime() {
      const nowSec = Date.now() / 1000;
      localStorage.setItem("lastMintTime", nowSec);
    },
    buyAndOpenBooster: async function () {
      try {
        this.$store.dispatch("setIsTransactionPending", true);
        this.setLastMintTime();
        const res = await this.getSignedZoombiesContract.buyBoosterAndMintNFT({
          value: "10000000000000000",
        });
        this.$store.dispatch("setIsTransactionPending", false);
        await res.wait();
      } catch (err) {
        console.error(err);
        showErrorToast(this, "Failed to buy/open booster");
      } finally {
        this.$bvModal.hide("open-booster-modal");
      }
    },
    openBooster: async function () {
      this.setLastMintTime();
      try {
        this.$store.dispatch("setIsTransactionPending", true);
        this.$bvModal.hide("open-booster-modal");

        const res = await this.getSignedZoombiesContract.mintBoosterNFT(
          this.wagerAmount
        );
        this.$store.dispatch("setIsTransactionPending", false);
        await res.wait();
      } catch (err) {
        console.error(err);
        showErrorToast(this, "Failed to open booster");
      }
    },
    showTransactionModal() {
      this.$store.dispatch("setIsTransactionPending", true);
    },
    hideTransactionModal() {
      this.$store.dispatch("setIsTransactionPending", false);
    },
    calculateProbability: function () {
      if (this.wagerAmount < 1000000 || this.wagerAmount > 20000000) {
        this.wagerAmount = 0;
        this.pBarWagerValues = this.pBarDefaultValues;
        return;
      }

      let e = 1 + this.wagerAmount / 20000;
      let r = 500 + e + this.wagerAmount / 5500;
      let u = 3500 + r + this.wagerAmount / 8000;

      let eP = (e / 10000) * 100;
      let rP = Math.floor(((r - e) / 10000) * 100);
      let uP = Math.floor(((u - r) / 10000) * 100);
      let cP = 100 - (eP + rP + uP);

      if (cP < 0) {
        cP = 0;
        uP = 100 - (eP + rP);
      }

      this.pBarWagerValues = [eP, rP, uP, cP];
    },
  },
};
</script>

<style scoped lang="scss">
button {
  white-space: nowrap !important;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  button {
    height: 50px;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media screen and (min-width: 685px) {
    flex-direction: row;
    justify-content: space-between;
  }

  div {
    margin: 6px;
  }

  .left-buttons {
    display: flex;
    align-items: center;

    .booster-counter {
      position: relative;
      border-radius: 50%;
      background: white;
      border: 2px solid black;
      padding: 0 2px 0 4px;
      color: black;
      margin-right: 15px;

      svg {
        position: absolute;
        right: 0;
        top: 7%;
        transform: translateX(65%);
      }
    }
  }

  .right-buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    button {
      margin: 2px 0;
    }
  }
}

@media screen and (max-width: 950px) {
  .action-buttons {
    flex-direction: column;

    .left-buttons {
      flex-direction: column;
    }
  }
}

.buy-and-open-booster {
  display: flex;
  background-color: transparent;
  background-image: url("assets/pink_button_wide.png");
  background-size: 100% 100%;
  border: none;
  color: #111;
  font-weight: 650;
  padding: 10px 14px;
}

#open-booster-modal div {
  margin-bottom: 10px;
}

.cards-wrapper {
  margin-top: 24px;
}

.cards-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 800px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .booster-card-wrapper {
    position: relative;
    width: 250px;

    @media screen and (min-width: 800px) {
      width: 300px;
    }

    img {
      width: 100%;
    }

    .rarity-text {
      color: white;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      position: absolute;
      right: 41%;
      top: 61%;

      @media screen and (min-width: 800px) {
        right: 43%;
      }
    }

    .prob-text {
      color: white;
      font-size: 48px;
      position: absolute;
      top: 26%;
      left: 28%;
      text-align: center;

      @media screen and (min-width: 800px) {
        top: 30%;
        left: 30%;
      }
    }

    .uncommon {
      right: 24%;

      @media screen and (min-width: 800px) {
        right: 28%;
      }
    }
    .common {
      right: 32%;

      @media screen and (min-width: 800px) {
        right: 34%;
      }
    }
  }
}

.probablity-modal {
  padding: 0 12px;
  width: 100%;

  h4 {
    text-align: center;
    margin-bottom: 16px;
  }
}

.mint-booster-btn {
  background-color: transparent;
  background-image: url("assets/pink_button_wide.png");
  background-size: 100% 100%;
  border: none;
  color: #111;
  font-weight: 650;
  padding: 10px 14px;

  &.disabled {
    color: #444;
  }
}

.mr-icon {
  height: 20px;
  margin-left: 5px;
}

.b-progress-bar-purple {
  background-color: #b92ee4;
  color: red;
}
.p-bar-purple {
  background-color: var(--purple);
}
</style>
