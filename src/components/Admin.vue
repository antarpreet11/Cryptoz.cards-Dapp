<template>
  <div>
    <main role="main" class="container">
      <b-container fluid class="text-center">
        <h1>Administrative functions</h1>
        <p>Don't bother trying unless you are the owner of the contract</p>
        <br/><br/>
        <h4>Award Booster Credits:</h4>
        Total boosters Rewarded: {{totalRewarded}}
        <b-row>
          <b-col sm="8">
            <b-form-input type="text" v-model="walletToReward" placeholder="0x00....00"></b-form-input>
          </b-col>
          <b-col>
            <b-form-input type="number" min="1" max="50" v-model="creditAmountToAward" placeholder="# of credits"></b-form-input>
          </b-col>
          <b-col>
            <b-button type="submit" variant="primary" @click="awardBoosterCredits">Submit</b-button>
          </b-col>
        </b-row>
        <br/><br/><br/><br/>
      </b-container>
    </main>
  </div>
</template>

<script>
import {
  BFormInput,
  BButton,
  BFormSelect,
  BContainer,
  BRow,
  BCol,
  BImgLazy,
} from "bootstrap-vue";
import { mapGetters } from "vuex";
import apexchart from "vue-apexcharts";
import { ethers } from "ethers";
import { isMetamaskInstalled } from "../store/blockChainStore";
import { isLocal } from "../util/constants/networks";
import { querySubGraph } from "../util/bodyUtil"; 

export default {
  name: "Admin",
  components: {
    BFormInput,
    BButton,
    BFormSelect,
    BContainer,
    BRow,
    BCol,
    BImgLazy,
    apexchart,
  },
  data() {
    return {
      walletToReward: "",
      creditAmountToAward: "",
      totalRewarded: "Loading...",
    };
  },
  computed: {
    ...mapGetters({
      getWalletAddress: "blockChain/getWalletAddress",
      getZoomBalance: "blockChain/getZoomBalance",
      getTotalZoomBalance: "blockChain/getTotalZoomBalance",
      getTotalNftSupply: "blockChain/getTotalNftSupply",
      getTotalNftTypes: "blockChain/getTotalNftTypes",
      getChainId: "blockChain/getChainId",
      getSignedZoombiesContract: "blockChain/getSignedZoombiesContract",
    }),
    metamaskInstalled: () => {
      return isMetamaskInstalled();
    },
  },
  beforeUnmount() {
    clearInterval(this.last5NFTsTimer);
  },
  mounted() {
    if (
      this.getChainId == 1285 ||
      window.location.host == "movr.zoombies.world"
    ) {
      this.onMainNet = true;
    } else {
      this.onMainNet = false;
    }

  },
  watch: {

    getSignedZoombiesContract: async function() {
      console.log("got the signed contract");
      this.totalRewarded = await this.getSignedZoombiesContract.totalBoostersRewarded();
    }

  },
  methods: {
    awardBoosterCredits: async function() {
      console.log("clicked !");
      console.log(this.walletToReward);
      console.log(this.creditAmountToAward);
      //const tbr = await this.getSignedZoombiesContract.totalBoostersRewarded();
      //console.log(tbr);
      try {
        await this.getSignedZoombiesContract.awardBoosterCredits(this.walletToReward, this.creditAmountToAward.toString());
      }catch(error) {
        alert(error.message);
      }
    },
    formatNumber(number) {
      return parseInt(number.toFixed(0)).toLocaleString();
    },
    pulsateText(ref) {
      ref.$el.classList.value = ref.$el.classList.value + "pulsate";
      ref.play();
      setTimeout(() => {
        ref.$el.classList.value = "";
      }, 500);
    },
    addZOOMtoMetaMask: async function () {
      const tokenAddress = this.onMainNet
        ? "0x8bd5180Ccdd7AE4aF832c8C03e21Ce8484A128d4"
        : "0x8e21404bAd3A1d2327cc6D2B2118f47911a1f316";
      const tokenSymbol = this.onMainNet ? "ZOOM" : "ZOOM-DEV";
      const tokenDecimals = 18;
      const tokenImage = "https://zoombies.world/images/zoombies_coin.svg";

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });
      } catch (error) {
        console.log("addCZXPtoMetaMask error:", error);
      }
    },
    updateBadge: async function () {
      console.log("ggogogogo");
    },
    filterCzxpInput: function () {
      this.totalCzxpToBuy = this.totalCzxpToBuy.replace(/[^\d]/g, "");
      if (
        this.myPurchaseTotal + parseInt(this.totalCzxpToBuy * 100000000000) >
        20000000000000000000
      ) {
        this.totalCzxpToBuy =
          (20000000000000000000 - this.myPurchaseTotal) / 100000000000;
      }

      this.movrCost = parseFloat(this.totalCzxpToBuy / 10000000).toFixed(7);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.feature-panel {
  color: white;
  text-shadow: 1px 1px black;
  background: rgba(0, 0, 0, 0.35);
}

.card-demo-group {
  float: right;
  width: 30%;
  margin-left: 4em;
  position: relative;
  top: -2em;
}

.badge-icon {
  max-width: 3rem;
  filter: drop-shadow(1px 1px 4px #ffffff);
}

.btn-font {
  font-size: 2rem;
}

.coin-logo {
  max-width: 2rem;
}

.pulsate {
  display: inline-block;
  transform: scale(1);
  animation: pulsate 0.5s ease-out;
}

@keyframes pulsate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.totals {
  display: table;
}

.graph-title {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  color: #7ef4f6;
}

.apexcharts-tooltip {
  background: #1c1f50;
  border: 4px solid red;
}

.arrow_box {
  position: relative;
  background: #555;
  border: 2px solid #000000;
}
.arrow_box:after,
.arrow_box:before {
  right: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.arrow_box:after {
  border-color: rgba(85, 85, 85, 0);
  border-right-color: #555;
  border-width: 10px;
  margin-top: -10px;
}
.arrow_box:before {
  border-color: rgba(0, 0, 0, 0);
  border-right-color: #000000;
  border-width: 13px;
  margin-top: -13px;
}

.selectDropDown {
  background-color: #343a40;
  color: #0bdfe7;
  margin-top: 0.4em;
}

span.apexcharts-legend-text {
  color: #ffffff;
}

.apexcharts-legend-text {
  color: #ffffff;
}

</style>
