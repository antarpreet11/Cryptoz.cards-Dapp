<template>
  <div>
    <b-modal id="modal-1" size="xl" ok-only title="Zoombies World - VIP benefits">
      <p class="my-4">
        <img v-b-modal.modal-1 width="100%" height="100%"
             class="img-responsive"
             src="https://zoombies.world/images/early_adopters_token_sale.png"
        />
      </p>
    </b-modal>
    <main role="main" class="container">
      <b-card bg-variant="dark" text-variant="white" border-variant="info">
        <b-card-text>
          <br/>
          <br/>
          <h1>
            Zoombies is the play-to-earn NFT collectibles trade game built on scarcity, rarity
            and community
          </h1>
          <br/>
          <img v-b-modal.modal-1
            class="img-responsive card-demo-group"
            src="https://zoombies.world/images/early_adopters_token_sale.png"
          />
          <p>Zoombies is deployed on <span v-if="!onMainNet" class="text-danger">Moonbase Alpha Testnet</span>
            <img v-if="onMainNet" src="https://zoombies.world/images/moonriver-logo-500.png" style="max-width:7em" />
          </p>
          <p>
            <h2>ZOOM <img src="https://zoombies.world/images/zoombies_coin.svg" style="max-width:2.6rem;" class="align-middle" /> Token Liquidity Sale Event !</h2>
            <h2 class="text-warning">Ends Nov 1, 2021 - 18:00-UTC</h2>
            <h1><span id="countdown" class="text-warning">loading..</span></h1>
            <p><span class="text-danger">NOTE:</span> The ZOOM ERC20 token is the economic game utility token for the Zoombies NFT World. <router-link to="/help">Please read and understand the mint and burn operations of this token</router-link> before purchase.<br />


              <div class="vip-details">
                <h2 class="align-middle">ZOOM <img src="https://zoombies.world/images/zoombies_coin.svg" style="max-width:2.6rem;" class="align-middle" /> VIP benefits:</h2>
                <p>Early adopters land bonus and VIP benefits:</p>

                  <p><img src="https://zoombies.world/images/gold_vip.svg" class="badge-icon" /> <span class="font-weight-bold">GOLD VIP - Bought the max of 200 Million ZOOM<span class="text-danger">**</span>:</span>
                    <ul>
                      <li>1 Tax Exempt Island land NFT pre-sale minting - choose your island land before the public sale<span class="text-danger">*</span></li>
                      <li>Claim your land for free, without burning ZOOM<span class="text-danger">*</span></li>
                      <li>Additional founder GOLD VIP ZOOM economy benefits to come</li>
                    </ul>
                  </p>

                  <p><img src="https://zoombies.world/images/silver_vip.svg" class="badge-icon" /> <span class="font-weight-bold">VIP - Bought at least 10 Million ZOOM<span class="text-danger">**</span>:</span>
                  <ul>
                    <li>1 Farm land NFT pre-sale minting - choose your farm land before the public*</li>
                    <li>Claim your land for free, without burning ZOOM<span class="text-danger">*</span></li>
                    <li>Additional founder VIP ZOOM economy benefits to come</li>
                  </ul>
                </p>

                  <p><span class="text-danger">*</span>Land must be claimed before the close of the pre-sale VIP minting claim deadline.
                  <br /><span class="text-danger">**</span>ZOOM must have been purchased from this official page before November 1, 2021 at 18:00-UTC</p>

              </div>



              Holding a sufficient ZOOM token balance will unlock some FREE cards and reduce the minting costs of some Shop NFTs. ZOOM tokens can also be burned to increase the chance of pulling higher rarity cards when minting booster NFTs. Future utility will include ZOOM tokens as a form of health points.
            </p>
              <br/>
            <b-container fluid>
              <b-row>
                <b-col sm="12" md="3" lg="3"><strong>Max. 1000 wallets</strong></b-col>
                <b-col sm="12" md="3" lg="3"><strong>Hard Cap: 200 Billion ZOOM</strong></b-col>
                <b-col sm="12" md="3" lg="3"><strong>1 ZOOM = 0.0000001 MOVR</strong></b-col>
                <b-col sm="12" md="3" lg="3"><strong>Min/Max purchase: 1/20 MOVR</strong></b-col>
              </b-row>
              <br/>
              <b-row>
                <b-col class="text-warning">{{zoomWalletsRemaining}} slots remaining</b-col>
                <b-col class="text-warning">{{zoomSold}} sold in World</b-col>
                <b-col class="text-success">Your Purchases: {{myPurchaseTotalLabel}}</b-col>
                <b-col></b-col>
              </b-row>
              <br/>
              <b-row align-h="center">
                <b-col sm="12" md="6" lg="4" class="text-right" style="padding-top:6px"><strong>Total to purchase:</strong> <span class="text-success">{{pendingPurchase}}</span></b-col>
                <b-col sm="12" md="4" lg="2"><b-form-input v-model="totalCzxpToBuy" size="10" maxlength="9" placeholder="enter amount" class="" @keyup="filterCzxpInput"></b-form-input> <img src="https://zoombies.world/images/zoombies_coin.svg" style="max-width:1.6rem;" class="align-middle" /> ZOOM tokens</b-col>
                <b-col sm="12" md="2" lg="4">
                  <input type="submit" class="btn btn-primary" :disabled="!buyCzxpBtnEnabled" @click="buyCzxp">
                </b-col>
                <b-col>
                  <div class="btn btn-primary" @click="addZOOMtoMetaMask">Add <img src="https://zoombies.world/images/zoombies_coin.svg" style="max-width:2.6rem;" class="align-middle" /> asset to Metamask</div>
                </b-col>
              </b-row>
            </b-container>
            <br/><br/><br/>
            <span class="text-warning">Zombies will provision up to a maximum of 2 Billion Zoom to a MOVR-ZOOM swap pool upon sale of equivalent MOVR.</span>
            <br/>
            <span class="text-success">Thank you community, you have met this requirement!</span> we have launched the ZOOM token <router-link to="/market">pool on SushiSwap</router-link>.
          <br/>
            <hr />
          </p>

          <h2>Time to have some fun !</h2>
          <p>
            The goal is to collect the rare and unique undead NFT cards, earn or
            trade ERC-20 ZOOM tokens to unlock FREE shop minting and reduced shop pricing.</p>
          <p>Each minted NFT Zoombies card is a unique token on the Moonriver blockchain.
            Collectors can buy, sell, and exchange both their Zoombies NFT
            cards and ZOOM tokens through any standards compliant wallets,
            markets, game engines, exchanges, DeFi and other future inventions.
          </p>
          <p>The most profitable strategy is to <strong>grow your Affiliate network early</strong> and earn ZOOM tokens for Free :).<br/>
             <strong class="text-success">Click the Affiliate link in the header</strong> to Share and earn</p>
          <div>
            <h2>Get Started</h2>
            <span
              >To interact with Zoombies you will need to
              <a
                href="https://docs.moonbeam.network/getting-started/moonriver/integrate-metamask/"
                target="_blank"
                >install Metamask configured for Moonriver</a
              >
              and have a small amount of MOVR in your wallet.</span
            >
          </div>
          <p>
            NFT token collecting and trading is an exciting and new opportunity
            for classic and modern collectors alike. What makes this platform
            unique compared to other online digital asset based games or systems
            are:
          </p>
          <ul>
            <li>
              Zoombies NFT Card functions and data are a set of Smart Contracts
              that run independantly of the creators. There is no OFF switch. The
              Zoombies NFT World will live forever on Moonriver.
            </li>
            <li>
              The developers can Not tamper or change the Card types once they are
              loaded. i.e: no re-minting scarce NFTs
            </li>
            <li>
              The NFTs are truly unique, owned and transferable between wallets
              manaully or automated through NFT auction marketplaces.
            </li>
          </ul>
          <p>
            <router-link to="/help"> Visit the Help section </router-link> of the
            website to read more
          </p>
        </b-card-text>
      </b-card>
    </main>

  </div>
