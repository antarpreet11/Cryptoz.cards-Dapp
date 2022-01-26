<template>
  <div class="event-notification-wrapper">
    <h1>Event Type: {{ getEventTypeText }}</h1>
    <div v-if="eventType === getEventTypes.zoomMint"></div>
  </div>
</template>

<script>
import {
  EVENT_TYPES,
  ZoomTokenInterface,
  ZoombiesInterface,
} from "../util/watcherUtil";

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
          return "Zoom Mint";
        case EVENT_TYPES.cardMinted:
          return "Card Minted";
        case EVENT_TYPES.packOpened:
          return "Pack Opened";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.event-notification-wrapper {
  padding: 16px;
  border: 1px solid white;
  margin: 8px 0px;

  h1 {
    font-size: 0.75rem;
  }
}
</style>
