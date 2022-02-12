<template>
  <div>
    <main role="main" class="container">
      <b-container fluid class="text-center">
        <b-row>
          <b-col>
            <div v-if="coinbase">
              <b-col sm="12" md="12">
                <b-button
                  v-b-modal.sponsor-modal
                  size="lg"
                  variant="info"
                  class="btn-font"
                  >EARN FREE ZOOM</b-button
                >
              </b-col>

              <b-col class="mt-5" sm="12" md="12">
                <span class="zoombies-font h1">
                  <number
                    ref="nftSupply"
                    :from="fromNftSupply"
                    :to="toNftSupply"
                    :format="formatNumber"
                    :duration="3.5"
                  /> </span
                ><br />
                <span class="text-pink h5">ZOOMBIE NFTS MINTED</span>
              </b-col>

              <b-col class="mt-4" sm="12" md="12">
                <span class="zoombies-font h1">
                  <number
                    ref="zoomBal"
                    :from="fromZoomBalance"
                    :to="toZoomBalance"
                    :format="formatNumber"
                    :duration="3.5"
                  /> </span
                ><br />
                <span class="text-aqua h5">
                  ZOOM
                  <img src="@/assets/zoomTokenCoin.svg" class="coin-logo" />
                  TOKENS IN ZWORLD
                </span>
              </b-col>

              <b-col class="mt-4" sm="12" md="12">
                <span class="zoombies-font h1">36,406</span><br />
                <span class="text-purple h5">ZOOMBIE HERDERS</span>
              </b-col>
            </div>

            <div v-else>
              <h2>
                <p>In order to Connect and participate on the blockchain:</p>
                You must have a valid Web3 wallet installed<br /><br />
                <a href="https://metamask.io/" target="_blank">
                  <b-button variant="danger" size="lg"
                    >Install Metamask</b-button
                  >
                </a>
              </h2>
            </div>
          </b-col>
          <!-- Right side -->
          <b-col class="mt-5" md="12" sm="12" lg="8">
            <b-img-lazy
              src="https://zoombies.world/images/app_home_welcome.png"
              fluid
              alt="Welcome to Zoombies banner"
              style="max-width: 100%"
            ></b-img-lazy>
          </b-col>
        </b-row>
      </b-container>
    </main>
  </div>
</template>

<script>
import { BButton, BContainer, BRow, BCol, BImgLazy } from "bootstrap-vue";
export default {
  name: "BodyContent",
  components: {
    BButton,
    BContainer,
    BRow,
    BCol,
    BImgLazy,
  },
  data() {
    return {
      zoomSold: "Loading..",
      zoomWalletsRemaining: "Loading..",
      totalCzxpToBuy: "",
      movrCost: 0,
      myPurchaseTotal: 0,
      onMainNet: false,
    };
  },
  computed: {
    buyCzxpBtnEnabled() {
      if (
        this.totalCzxpToBuy !== "" &&
        this.totalCzxpToBuy >= 10000000 &&
        this.totalCzxpToBuy <= 200000000 &&
        this.myPurchaseTotal < 200000000000000000000
      ) {
        return true;
      } else {
        return false;
      }
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    CzxpInstance() {
      return this.$store.state.contractInstance.czxp;
    },
    ZoombiesInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    zoomBalance() {
      return this.$store.state.totalCzxpSupply / 1000000000000000000;
    },
    fromZoomBalance() {
      return this.prevZoomBalance || this.zoomBalance;
    },
    toZoomBalance() {
      return this.newZoomBalance || this.zoomBalance;
    },
    nftSupply() {
      return this.$store.state.totalCryptozSupply;
    },
    fromNftSupply() {
      return this.prevNftSupply || this.nftSupply;
    },
    toNftSupply() {
      return this.newNftSupply || this.nftSupply;
    },
    pendingPurchase() {
      return this.movrCost + " MOVR =";
    },
    myPurchaseTotalLabel() {
      return parseInt(this.myPurchaseTotal / 100000000000).toLocaleString();
    },
  },
  mounted() {
    //console.log('chain:',this.$store.state.web3.chainId);
    if (
      this.$store.state.web3.chainId == "1285" ||
      window.location.host == "movr.zoombies.world"
    ) {
      this.onMainNet = true;
    } else {
      this.onMainNet = false;
    }

    if (this.ZoombiesInstance) {
      //this.updateSale();
    }
  },
  watch: {
    ZoombiesInstance(newVal) {
      console.log({ newVal });
      if (newVal) {
        //this.updateSale();
      }
    },
    zoomBalance(newVal, oldVal) {
      this.newZoomBalance = newVal;
      this.prevZoomBalance = oldVal;
      if (oldVal > 0) {
        this.pulsateText(this.$refs.zoomBal);
      }
    },
    nftSupply(newVal, oldVal) {
      this.newNftSupply = newVal;
      this.prevNftSupply = oldVal;
      if (oldVal > 0) {
        this.pulsateText(this.$refs.nftSupply);
      }
    },
  },
  methods: {
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
    buyCzxp: async function () {
      //console.log( new web3.utils.BN(this.totalCzxpToBuy).mul(new web3.utils.BN('1000000000000')).toString() );
      let buyinWei = new web3.utils.BN(this.totalCzxpToBuy)
        .mul(new web3.utils.BN("100000000000"))
        .toString();

      await this.CzxpInstance.methods
        .buy()
        .send({
          from: this.coinbase,
          value: buyinWei,
        })
        .then((res) => {
          //console.log(res.status);
          if (res.status) {
            this.updateSale();
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    updateSale: async function () {
      console.log("Update sale data..");
      //console.log(await this.CzxpInstance.methods.totalSupply().call());
      this.zoomWalletsRemaining =
        1000 - (await this.CzxpInstance.methods.totalContributors().call());
      this.zoomSold = parseInt(
        (await this.CzxpInstance.methods.totalZoomPurchased().call()) /
          1000000000000000000
      ).toLocaleString();
      this.totalCzxpToBuy = "";
      this.movrCost = 0;
      //console.log("contr.total:",await this.CzxpInstance.methods.contributions(this.coinbase).call());
      this.myPurchaseTotal = parseInt(
        await this.CzxpInstance.methods.contributions(this.coinbase).call()
      );

      this.$store.state.zoomContribution = this.myPurchaseTotal;
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
  watch: {
    ZoombiesInstance(newVal) {
      if (newVal) {
        //this.updateSale();
      }
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
</style>
