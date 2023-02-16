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
    BContainer,
    BRow,
    BCol,
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
      getSignedZoombiesContract: "blockChain/getSignedZoombiesContract",
    }),
    metamaskInstalled: () => {
      return isMetamaskInstalled();
    },
  },
  beforeUnmount() {
  },
  mounted() {
    if (
      this.getChainId == 1285 ||
      window.location.pathname == "/moonriver" ||
      window.location.pathname == '/'
    ) {
      this.onMainNet = true;
    } else {
      this.onMainNet = false;
    }
  },
  watch: {
    getSignedZoombiesContract: async function() {
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
