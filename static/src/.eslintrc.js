// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: "module",
    ecmaVersion: 2017
  },
  env: {
    browser: true,
  },
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  // https://github.com/vuejs/eslint-plugin-vue
  extends: [
    'plugin:vue/recommended',
    "standard",
  ],
  // custom rules here
  rules: {
    //require semicolons
    'semi': [2, "always"],

    // turn off default prop required
    'vue/require-default-prop': 0,

    // allow async-await
    'generator-star-spacing': 0,

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
