module.exports = {
  env: {
    es6: true,
    node: true,
    commonjs: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['jest'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  globals: {
    after: true, // Mocha compatibility
    before: true, // Mocha compatibility
    waitFor: true,
    element: true,
    by: true,
  },
};
