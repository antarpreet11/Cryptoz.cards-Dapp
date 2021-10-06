<template>
  <div class="app-header">
    <b-modal
      v-if="isWalletConnected"
      id="sponsor-modal"
      size="lg"
      title="Sponsor Link"
      hide-footer
    >
      <b-jumbotron class="jumbo" :lead="sponsorTitle">
        <p>
          By linking your sponsor's wallet address, you will mint a
          <b>Free Platinum Sponsored NFT Card immediately !</b>
        </p>
        <p class="sponsor-warning" variant="info">
          Note: You can only link sponsor once
        </p>
        <b-input-group v-if="shouldShowSponsor" size="lg">
          <b-form-input
            v-model="sponsorAddress"
            :state="isSponsorValid"
            required
            type="text"
            placeholder="Enter Address"
          />
          <b-input-group-append>
            <b-button
              variant="success"
              :disabled="!isSponsorValid || sponsorAddress === ''"
              @click="linkSponsor"
            >
              Link
            </b-button>
          </b-input-group-append>
          <div v-if="sponsorAddress !== ''">
            <b-form-invalid-feedback v-if="!isSponsorValid">
              <div>Please enter a valid address.</div>
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="isSameSponsor">
              <div>You can't link your own wallet.</div>
            </b-form-invalid-feedback>
          </div>
        </b-input-group>
        <b-alert v-else variant="success" show>
          You are already linked to sponsor wallet.
        </b-alert>
      </b-jumbotron>

      <div v-if="queryHasSponsor && !showShareMyLink" class="platinum-card">
        <b-jumbotron class="platinum-jumbotron">
          <div class="platinum-card-wrapper">
            <img
              src="https://zoombies.world/images/dapp/zoombies_card_platinum.svg"
            />
            <span class="question-mark">?</span>
          </div>
        </b-jumbotron>
      </div>

      <b-jumbotron
        v-else
        id="sponsor-link-wrapper"
        class="jumbo"
        lead="Your Affiliate Link"
      >
        <p>
          Automatically earn ZOOM
          <img
            class="czxp-logo"
            src="https://zoombies.world/images/zoombies_coin.svg"
            align="middle"
          />
          Token rewards from your affiliate network
        </p>
        <p>Copy the link by clicking the button below.</p>
        <p>
          Send the link to your friends so they can mint a
          <b>Free Platinum Sponsored Card</b>
        </p>
        <input
          id="sponsor-link"
          ref="sponsor"
          hidden
          :value="getSponsorRoute"
        />
        <div class="button-wrapper">
          <a :href="getTweet" data-size="large">
            <b-button variant="primary" class="affiliate-button"
              ><img
                style="width: 30px"
                src="https://utilitypeopleuk.com/wp-content/uploads/2017/06/twitter-icon-circle-blue-logo-preview.png"
              />
              Tweet your link</b-button
            >
          </a>
          <b-button class="affiliate-button" @click="copySponsorLink">
            Copy Link To Clipboard
          </b-button>
          <div class="telegram-link">
            <script
              async
              type="application/javascript"
              src="https://telegram.org/js/telegram-widget.js?15"
              :data-telegram-share-url="getTelegramLink"
              data-comment="Click my Zoombies Moonriver sponsor link to claim your Free Platinum NFT now!"
              data-size="large"
            ></script>
          </div>
          <!-- Open in Metamask mobile
          <a href="https://metamask.app.link/dapp/movr.zoombies.world">Open in Metamask</a>
        --></div>
      </b-jumbotron>

      <div v-if="queryHasSponsor" class="prev-next-buttons">
        <b-button
          :style="{ visibility: showShareMyLink ? 'visible' : 'hidden' }"
          size="lg"
          variant="link"
          @click="previousSponsorModalAction"
          >Previous</b-button
        >
        <b-button
          :style="{ visibility: showShareMyLink ? 'hidden' : 'visible' }"
          size="lg"
          variant="link"
          @click="nextSponsorModalAction"
          >Skip</b-button
        >
      </div>
    </b-modal>
    <div class="app-menu-bar">
      <router-link to="/">
        <img
          class="zoombie-logo"
          alt="Zoombies World Logo"
          src="@/assets/zoombies_logo.svg"
        />
      </router-link>
      <ul class="app-menu-bar-items">
        <li>
          <button
            v-b-modal.sponsor-modal
            class="header-item affiliate-header"
            aria-label="Open affiliate modal"
          >
            Affiliate
          </button>
        </li>
        <li>
          <router-link class="header-item shop-header" to="/shop">
            Shop
          </router-link>
        </li>
        <li>
          <router-link class="header-item aqua-header" to="/my-zoombies-nfts">
            Your NFT Crypt
          </router-link>
        </li>
        <li>
          <router-link class="header-item aqua-header" to="/market">
            Markets
          </router-link>
        </li>
        <li>
          <router-link class="header-item white-header" to="/view/1">
            View
          </router-link>
        </li>
        <li>
          <router-link class="header-item white-header" to="/help">
            Help
          </router-link>
        </li>
        <li>
          <router-link class="header-item white-header" to="/feedback">
            Feedback
          </router-link>
        </li>
        <div class="desktop-bonus">
          <div
            v-if="isWalletConnected && bonusReady && showSpinner == false"
            class="bonusClass"
            @click="GetBonus"
          >
            Claim 2 FREE Boosters!
          </div>
          <div v-else-if="isWalletConnected && showSpinner == true">
            <b-spinner
              style="width: 1.5rem; height: 1.5rem"
              type="grow"
              variant="light"
            />
            <transition>
              <span class="spinner-text-style">
                {{ transactionMessage }}</span
              >
            </transition>
          </div>
          <div
            v-else-if="
              isWalletConnected &&
              !bonusReady &&
              timeToBonus &&
              showSpinner == false
            "
            class="bonusClassNo"
          >
            <span>Your Next Bonus: </span>
            <strong class="time-to-bonus">{{ timeToBonus }}</strong>
          </div>
        </div>
      </ul>
      <div
        aria-label="hamburger menu"
        class="hamburger-menu"
        @click="toggleMobileDropdown"
      >
        <img src="@/assets/button_menu.svg" />
      </div>
    </div>
    <div class="wallet-info" v-if="isWalletConnected">
      <img src="@/assets/metamask-face.png" class="header-icon" />
      <span
        v-b-tooltip.hover.bottom
        :title="coinbase"
      >
        {{ coinbase.substr(0, 6) + "..." + coinbase.substr(38) }}
      </span>
      <div
        id="wallet-balance"
        v-b-tooltip.hover.bottom
        :title="ethBalance"
      >
        <img
          v-if="onMainNet"
          src="https://zoombies.world/images/mr-icon.png"
          class="header-icon"
        />
        <span
          >{{
            onMainNet ? ethBalance.toFixed(4) : ethBalance.toFixed(3) + " DEV"
          }}
        </span>
      </div>
    </div>
    <b-button
      v-if="!isWalletConnected"
      v-b-toggle.nav-collapse
      variant="warning"
      @click="$emit('connect')"
      class="desktop-connect-btn"
    >
      Connect To {{ onMainNet ? "Moonriver" : "Moonbase" }}
    </b-button>
    <div
      ref="mobileDropdown"
      :class="{'mobile-dropdown': true, 'dropdown-hidden': !isMobileDropdownOpen}"
    >
      <b-button
        v-if="!isWalletConnected"
        v-b-toggle.nav-collapse
        variant="warning"
        @click="$emit('connect')"
      >
        Connect To {{ onMainNet ? "Moonriver" : "Moonbase (testnet)" }}
      </b-button>
      <div class="mobile-wallet-info" v-if="isWalletConnected">
        <img src="@/assets/metamask-face.png" class="header-icon" />
        <span
          v-b-tooltip.hover="{ customClass: 'tooltip-1' }"
          :title="coinbase"
        >
          {{ coinbase.substr(0, 6) + "..." + coinbase.substr(38) }}
        </span>
        <div
          id="wallet-balance"
          v-b-tooltip.hover="{ customClass: 'tooltip-2' }"
          :title="ethBalance"
        >
          <img
            v-if="onMainNet"
            src="https://zoombies.world/images/mr-icon.png"
            class="header-icon"
          />
          <span
            >{{
              onMainNet ? ethBalance.toFixed(4) : ethBalance.toFixed(3) + " DEV"
            }}
          </span>
        </div>
      </div>
      <ul>
        <li class="mobile-bonus">
          <div
            v-if="isWalletConnected && bonusReady && showSpinner == false"
            class="bonusClass"
            @click="GetBonus"
          >
            Claim 2 FREE Boosters!
          </div>
          <div v-else-if="isWalletConnected && showSpinner == true">
            <b-spinner
              style="width: 1.5rem; height: 1.5rem"
              type="grow"
              variant="light"
            />
            <transition>
              <span class="spinner-text-style">
                {{ transactionMessage }}</span
              >
            </transition>
          </div>
          <div
            v-else-if="
              isWalletConnected &&
              !bonusReady &&
              timeToBonus &&
              showSpinner == false
            "
            class="bonusClassNo"
          >
            Your Next Bonus: <strong>{{ timeToBonus }}</strong>
          </div>
        </li>
        <li @click="toggleMobileDropdown"><button v-b-modal.sponsor-modal class="affiliate-btn aqua-header">Affiliate</button></li>
        <li @click="toggleMobileDropdown"><router-link to="/shop" class="aqua-header">Shop</router-link></li>
        <li @click="toggleMobileDropdown"><router-link to="/my-zoombies-nfts" class="aqua-header">Your NFT Crypt</router-link></li>
        <li @click="toggleMobileDropdown"><router-link to="/market" class="aqua-header">Markets</router-link></li>
        <li><img class="brain" src="@/components/assets/brain.svg" /></li>
        <li @click="toggleMobileDropdown"><router-link to="/view/1" class="white-header">View</router-link></li>
        <li @click="toggleMobileDropdown"><router-link to="/help" class="white-header">Help</router-link></li>
        <li @click="toggleMobileDropdown"><router-link to="/feedback" class="white-header">Feedback</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { showSuccessToast, showErrorToast } from "../../util/showToast";
