<template>
  <div class="row-col">
    <p>
      <strong>
        <number
          ref="zoomBal"
          :from="fromZoomBalance"
          :to="toZoomBalance"
          :format="formatNumber"
          :duration="3.5"
        />
        ZOOM {{ " " }}
        <img
          class="czxp-logo"
          src="@/assets/zoomTokenCoin.svg"
          alt="zoom coin"
        />
        tokens
      </strong>
      {{ " " }}in ZWorld
    </p>
    <p>
      <strong>
        <number
          ref="nftTypes"
          :from="fromNftTypes"
          :to="toNftTypes"
          :format="formatNumber"
          :duration="3.5"
        />
        Mintable types
      </strong>
      in shop and boosters
    </p>
    <p>
      <b-button
        v-if="isInOwnCrypt"
        v-b-tooltip.hover="'View probability of mint by rarity'"
        v-b-modal="'open-probability-modal'"
        class="btn"
        variant="info"
      >
        <b-icon-pie-chart-fill />
      </b-button>
      <strong>
        <number
          ref="nftSupply"
          :from="fromNftSupply"
          :to="toNftSupply"
          :format="formatNumber"
          :duration="3.5"
        />
        NFTs
      </strong>
      in ZWorld
    </p>
  </div>
</template>
<script>
import { BButton } from "bootstrap-vue";
import { mapGetters } from "vuex";

export default {
  name: "UniverseBalances",
  props: {
    isInOwnCrypt: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newZoomBalance: null,
      prevZoomBalance: null,
      newNftTypes: null,
      prevNftTypes: null,
      newNftSupply: null,
      prevNftSupply: null,
    };
  },
  components: {
    BButton,
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
  },
  computed: {
    fromZoomBalance() {
      return this.prevZoomBalance || this.getZoomBalance;
    },
    toZoomBalance() {
      return this.newZoomBalance || this.getZoomBalance;
    },
    fromNftSupply() {
      return this.prevNftSupply || this.getTotalNftSupply;
    },
    toNftSupply() {
      return this.newNftSupply || this.getTotalNftSupply;
    },
    fromNftTypes() {
      return this.prevNftTypes || this.getTotalNftTypes;
    },
    toNftTypes() {
      return this.newNftTypes || this.getTotalNftTypes;
    },
    ...mapGetters({
      getZoomBalance: "blockChain/getZoomBalance",
      getTotalNftSupply: "blockChain/getTotalNftSupply",
      getTotalNftTypes: "blockChain/getTotalNftTypes",
    }),
  },
  watch: {
    getZoomBalance(newVal, oldVal) {
      this.newZoomBalance = newVal;
      this.prevZoomBalance = oldVal;
      if (oldVal > 0) {
        this.pulsateText(this.$refs.zoomBal);
      }
    },
    getTotalNftSupply(newVal, oldVal) {
      this.newNftSupply = newVal;
      this.prevNftSupply = oldVal;
      if (oldVal > 0) {
        this.pulsateText(this.$refs.nftSupply);
      }
    },
    getTotalNftTypes(newVal, oldVal) {
      this.newNftTypes = newVal;
      this.prevNftTypes = oldVal;
      if (oldVal > 0) {
        this.pulsateText(this.$refs.nftTypes);
      }
    },
  },
};
</script>
<style scoped>
p {
  padding-left: 10px;
  margin-bottom: 0;
}

.btn {
  margin-right: 5px;
}

.czxp-logo {
  width: 20px;
  height: 20px;
  margin-right: 2px;
}

.row-col {
  display: flex;
  flex-direction: column;

  margin: 20px 0;
}

@media screen and (min-width: 600px) {
  .row-col {
    flex-direction: row;
    justify-content: space-between;
  }
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
</style>
