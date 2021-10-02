<template>
  <div>
    <b-table
      :items="displayCards"
      :fields="tableFields"
      small
      striped
      responsive
      :selectable="!isOthersCrypt"
      select-mode="multi"
      ref="cryptTable"
      @row-selected="onRowSelected"
    >
      <template #cell(name)="row">
        <div class="flex">
          <input v-if="!isOthersCrypt" type="checkbox" v-bind:checked="isRowSelected(row.index)" @change="onChangeSelection(row.index)" />
          <div class="cell" :ref="'tableRow' + row.item.id" :data-id="row.item.id">
            <img :src="row.item.image" :class="`cell mr-4 ${row.item.rarity}`" />
            {{ row.item.name }}
          </div>
        </div>
      </template>
      <template #cell(card_level)="row">
        <div class="cell">
          {{ row.item.card_level }}
        </div>
      </template>
      <template #cell(edition_number)="row">
        <div class="cell">
          {{ row.item.edition_label }}
        </div>
      </template>
      <template #cell(unlock_zoom)="row">
        <div class="cell">
          {{ parseInt(row.item.unlock_czxp).toLocaleString() }}
        </div>
      </template>
      <template #cell(sacrifice_zoom)="row">
        <div class="cell">
          {{ parseInt(row.item.sacrifice_czxp).toLocaleString() }}
        </div>
      </template>
      <template #cell(sacrifice)="row">
        <div v-if="!isOthersCrypt" class="cell">
          <b-button
            size="md"
            variant="danger"
            :disabled="
              cardsBeingGifted[row.item.id] || cardsBeingSacrificed[row.item.id]
            "
            @click="sacrificeCards([row.item.id])"
          >
            <span class="emoji">☠️</span>
          </b-button>
        </div>
      </template>
      <template #cell(gift)="row">
        <div v-if="!isOthersCrypt" class="cell">
          <b-button
            size="md"
            variant="danger"
            :disabled="
              cardsBeingGifted[row.item.id] || cardsBeingSacrificed[row.item.id]
            "
            @click="openGiftModal(row.item.id)"
          >
            <b-icon-gift-fill />
          </b-button>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { BTable, BButton } from "bootstrap-vue";
export default {
  name: "CryptTable",
  components: {
    BTable,
    BButton,
  },
  emits: ["loadMore", "sacrificeCards", "giftCard"],
  props: {
    displayCards: {
      type: Array,
      default: [],
    },
    tableFields: {
      type: Array,
      default: [],
    },
    isOthersCrypt: {
      type: Boolean,
      default: false,
    },
    cardsBeingGifted: {
      type: Object,
      default: null,
    },
    cardsBeingSacrificed: {
      type: Object,
      default: null,
    },
    observer: {
      type: IntersectionObserver,
      default: null
    }
  },
  mounted() {
    this.observeRefs()
  },
  watch: {
    displayCards(val, oldVal) {
      if (val.length !== oldVal.length) {
        this.observeRefs()
      }
    }
  },
  methods: {
    sacrificeCards: function(id) {
      this.$emit("sacrificeCards", id);
    },
    openGiftModal: function(id) {
      this.$emit("giftCard", id);
    },
    loadMore: function() {
      this.$emit("loadMore");
    },
    isRowSelected: function(index) {
      return this.$refs.cryptTable && this.$refs.cryptTable.isRowSelected(index);
    },
    onRowSelected: function(items) {
      this.$store.dispatch('crypt/setSelectedCards', items)
    },
    onChangeSelection: function(index) {
      if (this.isRowSelected(index)) {
        this.$refs.cryptTable.unselectRow(index)
      } else {
        this.$refs.cryptTable.selectRow(index)
      }
    },
    observeRefs: function() {
      this.$nextTick(() => {
        Object.keys(this.$refs).forEach(refId => {
          const ref = this.$refs[refId]
          if (refId.includes('tableRow') && this.observer && ref) {
            this.observer.observe(ref)
          }
        })
      })
    }
  },
};
</script>

<style scoped lang="scss">
.card-bg {
  padding: 2px;
}

.card-bg-6 {
  background-color: rgba(84, 81, 97, 0.5);
  border: 2px solid rgb(84, 81, 97);
}

.card-bg-5 {
  background-color: rgba(43, 164, 250, 0.5);
  border: 2px solid rgb(43, 164, 250);
}

.card-bg-4 {
  background-color: rgba(202, 60, 44, 0.5);
  border: 2px solid rgb(202, 60, 44);
}

.card-bg-3 {
  background-color: rgba(87, 69, 229, 0.5);
  border: 2px solid rgb(87, 69, 229);
}

.table {
  background: white;

  .cell {
    min-height: 60px;

    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      height: 60px;
    }
  }
}

.flex {
  display: flex;
  align-items: center;

  input[type="checkbox"] {
    margin: 0 10px;
  }
}
</style>
