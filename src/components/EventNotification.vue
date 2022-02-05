<template>
  <div class="event-notification-wrapper">
    <h1 v-if="getEventTypeText">{{ getEventTypeText }}</h1>
    <div v-if="eventType === getEventTypes.zoomMint">
      <p>
        <router-link :to="computeWalletLink(zoomMinted.toAddress)">
          {{ createDottedAddress(zoomMinted.toAddress) }}
        </router-link>
        <span class="zoom-minted-text">received</span>
        {{ zoomMinted.zoomAmount }}
        <img
          class="zoom-token-icon"
          alt="zoom coin"
          src="@/assets/zoomTokenCoin.svg"
        />
      </p>
    </div>
    <div v-else-if="eventType === getEventTypes.packOpened">
      <p>
        <router-link :to="packOpened.addressNFTLink">
          {{ packOpened.address }}
        </router-link>
        minted
        {{ processRarity(packOpened.rarity).prefix }}
        <span :class="processRarity(packOpened.rarity).class">
          {{ processRarity(packOpened.rarity).text }}
        </span>
        booster
      </p>
    </div>
    <div v-else-if="eventType === getEventTypes.cardMinted">
      <p v-if="cardMintedData">
        <router-link :to="cardMintedData.addressNFTLink">
          {{ cardMintedData.address }}
        </router-link>
        <span style="color: #6aa84f">minted</span> a new
        <b>
          {{ cardMintedData.zombieType }}
          {{ cardMintedData.booster ? "Booster" : "" }}
        </b>
        NFT
        <span>
          <router-link
            :class="cardMintedData.rarityClass"
            :to="cardMintedData.viewNFTLink"
          >
            {{ cardMintedData.name }}
            {{ `#${cardMintedData.editionNumber}` }}
          </router-link>
        </span>
        from
        <b>{{ cardMintedData.cardSet }}</b>
      </p>
    </div>
  </div>
</template>

<script>
import { EVENT_TYPES } from "../util/watcherUtil";
import { ethers } from "ethers";
import { getCardType } from "../util/cardUtil";

export default {
  name: "EventNotification",
  props: ["eventData", "eventType"],
  computed: {
    getEventTypes() {
      return EVENT_TYPES;
    },
    getEventTypeText: function () {
      switch (this.eventType) {
        case EVENT_TYPES.zoomMint:
          return "Zoom Minted";
        case EVENT_TYPES.cardMinted:
          return "Card Minted";
        case EVENT_TYPES.packOpened:
          return "Pack Opened";
        default:
          return null;
      }
    },
    zoomMinted: function () {
      const data = this.eventData.args;
      const toAddress = data[1];
      const zoomAmount = parseInt(ethers.utils.formatEther(data[2]));

      return {
        zoomAmount,
        toAddress,
      };
    },
    packOpened: function () {
      const data = this.eventData.args;
      const address = this.createDottedAddress(data[0]);
      const rarity = data[1];

      return {
        address,
        addressNFTLink: this.computeWalletLink(data[0]),
        rarity,
      };
    },
  },
  data() {
    return {
      isLoadingCardInfo: true,
      cardMintedData: null,
    };
  },
  async mounted() {
    if (this.eventType === EVENT_TYPES.cardMinted) {
      await this.computeCardMintedMessage();
    }
  },
  methods: {
    createDottedAddress: function (address) {
      return `${address.substring(0, 5)}....${address.substring(
        address.length - 3,
        address.length
      )}`;
    },
    computeWalletLink: function (address) {
      return `/my-zoombies-nfts/${address}`;
    },
    computeViewNFTLink: function (tokenId) {
      return `/view/${tokenId}`;
    },
    processRarity: function (rarity) {
      switch (rarity) {
        case 3:
          return {
            text: "EPIC",
            class: "epic-text",
            prefix: "an",
          };
        case 4:
          return {
            text: "RARE",
            class: "rare-text",
            prefix: "a",
          };
        case 5:
          return {
            text: "UNCOMMON",
            class: "uncommon-text",
            prefix: "an",
          };
        case 6:
          return {
            text: "COMMON",
            class: "common-text",
            prefix: "a",
          };
        default:
          return null;
      }
    },
    computeRarityClass: function (rarity) {
      switch (rarity) {
        case "common":
          return "common-text";
        case "uncommon":
          return "uncommon-text";
        case "rare":
          return "rare-text";
        case "epic":
          return "epic-text";
        default:
          return null;
      }
    },
    computeCardMintedMessage: async function () {
      const data = this.eventData.args;
      const address = this.createDottedAddress(data[0]);
      const tokenId = ethers.BigNumber.from(data[1]).toNumber();
      const cardTypeId = data[2];
      const editionNumber = ethers.BigNumber.from(data[3]).toNumber();

      const cardInfo = await getCardType(cardTypeId);
      const rarity = cardInfo.attributes.filter((attribute) => {
        if (attribute.trait_type === "rarity") return true;
        return false;
      })[0].value;
      const rarityClass = this.computeRarityClass(rarity.toLowerCase());

      const cardSet = cardInfo.attributes.filter((attribute) => {
        if (attribute.trait_type === "card_set") return true;
        return false;
      })[0].value;
      const isBooster =
        cardInfo.attributes.filter((attribute) => {
          if (attribute.trait_type === "in_store") return true;
          return false;
        })[0].value === "Booster";
      const zombieType = cardInfo.attributes.filter((attribute) => {
        if (attribute.trait_type === "zombie_type") return true;
        return false;
      })[0].value;

      console.log(cardInfo);
      const extractedInfo = {
        address,
        addressNFTLink: this.computeWalletLink(data[0]),
        zombieType: zombieType,
        booster: isBooster,
        name: cardInfo.name,
        editionNumber,
        cardSet: cardSet,
        rarityClass: rarityClass,
        viewNFTLink: this.computeViewNFTLink(tokenId),
      };

      this.cardMintedData = extractedInfo;
      this.isLoadingCardInfo = false;
    },
  },
};
</script>

<style scoped lang="scss">
.event-notification-wrapper {
  padding: 16px;
  border: 1px solid white;
  margin: 8px 0px;
  min-height: 90px;
  border-radius: 8px;
  background-color: lightgrey;

  h1 {
    font-size: 1rem;
    color: black;
    font-weight: bold;
  }

  .zoom-token-icon {
    width: 30px;
    height: 30px;
  }

  p {
    color: black;
  }

  .zoom-minted-text {
    color: green;
  }
}

.epic-text {
  color: rgb(87, 69, 229);
}

.rare-text {
  color: rgb(202, 60, 44);
}

.uncommon-text {
  color: rgb(43, 164, 250);
}

.common-text {
  color: rgb(84, 81, 97);
}

.epic-text,
.rare-text,
.uncommon-text,
.common-text {
  font-weight: bold;
}
</style>