import { isAddress } from "../../util/addressUtil";
import moment from "moment";
import dAppStates from "@/dAppStates";
import {
  BModal,
  BJumbotron,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BFormInvalidFeedback,
  BAlert,
  BButton,
} from "bootstrap-vue";

const baseAddress = "0x0000000000000000000000000000000000000000";

export default {
  name: "AppHeader",
  emits: ["connect"],

  components: {
    BModal,
    BJumbotron,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BFormInvalidFeedback,
    BAlert,
    BButton,
  },
  computed: {
    classObject: function () {
      //Style the link colours
      //const chainId = getChainId();
      //switch (this.chainId) {
      //    case 0x38:
      //  case 0x61:
      //      return "bsc-link";
      //    default:
      return "eth-link";
      //  }
    },
    CryptozInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    dAppState() {
      return this.$store.state.dAppState;
    },
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    ethBalance() {
      const balance = this.$store.state.web3.balance;
      if (balance !== null) {
        return parseFloat(web3.utils.fromWei(balance.toString()));
      }
      return null;
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    },
    getSponsorRoute() {
      let url;

      if (window.location.host === "moonbase.zoombies.world") {
        url = "https://moonbase.zoombies.world";
      } else if (process.env.NODE_ENV === "development") {
        url = "localhost:8080";
      } else {
        url = "https://movr.zoombies.world";
      }

      return `${url}?sponsor=${this.coinbase}`;
    },
    sponsorTitle() {
      return this.mySponsor
        ? `My Sponsor is ${this.mySponsor}`
        : "Link Your Sponsor";
    },
    getTweet() {
      return `https://twitter.com/intent/tweet?text=Click%20my%20sponsor%20link%20to%20claim%20Your%20Free%20Platinum%20Zoombies%20NFT%20Now!%0D%0A%0D%0A&hashtags=moonriver,nft,ZWorldNFT,NFTCommunity,nftcollectors,nftart,cryptoart&url=${this.getSponsorRoute}%0D%0A%0D%0A&related=CryptozNFT&via=CryptozNFT`;
    },
    getTelegramLink() {
      return `https://movr.zoombies.world/?sponsor=${this.coinbase}`;
    },
    isSponsorValid() {
      if (this.sponsorAddress === "") {
        return true;
      }

      if (this.sponsorAddress.toLowerCase() === this.coinbase.toLowerCase()) {
        return false;
      }

      return isAddress(this.sponsorAddress.toLowerCase());
    },
    isSameSponsor() {
      return this.sponsorAddress.toLowerCase() === this.coinbase.toLowerCase();
    },
  },
  data() {
    return {
      pendingTransaction: 0,
      showSpinner: false,
      notSameSponsorError: true,
      transactionMessage: "Pending confirmation...",
      showLogin: 1,
      bonusReady: false,
      timeToBonus: 0,
      sponsorAddress: "",
      shouldShowSponsor: true,
      mySponsor: null,
      queryHasSponsor: false,
      showShareMyLink: false,
      onMainNet: false,
      isMobileDropdownOpen: false,
    };
  },
  watch: {
    isWalletConnected(value) {
      if (value) {
        this.checkSponsor(this.coinbase);
      }
    },
    currentEvent(newValue, oldValue) {
      if (newValue !== oldValue && typeof newValue !== "undefined") {
        if (this.pendingTransaction == newValue.blockHash) {
          this.showSpinner = false;
          this.transactionMessage = "Confirmed! Balance updated";
        }
        this.getDailyBonusTime();
      }
    },
    coinbase(value) {
      this.getDailyBonusTime();
      if (value) {
        this.checkSponsor(value);
      }
    },
    $route(to) {
      if (!to.query.sponsor) {
        this.queryHasSponsor = false;
        this.sponsorAddress = "";
      }
    },
  },
  mounted() {
    if (window.location.host == "movr.zoombies.world") {
      this.onMainNet = true;
    } else {
      this.onMainNet = false;
    }
    this.getDailyBonusTime();
  },
  methods: {
    toggleMobileDropdown: function () {
      if (this.isMobileDropdownOpen) {
        this.isMobileDropdownOpen = false;
      } else {
        this.isMobileDropdownOpen = true;
      }
    },
    nextSponsorModalAction: function () {
      this.showShareMyLink = true;
    },
    previousSponsorModalAction: function () {
      this.showShareMyLink = false;
    },
    checkSponsor: async function (address) {
      if (this.CryptozInstance && address) {
        const sponsor = await this.CryptozInstance.methods
          .sponsors(address)
          .call();
        this.mySponsor = parseInt(sponsor, 16) ? sponsor : null;
        if (sponsor && sponsor !== baseAddress) {
          this.shouldShowSponsor = false;
        } else {
          if (this.$route.query.sponsor) {
            this.sponsorAddress = this.$route.query.sponsor;
            this.queryHasSponsor = true;
            this.$bvModal.show("sponsor-modal");
          }
        }
      }
    },
    linkSponsor: async function () {
      this.$store.dispatch("setIsTransactionPending", true);
      const result = await this.CryptozInstance.methods
        .linkMySponsor(this.sponsorAddress)
        .send({ from: this.coinbase }, (err, transactionHash) => {
          this.$store.dispatch("setIsTransactionPending", false);
        })
        .catch((err) => {
          if (err.code !== 4001) {
            console.log(err);
            showErrorToast(this, "Failed to link sponsor.");
          }
        });

      if (result) {
        showSuccessToast(this, "Sponsor linked!");
        this.shouldShowSponsor = false;
        this.mySponsor = this.sponsorAddress;
        this.nextSponsorModalAction();
      }
    },
    copySponsorLink: function () {
      const textToCopy = this.$refs.sponsor.value;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showSuccessToast(this, "Link Copied.");
        })
        .catch((error) => {
          console.log("Copy Failed: ", error);
        });
    },
    getDailyBonusTime: async function () {
      if (this.CryptozInstance && this.coinbase) {
        const res = await this.CryptozInstance.methods
          .getTimeToDailyBonus(this.coinbase)
          .call();

        var timeOfNextBonusInMilli = parseInt(res) * 1000;
        var now = new Date();

        if (now.getTime() >= timeOfNextBonusInMilli) {
          this.bonusReady = true; //Claim bonus state
        } else {
          this.bonusReady = false;
          this.timeToBonus = this.GetTimeString(timeOfNextBonusInMilli);
        }
      }
    },
    GetBonus: async function () {
      this.showSpinner = true;
      this.transactionMessage = "Pending confirmation...";
      this.$store.dispatch("setIsTransactionPending", true);

      const result = await this.CryptozInstance.methods
        .getBonusBoosters(this.coinbase)
        .send({ from: this.coinbase }, (err, transactionHash) => {
          this.pendingTransaction = transactionHash;
          if (err) {
            this.showSpinner = false;
            this.transactionMessage = "Claim 2 FREE Boosters!";
          } else {
            this.transactionMessage = "Broadcast to chain...";
          }
          this.$store.dispatch("setIsTransactionPending", false);
        })
        .catch((e) => {
          this.showSpinner = false;
          this.transactionMessage = "Claim 2 FREE Boosters!";
        });

      this.showSpinner = false;
      if (result) {
        this.getDailyBonusTime();
      }
    },
    GetTimeString: function (_timeStamp) {
      return moment(_timeStamp).format("MMM D, h:mm a");
    },
  },
};
</script>

