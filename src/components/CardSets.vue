<template>
  <div>
    <main role="main" class="">
      <!--
        brown       - 585858
        light blue  - 03c1e8
        red         - d5005a
        purple      - b92ee4
    -->

      <div class="container">
        <h2>Zoombies World Card Type Collection</h2>
        <p>View the complete set of available card across the entire Zoombies World</p>
      </div>

      <div>

          <b-tabs pills card vertical>
            <b-tab title="Classic 1" active><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Classic 1"><b-card-text>Tab contents 1</b-card-text></b-tab>
            <b-tab title="Fairy Tale 1"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="Summer Camp"><b-card-text>Tab contents 3</b-card-text></b-tab>
          </b-tabs>

      </div>


    </main>
  </div>
</template>

<script>
import {
  BDropdown,
  BDropdownItem,
  BCard,
  BCardText,
  BTab,
  BTabs,
  BCardHeader,
  BButton,
  BCollapse,
  BCardBody,
  BFormInput,
  BIcon,
  BJumbotron
} from "bootstrap-vue";
export default {
  name: "CardSets",
  components: {
    BDropdown,
    BDropdownItem,
    BCard,
    BCardText,
    BTab,
    BTabs,
    BCardHeader,
    BButton,
    BCollapse,
    BCardBody,
    BFormInput,
    BJumbotron,
    BIcon
  },
  props: ["query"],
  data() {
    return {
      msg: "Here we go, here we go",
      wagerSample: 0,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h2 {
    margin-top:2em;
  }
</style>
