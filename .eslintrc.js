module.exports = {
  env: {
    es6: true,
    commonjs: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: ['react', 'jest'],
  rules: {},
  globals: {
    after: true, // Mocha compatibility
    before: true, // Mocha compatibility
    waitFor: true,
    element: true,
    by: true,
  },
};