<style scoped lang="scss">
// Dropdowns
.mobile-dropdown {
  position: absolute;
  bottom: 7px;
  z-index: 3;
  width: 90%;
  transform: translateY(100%);
  display: none;
  height: 350px;
  background-image: url('../assets/space_bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: right;
  background-position-y: bottom;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border: 2px solid #888;
  overflow: hidden;
  text-align: center;
  transition: all 0.5s ease;
  padding: 20px;
  
  .mobile-wallet-info {
    display: flex;
    color: orange;
    font-size: 14px;
    margin: 10px 0;

    .header-icon {
      width: 24px;
      height: 18px;
    }
  }

  .bonusClassNo {
    color: #f7162c;

    strong {
      font-weight: 500;
    }
  }

  .affiliate-btn {
    :hover {
      text-decoration: underline;
    }

    background: none;
    border: none;
    padding: 0;
  }

  ul {
    margin-bottom: 0;
  }

  li {
    padding: 2px 0;
    display: block;

    :not(.bonusClassNo):hover {
      text-decoration: underline;
    }
  }

  .brain {
    width: 35px;
    padding: 10px 0;
  }
}

.dropdown-hidden {
  height: 0;
  display: hidden;
  border: none;
  padding-top: 0;
  padding-bottom: 0;
}

.desktop-connect-btn {
  margin: 5px;
  width: 200px;
}

.hamburger-menu {
  cursor: pointer;
  display: none;
}

.app-header {
  padding: 16px 0 0 0;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 90%;
  max-width: 1500px;
  margin: 0 auto;
}

.wallet-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #d48b15;
  margin-bottom: 8px;
  padding-right: 32px;
}

