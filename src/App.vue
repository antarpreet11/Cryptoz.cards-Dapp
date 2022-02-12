<template>
  <div id="app">
    <b-button
      v-b-toggle.events-sidebar
      class="sidebar-button"
      variant="dark"
      size="md"
      @click="() => stop()"
    >
      <lottie
        class="lottie-container"
        :options="defaultOptions"
        :height="100"
        :width="80"
        v-on:animCreated="handleAnimation"
      ></lottie>
    </b-button>
    <b-sidebar
      id="events-sidebar"
      title="Events"
      bg-variant="dark"
      text-variant="light"
      backdrop
    >
      <realtime-events></realtime-events>
    </b-sidebar>
    <Header @connect="handleConnect" />
    <b-modal id="no-web3-modal" hide-footer>
      <template #modal-title> Web3 Not Detected! </template>
      <div class="d-block text-center">
        <p>
          <a target="_blank" href="https://metamask.io/download.html"
            >Metamask</a
          >
          is required to connect to the Zoombies NFT World on the Moonriver
          blockchain.
        </p>
        <p>
          Please install it from this link:
          <a target="_blank" href="https://metamask.io/download.html"
            >Metamask Downloads</a
          >
        </p>
      </div>
    </b-modal>
    <transition name="component-fade" mode="out-in">
      <router-view class="app-body" />
    </transition>
    <CzxpRewardEffect />
    <AppFooter />
    <transaction-modal />
  </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
import debounce from "lodash/debounce";
import watchEvents from "./util/watchEvents";
import { showSuccessToast } from "./util/showToast";
import Header from "./components/layout/Header.vue";
import AppFooter from "./components/layout/AppFooter";
import TransactionModal from "./components/TransactionModal.vue";
import dAppStates from "@/dAppStates";
import { MessageBus } from "@/messageBus";
import CzxpRewardEffect from "./components/layout/CzxpRewardEffect";
import { BButton, BSidebar } from "bootstrap-vue";
import RealtimeEvents from "@/components/RealtimeEvents.vue";

import Lottie from "vue-lottie";
import animationData from "./assets/NotificationLottie.json";

const Web3 = require("web3");
import "./main.css";
import zoombiesContractJSON from "./contracts/Zoombies.json";
import zoomTokenContractJSON from "./contracts/ZoomToken.json";

import {
  setupEventWatcher,
  WatcherZoombiesContract,
  WatcherZoomContract,
} from "./util/watcherUtil";

import { mapGetters } from "vuex";

const isLocal =
  process.env.NODE_ENV === "development" ||
  window.location.host !== "movr.zoombies.world";