</template>

<script>
import {
  BCard,
  BButton,
  BCardText,
  BContainer,
  BRow,
  BCol,
  BFormInput
} from "bootstrap-vue";
export default {
  name: "BodyContent",
  components: {
    BCard,
    BButton,
    BCardText,
    BContainer,
    BRow,
    BCol,
    BFormInput
  },
  data() {
    return {
      zoomSold: "Loading..",
      zoomWalletsRemaining: "Loading..",
      totalCzxpToBuy: "",
      movrCost: 0,
      myPurchaseTotal: 0,
      onMainNet : false,
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
    pendingPurchase() {
      return this.movrCost + " MOVR =";
    },
    myPurchaseTotalLabel() {
      return parseInt(this.myPurchaseTotal/100000000000).toLocaleString();
    },
  },
  beforeDestroy() {
    clearInterval(window.countdownTimer);
  },
  mounted() {
    //console.log('chain:',this.$store.state.web3.chainId);
    if(this.$store.state.web3.chainId == "1285" || window.location.host == 'movr.zoombies.world') {
      this.onMainNet = true;
    } else{
      this.onMainNet = false;
    }

    if (this.ZoombiesInstance) {
      this.updateSale();
    }

    // Set the date we're counting down to
    var countDownDate = new Date(Date.UTC(2021,10,1,18,0,0)).getTime();

    // Update the count down every 1 second
    window.countdownTimer = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(countdownTimer);
      document.getElementById("countdown").innerHTML = "Refresh every minute for LIVE..";
    }
    }, 1000);

  },
  watch: {
   ZoombiesInstance(newVal) {
     console.log({newVal})
     if (newVal) {
       this.updateSale();
     }
   },
  },
  methods: {
    addZOOMtoMetaMask: async function() {
      const tokenAddress = this.onMainNet ? '0x8bd5180Ccdd7AE4aF832c8C03e21Ce8484A128d4' : '0x8e21404bAd3A1d2327cc6D2B2118f47911a1f316';
      const tokenSymbol = this.onMainNet ? 'ZOOM' : 'ZOOM-DEV';
      const tokenDecimals = 18;
      const tokenImage = 'https://zoombies.world/images/zoombies_coin.svg';

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });
      } catch (error) {
        console.log('addCZXPtoMetaMask error:',error);
      }
    },
    buyCzxp: async function () {
      //console.log( new web3.utils.BN(this.totalCzxpToBuy).mul(new web3.utils.BN('1000000000000')).toString() );
      let buyinWei = new web3.utils.BN(this.totalCzxpToBuy).mul(new web3.utils.BN('100000000000')).toString();

      await this.CzxpInstance.methods.buy().send({
        from: this.coinbase,
        value: buyinWei,
      }).then((res) => {
         //console.log(res.status);
         if(res.status){
           this.updateSale();
         }
      }).catch((e) => {
        console.error(e);
      });
    },
    updateSale: async function () {
      //console.log(await this.CzxpInstance.methods.totalSupply().call());
      this.zoomWalletsRemaining = 1000 - await this.CzxpInstance.methods.totalContributors().call();
      this.zoomSold = parseInt(await this.CzxpInstance.methods.totalZoomPurchased().call()/1000000000000000000).toLocaleString();
      this.totalCzxpToBuy = "";
      this.movrCost = 0;
      //console.log("contr.total:",await this.CzxpInstance.methods.contributions(this.coinbase).call());
      this.myPurchaseTotal = parseInt(await this.CzxpInstance.methods.contributions(this.coinbase).call());
    },
    filterCzxpInput: function () {
      this.totalCzxpToBuy = this.totalCzxpToBuy.replace(/[^\d]/g, "");
      if( this.myPurchaseTotal + parseInt(this.totalCzxpToBuy * 100000000000) > 20000000000000000000 ){
        this.totalCzxpToBuy = (20000000000000000000 - this.myPurchaseTotal) /100000000000;
      }

      this.movrCost = parseFloat(this.totalCzxpToBuy / 10000000).toFixed(7);
    },
  },
  watch: {
    ZoombiesInstance(newVal) {
      if (newVal) {
        this.updateSale();
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.feature-panel {
  color: white;
  text-shadow: 1px 1px black;
  background: rgba(0,0,0, .35);
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


</style>