.header-icon {
  height: 20px;
  margin-right: 5px;
}

#wallet-balance {
  margin-left: 16px;
  color: #90ee90;
}

.app-menu-bar {
  background-image: url("~@/assets/menu_bar.png");
  background-size: 100% 100%;
  height: 70px;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 160px;
  z-index: 4;
  width: 100%;
}

.zoombie-logo {
  height: 105px;
  width: 105px;
  position: absolute;
  left: 3%;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }
}

.app-menu-bar-items {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 0;
  padding: 0;
  position: relative;

  li {
    display: inline-block;
    margin-right: 12px;

    &:hover {
      transform: scale(1.1);

      button {
        text-decoration: underline;
      }
    }
  }
}

@media screen and (max-width: 1075px) {
  .app-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Oswald", sans-serif;

    ul {
      padding-left: 0;

      li {
        margin: 0;
        text-align: left;
      }
    }
  }

  .mobile-dropdown {
    display: flex;
    flex-direction: column;
  }

  .app-menu-bar {
    // background-image: url("../assets/menu_bar_mobile.png");
    height: 60px;
    justify-content: flex-end
  }

  .zoombie-logo {
    height: 80px;
    width: 80px;
  }

  .hamburger-menu {
    display: flex;
    align-items: center;
    height: 100%;

    img {
      width: 40px;
      height: 30px;
      margin-right: 30px;
    }
  }

  .desktop-connect-btn, .desktop-bonus, .app-menu-bar-items, .wallet-info {
    display: none;
  }
}

