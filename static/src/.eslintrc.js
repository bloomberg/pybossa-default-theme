// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    browser: true,
  },
  extends: ["plugin:vue/essential",
  "plugin:prettier/recommended",
  "eslint:recommended"
],
  // required to lint *.vue files
  plugins: [
    'vue'
    ],
  // add your custom rules here
  rules: {

  }
}
