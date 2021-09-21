<template>
  <div class="dropdown-wrapper">
    <div>
      <b-dropdown
        id="dropdown"
        :disabled="disabled"
        :text="'Sort By ' + (sortType ? types[sortType] : '')"
      >
        <!--b-dropdown-item v-if="sortType" @click="clearSortFilter">Clear Sorting</b-dropdown-item-->
        <b-dropdown-item
          v-for="(name, type) in types"
          :key="type"
          @click="changeSort(type)"
          :active="type === sortType"
        >
          {{ name }}
        </b-dropdown-item>
      </b-dropdown>
      <b-button
        v-if="sortType"
        id="toggle-order-button"
        v-b-tooltip.hover="'Toggle sort order'"
        @click="toggleOrder"
      >
        {{ isDescending ? "➘" : "➚" }}
      </b-button>
    </div>
    <!--b-button
      v-if="isSorting"
      class="clear-sorting"
      variant="outline-warning"
      @click="clearSortFilter"
    >
      Clear Sort Filter
    </b-button-->
  </div>
</template>

<script>
import { BDropdown, BDropdownItem, BButton } from "bootstrap-vue";
export default {
  name: "SortDropdown",
  components: {
    BDropdown,
    BDropdownItem,
    BButton,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["sort-by-attr"],
  data() {
    return {
      isDescending: false,
      sortType: null,
      types: {
        name: "Name",
        rarity: "Rarity",
        cost: "Cost",
        card_set: "Card Set",
        edition_number: "Edition Number",
        card_level: "Level",
        unlock_czxp: "Unlock ZOOM",
        buy_czxp: "Buy ZOOM",
        sacrifice_czxp: "Sacrifice ZOOM",
        release_time: "Date Released",
      },
    };
  },
  methods: {
    changeSort(param) {
      if (this.sortType === param) {
        this.sortType = null;
      }
      else {
        this.sortType = param;
      }
      this.callSort(param)
    },
    callSort(param) {
      this.$emit("sort-by-attr", param, this.isDescending);
    },
    toggleOrder() {
      this.isDescending = !this.isDescending;
      this.callSort(this.sortType);
    },
    clearSortFilter() {
      this.sortType = null;
      this.$emit("sort-by-attr", null, this.isDescending);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#toggle-order-button {
  margin-left: 0.15rem;
}

.clear-sorting {
  margin-top: 10px;
}

.dropdown-wrapper {
  display: flex;
  flex-direction: row;

  & button {
    white-space: nowrap !important;
  }
}

/* Desktop CSS */
@media only screen and (min-width: 500px) {
  .clear-sorting {
    margin-top: 0px;
    margin-left: 16px;
    max-width: 250px;
  }
}
</style>