.desktop-bonus {
  max-width: 210px;
  margin-right: 32px;
  position: absolute;
  right: 0;

  .bonusClass {
    font-size: 18px;
    font-weight: 500;
    color: #00ff00;
  }

  .bonusClassNo {
    max-width: 150px;
  }
}

.affiliate-header {
  color: $COLOR_PINK;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.shop-header {
  color: $COLOR_PURPLE;
}

.aqua-header {
  color: $COLOR_AQUA;
}

.white-header {
  color: white;
}

.header-item {
  font-family: "Oswald", sans-serif;
  font-size: 22px;
}

/*******************************
OLD CSS
**********************************/

.button-wrapper {
  display: flex;

  @media (max-width: 922px) {
    flex-direction: column;
  }

  .affiliate-button {
    height: 40px;
    margin-right: 16px;

    @media (max-width: 922px) {
      width: 100%;
      margin-top: 16px;
    }
  }

  a {
    padding: 0;
  }
}

.prev-next-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 18px;

  button {
    color: #f0b90b;
  }
}

.platinum-card {
  margin-top: 0px;
  display: flex;
  justify-content: center;
}

.platinum-card-wrapper {
  position: relative;
  img {
    width: 300px;

    @media screen and (max-width: 400px) {
      width: 200px;
    }
  }

  .question-mark {
    font-size: 7rem;
    font-weight: bold;
    color: white;
    position: absolute;
    top: 17%;
    left: 43%;

    @media screen and (max-width: 400px) {
      top: 10%;
      left: 40%;
    }
  }
}

