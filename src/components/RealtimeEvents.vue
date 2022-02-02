<template>
  <div class="events-container">
    <div class="clear-button-wrapper">
      <b-button :disabled="getEventCount === 0" @click="() => clearEvents()"
        >Clear all events</b-button
      >
    </div>
    <p v-if="getEventCount === 0">No events yet.</p>
    <div class="events-wrapper">
      <event-notification
        v-for="event in getEvents"
        :key="uniqueId()"
        :eventType="event.type"
        :eventData="event.data"
      ></event-notification>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BButton } from "bootstrap-vue";
import EventNotification from "./EventNotification.vue";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "RealtimeEvents",
  components: {
    BButton,
    EventNotification,
  },
  data() {
    return {
      fakeEvents: [
        {
          type: "zoomMint",
          data: {
            eventFragment: {
              name: "Transfer",
              anonymous: false,
              inputs: [
                {
                  name: "from",
                  type: "address",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint256",
                  _isParamType: true,
                },
              ],
              type: "event",
              _isFragment: true,
            },
            name: "Transfer",
            signature: "Transfer(address,address,uint256)",
            topic:
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            args: [
              "0x0000000000000000000000000000000000000000",
              "0xE701424800EFeDD679B60D9A49aaf9488547441D",
              { _hex: "0x1bc16d674ec80000", _isBigNumber: true },
            ],
          },
          hash:
            "0x89d8adfbe4d72e0b1fc62294dc63c6accc62badbec60d09191fe701be8fceeea",
        },
        {
          type: "packOpened",
          data: {
            eventFragment: {
              name: "LogPackOpened",
              anonymous: false,
              inputs: [
                {
                  name: "buyer",
                  type: "address",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "rarity",
                  type: "uint8",
                  indexed: false,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint8",
                  _isParamType: true,
                },
              ],
              type: "event",
              _isFragment: true,
            },
            name: "LogPackOpened",
            signature: "LogPackOpened(address,uint8)",
            topic:
              "0x9110cd00ebf5075b22eead1dbb6c4f4c5b7bd329bc646333c004dfb9e8c21f0b",
            args: ["0xE701424800EFeDD679B60D9A49aaf9488547441D", 6],
          },
          hash:
            "0x89d8adfbe4d72e0b1fc62294dc63c6accc62badbec60d09191fe701be8fceeea",
        },
        {
          type: "cardMinted",
          data: {
            eventFragment: {
              name: "LogCardMinted",
              anonymous: false,
              inputs: [
                {
                  name: "buyer",
                  type: "address",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "tokenId",
                  type: "uint256",
                  indexed: false,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint256",
                  _isParamType: true,
                },
                {
                  name: "cardTypeId",
                  type: "uint32",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint32",
                  _isParamType: true,
                },
                {
                  name: "editionNumber",
                  type: "uint256",
                  indexed: false,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint256",
                  _isParamType: true,
                },
              ],
              type: "event",
              _isFragment: true,
            },
            name: "LogCardMinted",
            signature: "LogCardMinted(address,uint256,uint32,uint256)",
            topic:
              "0x36e996ba214404b0a557ef87433cf92f99d6f4e07c2ca5b7cf72a95d7ac7f09f",
            args: [
              "0xE701424800EFeDD679B60D9A49aaf9488547441D",
              { _hex: "0x1e14", _isBigNumber: true },
              140,
              { _hex: "0x28", _isBigNumber: true },
            ],
          },
          hash:
            "0x89d8adfbe4d72e0b1fc62294dc63c6accc62badbec60d09191fe701be8fceeea",
        },
      ],
    };
  },
  methods: {
    clearEvents() {
      this.$store.dispatch("events/clearEvents");
    },
    uniqueId() {
      return uuidv4();
    },
  },
  computed: {
    ...mapGetters({
      getEventCount: "events/getEventCount",
      getEvents: "events/getEvents",
    }),
  },
};
</script>

<style scoped lang="scss">
.events-container {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: 24px 8px;
}

p {
  margin-top: 8px;
  text-align: center;
}

.events-wrapper {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: 8px;
}
</style>
