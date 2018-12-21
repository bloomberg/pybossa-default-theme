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
  extends: [
    'eslint:recommended',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/recommended',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ['error', 4],
    'semi': 'off',
    'comma-dangle': [2, 'only-multiline'],
    'no-control-regex': 2,
    'no-debugger': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty-character-class': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-extra-semi': 2,
    'no-func-assign': 2,
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-negated-in-lhs': 2,
    'no-obj-calls': 2,
    'no-proto': 2,
    'no-unexpected-multiline': 2,
    'no-unreachable': 2,
    'use-isnan': 2,
    'valid-typeof': 2,
    'no-console': 0,

    // Best Practices
    // http://eslint.org/docs/rules/#best-practices
    'no-fallthrough': 2,
    'no-octal': 2,
    'no-redeclare': 2,
    'no-self-assign': 2,
    'no-unused-labels': 2,

    // Strict Mode
    // http://eslint.org/docs/rules/#strict-mode
    'strict': [2, 'global'],

    // Variables
    // http://eslint.org/docs/rules/#variables
    'no-delete-var': 2,
    'no-undef': 2,
    'no-unused-vars': [2],

    // Node.js and CommonJS
    // http://eslint.org/docs/rules/#nodejs-and-commonjs
    'no-mixed-requires': 2,
    'no-new-require': 2,
    'no-path-concat': 2,
    'no-restricted-modules': [2, 'sys', '_linklist'],

    // Stylistic Issues
    // http://eslint.org/docs/rules/#stylistic-issues
    'comma-spacing': 1,
    'eol-last': 1,
    'indent': [1, 4, {SwitchCase: 1}],
    'keyword-spacing': 2,
    'max-len': [1, 100, 2],
    'new-parens': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-multiple-empty-lines': [1, {max: 2}],
    'no-trailing-spaces': 2,
    'quotes': [1, 'single', 'avoid-escape'],
    'semi': 2,
    'space-before-blocks': [1, 'always'],
    'space-before-function-paren': [1, 'always'],
    'space-in-parens': [1, 'never'],
    'space-infix-ops': 2,
    'space-unary-ops': 2,

    // ECMAScript 6
    // http://eslint.org/docs/rules/#ecmascript-6
    'arrow-parens': [1, 'always'],
    'arrow-spacing': [1, {'before': true, 'after': true}],
    'constructor-super': 2,
    'no-class-assign': 2,
    'no-confusing-arrow': 2,
    'no-const-assign': 2,
    'no-dupe-class-members': 2,
    'no-new-symbol': 2,
    'no-this-before-super': 2,
    'prefer-const': 2,

    // Custom rules in tools/eslint-rules
    'spaced-comment': [2, 'always']
    
    
  }
}
