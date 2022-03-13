<template>
  <div class="event-notification-wrapper">
    <h1 v-if="getEventTypeText">{{ getEventTypeText }}</h1>
    <div v-if="eventType === getEventTypes.zoomMint">
      <p>
        <router-link :to="computeWalletLink(zoomMinted.toAddress)">
          {{ createDottedAddress(zoomMinted.toAddress) }}
        </router-link>
        <span class="zoom-minted-text">received</span>
        +{{ zoomMinted.zoomAmount }}
        <img
          class="zoom-token-icon"
          alt="zoom coin"
          src="@/assets/zoomTokenCoin.svg"
        />
      </p>
    </div>
    <div v-else-if="eventType === getEventTypes.zoomBurn">
      <p>
        <router-link :to="computeWalletLink(zoomBurned.fromAddress)">
          {{ createDottedAddress(zoomBurned.fromAddress) }}
        </router-link>
        <span style="color: #cc0000">burned</span>
        {{ zoomBurned.zoomAmount }}
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
          {{ cardMintedData.booster ? "Booster" : "Shop" }}
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
    <div v-else-if="eventType === getEventTypes.dailyReward">
      <p>
        <router-link :to="computeWalletLink(dailyReward.address)">
          {{ createDottedAddress(dailyReward.address) }}
        </router-link>
        claimed 2 FREE boosters,
        {{ dailyReward.newBoosterBalance }} remaining.
      </p>
    </div>
    <div v-else-if="eventType === getEventTypes.boosterReward">
      <p>
        <router-link :to="computeWalletLink(boosterCreditReward.winner)">
          {{ createDottedAddress(boosterCreditReward.winner) }}
        </router-link>
        <span style="color: #6aa84f">WON</span>
        {{ boosterCreditReward.boosterAwarded }} booster credits in a giveaway!
      </p>
      <a href="https://discord.gg/eDXvJKUZgQ" target="_blank">
        Join Discord to learn more!
      </a>
    </div>
    <div v-else-if="eventType === getEventTypes.transfer && transferCardData">
      <p>
        <router-link :to="computeWalletLink(transferCardData.from)">
          {{ createDottedAddress(transferCardData.from) }}
        </router-link>
        transferred NFT
        <span :class="transferCardData.rarityClass"
          >{{ transferCardData.cardName }} #{{
            transferCardData.currentEdition
          }}
        </span>
        to
        <router-link :to="computeWalletLink(transferCardData.to)">
          {{ createDottedAddress(transferCardData.to) }}
        </router-link>
      </p>
    </div>
    <div
      v-else-if="eventType === getEventTypes.sacrificeNFT && sacrificedCardData"
    >
      <p>
        <router-link :to="sacrificedCardData.addressNFTLink">
          {{ createDottedAddress(sacrificedCardData.address) }}
        </router-link>
        <span style="color: #990000">sacrificed</span>
        <b>
          {{ sacrificedCardData.booster ? "Booster" : "Shop" }}
          NFT
        </b>
        <span>
          <router-link
            :class="sacrificedCardData.rarityClass"
            :to="sacrificedCardData.viewNFTLink"
          >
            {{ sacrificedCardData.name }}
          </router-link>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import {
  EVENT_TYPES,
  processCardMintedEvent,
  processDailyRewardEvent,
  processRewardBoosterEvent,
  processSacrificeNFTEvent,
  processTransferEvent,
} from "../util/watcherUtil";
import { ethers } from "ethers";
import { getCardType, getNftByTokenId } from "../util/cardUtil";
import { mapGetters } from "vuex";

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
        case EVENT_TYPES.zoomBurn:
          return "Zoom Burned";
        case EVENT_TYPES.sponsorReward:
          return "Sponsor Reward";
        case EVENT_TYPES.dailyReward:
          return "Daily Reward";
        case EVENT_TYPES.boosterReward:
          return "Booster Reward";
        case EVENT_TYPES.sacrificeNFT:
          return "NFT Sacrificed";
        case EVENT_TYPES.cardTypeLoaded:
          return "Card type loaded";
        case EVENT_TYPES.transfer:
          return "Zoombies Transfered";
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
    zoomBurned: function () {
      const data = this.eventData.args;
      const fromAddress = data[0];
      const zoomAmount = parseInt(ethers.utils.formatEther(data[2]));

      return {
        zoomAmount,
        fromAddress,
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
    dailyReward: function () {
      const data = this.eventData.args;
      return processDailyRewardEvent(data);
    },
    boosterCreditReward: function () {
      const data = this.eventData.args;

      return processRewardBoosterEvent(data);
    },
    ...mapGetters({
      getReadOnlyZoombiesContract: "blockChain/getReadOnlyZoombiesContract",
    }),
  },
  data() {
    return {
      isLoadingCardInfo: true,
      cardMintedData: null,
      sacrificedCardData: null,
      transferCardData: null,
    };
  },
  async mounted() {
    if (this.eventType === EVENT_TYPES.cardMinted) {
      await this.computeCardMintedMessage();
    }

    if (this.eventType === EVENT_TYPES.sacrificeNFT) {
      await this.computeSacrificedNFTMessage();
    }

    if (this.eventType === EVENT_TYPES.transfer) {
      await this.computeTransferNFTMessage();
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
      const {
        address,
        tokenId,
        cardTypeId,
        editionNumber,
      } = processCardMintedEvent(this.eventData.args);

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

      const extractedInfo = {
        address: this.createDottedAddress(address),
        addressNFTLink: this.computeWalletLink(address),
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
    computeTransferNFTMessage: async function () {
      const data = this.eventData.args;
      const transferData = processTransferEvent(data);

      const cardInfo = await getNftByTokenId(
        transferData.tokenId,
        this.getReadOnlyZoombiesContract
      );

      const rarity = cardInfo.cardData.attributes.filter((attribute) => {
        if (attribute.trait_type === "rarity") return true;
        return false;
      })[0].value;
      const rarityClass = this.computeRarityClass(rarity.toLowerCase());

      this.transferCardData = {
        from: transferData.fromAddress,
        to: transferData.toAddress,
        cardName: cardInfo.cardData.name,
        currentEdition: cardInfo.currentEdition,
        rarityClass,
      };
    },
    computeSacrificedNFTMessage: async function () {
      const data = this.eventData.args;

      const sacrificeData = processSacrificeNFTEvent(data);
      const cardInStore = this.$store.getters.getCardByTypeId(
        sacrificeData.cardTypeId
      );

      if (cardInStore) {
        const rarity = cardInStore.attributes.filter((attribute) => {
          if (attribute.trait_type === "rarity") return true;
          return false;
        })[0].value;
        const rarityClass = this.computeRarityClass(rarity.toLowerCase());
        const isBooster =
          cardInStore.attributes.filter((attribute) => {
            if (attribute.trait_type === "in_store") return true;
            return false;
          })[0].value === "Booster";

        this.sacrificedCardData = {
          address: sacrificeData.address,
          addressNFTLink: this.computeWalletLink(sacrificeData.address),
          booster: isBooster,
          name: cardInfo.name,
          rarityClass: rarityClass,
          viewNFTLink: this.computeViewNFTLink(sacrificeData.tokenId),
        };

        return;
      }

      const cardInfo = await getCardType(sacrificeData.cardTypeId);
      const rarity = cardInfo.attributes.filter((attribute) => {
        if (attribute.trait_type === "rarity") return true;
        return false;
      })[0].value;
      const rarityClass = this.computeRarityClass(rarity.toLowerCase());
      const isBooster =
        cardInfo.attributes.filter((attribute) => {
          if (attribute.trait_type === "in_store") return true;
          return false;
        })[0].value === "Booster";

      const extractedInfo = {
        address: sacrificeData.address,
        addressNFTLink: this.computeWalletLink(sacrificeData.address),
        booster: isBooster,
        name: cardInfo.name,
        rarityClass: rarityClass,
        viewNFTLink: this.computeViewNFTLink(sacrificeData.tokenId),
      };

      this.sacrificedCardData = extractedInfo;
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
  background-color: rgba(0, 0, 0, 0.25);

  h1 {
    font-size: 1rem;
    color: white;
    font-weight: bold;
  }

  .zoom-token-icon {
    width: 30px;
    height: 30px;
  }

  p {
    color: white;
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
