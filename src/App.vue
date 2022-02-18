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
    <Header />
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
import { showSuccessToast } from "./util/showToast";
import Header from "./components/layout/Header.vue";
import AppFooter from "./components/layout/AppFooter";
import TransactionModal from "./components/TransactionModal.vue";
import { MessageBus } from "@/messageBus";
import CzxpRewardEffect from "./components/layout/CzxpRewardEffect";
import { BButton, BSidebar } from "bootstrap-vue";
import RealtimeEvents from "@/components/RealtimeEvents.vue";

import Lottie from "vue-lottie";
import animationData from "./assets/NotificationLottie.json";

const Web3 = require("web3");
import "./main.css";

import { mapGetters } from "vuex";

const isLocal =
  process.env.NODE_ENV === "development" ||
  window.location.host !== "movr.zoombies.world";
// const isLocal = false;

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
  beforeCreate() {
    if (window.web3 && window.ethereum) {
      this.$store.dispatch("blockChain/initBlockchain", {
        isLocal: isLocal,
        noMetamaskCallback: () => {
          this.$bvModal.show("no-web3-modal");
        },
      });
    }
  },
  async created() {
    if (window.web3 && window.ethereum) {
      // this needs to be set in beforeCreate because vue lifecycle
      // is Parent create -> child create -> child mount -> parent mount
      // and we need provider to be set in child components
      const web3 = new Web3(window.ethereum);
      window.web3 = web3;
    }

    MessageBus.$on("connect", () => {
      this.$store.dispatch("blockChain/initBlockchain", {
        isLocal: isLocal,
        noMetamaskCallback: () => {
          this.$bvModal.show("no-web3-modal");
        },
      });
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
