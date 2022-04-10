module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    "plugin:vue/vue3-recommended",
    "prettier",
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "vue/require-prop-types": "off",
    "vue/prop-name-casing": "off",
    "vue/no-deprecated-destroyed-lifecycle": "warn",
    "vue/order-in-components": "off",
    "vue/valid-v-for": "off",
  },
};
