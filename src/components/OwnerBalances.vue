<template>
  <div v-if="isWalletConnected" id="container" class="row-col">
    <p>
      <strong>Your Zoombies NFTs:</strong> {{ getNftOwned.toLocaleString() }}
    </p>
    <p>
      <strong
        >Your ZOOM
        <img
          class="czxp-logo"
          src="@/assets/zoomTokenCoin.svg"
          alt="zoom coin"
          align="middle"
        />
        Balance:</strong
      >
      {{ getZoomBalance.toLocaleString() }}
    </p>
  </div>
</template>
<script>
import dAppStates from "@/dAppStates";
import { mapGetters } from "vuex";

export default {
  name: "OwnerBalances",
  computed: {
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    ...mapGetters({
      getNftOwned: "blockChain/getNftOwned",
      getZoomBalance: "blockChain/getZoomBalance",
    }),
  },
};
</script>
<style scoped lang="scss">
#container {
  margin: 20px 0;
}

p {
  padding-left: 10px;
  margin-bottom: 0;
  color: pink;

  strong {
    color: aqua;
    font-weight: 400;
  }
}

.czxp-logo {
  width: 20px;
  height: 20px;
}

.row-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media screen and (min-width: 600px) {
  .row-col {
    align-items: flex-start;
  }
}
</style>