const ethChainParam = isLocal
  ? {
      chainId: "0x507", // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
      chainName: "Moonbase Alpha",
      nativeCurrency: {
        name: "DEV",
        symbol: "DEV",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
      blockExplorerUrls: ["https://moonbase.moonscan.io/"],
    }
  : {
      chainId: "0x505", // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
      chainName: "Moonriver",
      nativeCurrency: {
        name: "MOVR",
        symbol: "MOVR",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
      blockExplorerUrls: ["https://moonriver.moonscan.io/"],
    };

export default {
  name: "App",
  components: {
    Header,
    AppFooter,
    TransactionModal,
    CzxpRewardEffect,
    Lottie,
    BButton,
    BSidebar,
    RealtimeEvents,
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData,
        loop: true,
        autoplay: false,
      },
    };
  },
  computed: {
    events() {
      return this.$store.state.events.events;
    },
    ...mapGetters({
      getWalletAddress: "blockChain/getWalletAddress",
      getBalance: "blockChain/getBalance",
    }),
  },
  watch: {
    getWalletAddress(val, oldVal) {
      if (val && oldVal && val !== oldVal) {
        showSuccessToast(this, "Successfully changed wallets.");
      }
    },
    events(val, oldVal) {
      if (val.length > oldVal.length) {
        this.play();
      } else {
        this.stop();
      }
    },
  },
  async created() {
    if (window.web3 && window.ethereum) {
      // this needs to be set in beforeCreate because vue lifecycle
      // is Parent create -> child create -> child mount -> parent mount
      // and we need provider to be set in child components
      const web3 = new Web3(window.ethereum);
      window.web3 = web3;
      this.$store.dispatch("blockChain/initBlockchain", {
        isLocal: isLocal,
        noMetamaskCallback: () => {
          this.$bvModal.show("no-web3-modal");
        },
      });
      this.initializeApp();
    }

    // // set this here to be able to debounce it..
    // // debounce prevents this from showing the "Balance Updated" twice
    // // when both Cryptoz and Czxp contracts emit an event
    // this.onBalanceUpdated = debounce(() => {
    //   showSuccessToast(this, "Balance Updated!");
    // }, 1000);

    MessageBus.$on("connect", () => {
      this.handleConnect();
    });
  },
  async mounted() {
    // Twitter library - footer follow button uses it
    window.twttr = (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };

      return t;
    })(document, "script", "twitter-wjs");

    const provider = await detectEthereumProvider({
      mustBeMetaMask: true,
    });

    if (!provider) {
      this.$bvModal.show("no-web3-modal");
    } else {
      setupEventWatcher(this.$store);
    }
  },
  unmounted() {
    WatcherZoomContract.provider.removeAllListeners();
    WatcherZoombiesContract.provider.removeAllListeners();
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    play: function () {
      this.anim.play();
    },
    stop: function () {
      this.anim.stop();
    },
    configureMoonriver: async function () {
      const provider = await detectEthereumProvider({ mustBeMetaMask: true });
      if (provider) {
        try {
          await provider.request({ method: "eth_requestAccounts" });
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [ethChainParam],
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        console.error("Please install MetaMask");
        //window.alert("Please go to metamask.io, follow the instructions carefully and then return.");
      }
    },
    initializeApp: async function () {
      const [accounts, networkId] = await Promise.all([
        web3.eth.getAccounts(),
        web3.eth.net.getId(),
      ]);

      if (networkId !== 1285 || isLocal) {
        await this.configureMoonriver();
      }

      this.$store.dispatch("chainChanged", networkId);
      await this.loadContracts(accounts, networkId);
      this.$store.dispatch("setDAppState", dAppStates.CONNECTED);
      this.subscribeToProviderEvents(web3.currentProvider);
      this.$store.dispatch("updateUniverseBalances");
      if (accounts.length > 0) {
        await this.$store.dispatch("updateOwnerBalances");
        this.$store.dispatch("setDAppState", dAppStates.WALLET_CONNECTED);

        // watchEvents(this.CzxpInstance, this.CryptozInstance, {
        //   onCardMinted: this.onCardMinted,
        //   onBalanceUpdated: this.onBalanceUpdated,
        //   onSponsorEvent: (czxpReward, event) => {
        //     MessageBus.$emit("czxpReward", czxpReward);
        //     const affiliate = event.returnValues.affiliate.toLowerCase();
        //     const shortendAffiliate = `${affiliate.substring(
        //       0,
        //       5
        //     )}....${affiliate.substring(affiliate.length - 4)}`;
        //     showSuccessToast(
        //       this,
        //       `${shortendAffiliate} just used your sponsor link and became an affiliate!`
        //     );
        //   },
        // });
      }
    },
    loadContracts: async function (accounts, networkId) {
      const zoombiesContractAddress =
        zoombiesContractJSON.networks[networkId].address;
      const zoomTokenContractAddress =
        zoomTokenContractJSON.networks[networkId].address;
      const zoombiesContract = new web3.eth.Contract(
        zoombiesContractJSON.abi,
        zoombiesContractAddress
      );
      const zoomTokenContract = new web3.eth.Contract(
        zoomTokenContractJSON.abi,
        zoomTokenContractAddress
      );
      return this.$store.dispatch("setContractInstance", {
        cryptoz: zoombiesContract,
        czxp: zoomTokenContract,
      });
    },
    handleConnect: async function () {
      const provider = window.ethereum;

      await provider.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(provider);
      window.web3 = web3;
      this.initializeApp();
      // const web3Modal = new Web3Modal({
      //   cacheProvider: true,
      //   providerOptions,
      // });

      // const provider = await web3Modal.connect()
      // await provider.enable()
      // this.setContractProvider(provider)
    },
    onCardMinted({ cardTypeId, editionNumber }) {
      this.$store.dispatch("updateMintedCountForCard", {
        cardTypeId,
        editionNumber,
      });
    },

    subscribeToProviderEvents(provider) {
      provider.on("connect", ({ chainId }) => {
        this.$store.dispatch("chainChanged", chainId);
        this.$store.dispatch("setDAppState", dAppStates.CONNECTED);
      });
      provider.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          await this.$store.dispatch("updateOwnerBalances");
          this.$store.dispatch("setDAppState", dAppStates.WALLET_CONNECTED);
        }
        //user "locks" their wallet via provider
        else {
          this.disconnectWallet();
          this.$store.dispatch("setDAppState", dAppStates.CONNECTED);
        }
      });
      provider.on("chainChanged", (chainId) => {
        this.$store.dispatch("chainChanged", chainId);
        const previousChainId = localStorage.getItem("ethChainId");
        localStorage.setItem("ethChainId", chainId);
        window.location.reload();
      });
      provider.on("disconnect", () => {
        this.disconnectWallet();
        this.$store.dispatch("setDAppState", dAppStates.NOT_CONNECTED);
      });
    },
    disconnectWallet() {
      this.$store.dispatch("disconnectWallet");
      this.$store.dispatch("chainChanged", null);
    },
  },
};
</script>

<style lang="scss">
#app {
  height: 100vh;
  overflow-x: hidden;
  background-image: url("components/assets/space_bg.svg");
  background-size: cover;
  position: relative;
}

// Large devices (desktops, 992px and up)
@media (min-width: 992px) {
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}

/* unvisited link */
a:link {
  color: #ffa7c4;
}

/* visited link */
a:visited {
  color: #ffa7c4;
}

/* mouse over link */
a:hover {
  color: #82ffd6;
}

/* selected link */
a:active {
  color: #82ffd6;
}

.app-body {
  padding: 10px 30px;
  color: white;

  a.dropdown-item {
    color: black;

    &.active {
      background: #7ef4f6;
    }
  }
}
.tooltip {
  top: -10px;
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.toast-wrapper {
  display: flex;
  align-items: center;
}
.toast-message {
  margin-left: 10px;
  font-size: 20px;
}
.web3modal-modal-card {
  margin-top: 150px;
}
/* BINANCE color #F0B90B */
a {
  padding: 2px;
  color: #f0b90b;
}

.sidebar-button {
  height: 110px;
  width: 40px;
  top: 40%;
  position: fixed;
  background-color: darkgray;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.lottie-container {
  position: absolute;
  top: 0;
  left: -22px;
}
</style>
