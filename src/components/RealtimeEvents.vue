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
        :event-type="event.type"
        :event-data="event.data"
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