#wallet-nav:empty {
  height: 0;
}

#wallet-nav {
  display: flex;
  flex: 1;
  grid-row: 2;
  justify-content: center;
  height: 40px;
  align-items: center;
}

#wallet-id {
  color: #d48b15;
  display: flex;
  justify-content: center;
  margin-right: 20px;
}

#wallet-balance {
  display: flex;
  color: #90ee90;
}

.platinum-jumbotron {
  margin-top: 0 !important;
}

.bonusClass {
  animation: shake 3.82s infinite cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  color: $COLOR_PINK;
  margin-right: 0.8em;
  cursor: pointer;
  padding: 1px;
  border: 1px solid transparent;
}

@media screen and (max-width: 600px) {
  .nav-item {
    height: 40px;
    display: flex;
    align-items: center;
  }

  .bonusClass {
    margin-right: 0;
  }

  #shop {
    position: relative;
    margin-top: 10px;
  }

  #shop:before {
    content: "";
    height: 1px;
    background: gray;
    position: absolute;
    top: -5px;
    left: 10px;
    right: 10px;
  }

  .tooltip-1 {
    top: 0 !important;
  }

  .tooltip-2 {
    top: 0 !important;
  }
}

.telegram-link {
  @media screen and (max-width: 922px) {
    margin-top: 16px;
  }
}

#cryptoz-logo {
  margin-right: 3rem;
}

.router-link-active {
  text-decoration: underline;
}

.mm-header {
  color: #fff;
  text-align: right;
  margin-right: 10px;
  width: 23em;
}

#nav-collapse {
  overflow-x: auto;
}

.logo-nav {
  margin-right: 0.5em;
  width: 2em;
}

li {
  margin-right: 1.2em;
}

a {
  padding: 2px;
}

/* BINANCE color #F0B90B */
.bsc-link {
  color: #f0b90b;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bonusClass:hover {
  animation: none;
  color: white;
  margin-right: 0.8em;
  cursor: pointer;
  padding: 1px;
}

.bonusClassNo {
  color: #f7162c;
}

.bonusClassLogIn {
  color: #ffff00;
  margin-right: 3.2em;
}
.wallet-balance {
  color: lightgreen;
  margin: 0 4em 0 1em;
}

.header-icon {
  height: 20px;
  margin-right: 5px;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.eth-link,
.bsc-link {
  white-space: nowrap;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
.spinner {
  width: 2em;
}
.spinner-text-style {
  color: #fff;
}

.jumbo {
  margin-top: 0 !important;
  padding: 10px 10px;
  margin-bottom: 50px;
}

.lead {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  word-break: break-all;
}

.sponsor-warning {
  font-weight: bold;
  color: #dc3545;
}

.czxp-logo {
  width: 25px;
  height: 25px;
  vertical-align: middle;
}

.time-to-bonus {
  white-space: nowrap;
}
</style>
