<template>
  <div>
    <main role="main" class="container">
      <!--
        brown       - 585858
        light blue  - 03c1e8
        red         - d5005a
        purple      - b92ee4
    -->


      <h2>Zoombies World Card Type Collection</h2>
      <p>View the complete set of available card across the entire Zoombies World</p>

      <div>
        <b-dropdown id="dropdown-1" text="Dropdown Button" class="m-md-2">
          <b-dropdown-item>First Action</b-dropdown-item>
          <b-dropdown-item>Second Action</b-dropdown-item>
          <b-dropdown-item>Third Action</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item active>Active action</b-dropdown-item>
          <b-dropdown-item disabled>Disabled action</b-dropdown-item>
        </b-dropdown>
      </div>


    </main>
  </div>
</template>

<script>
import {
  BDropdown,
  BDropdownItem,
  BCard,
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
