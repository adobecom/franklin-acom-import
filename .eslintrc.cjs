module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  rules: {
    // allow reassigning param
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', 'unix'],
    'import/extensions': ['error', {
      js: 'always',
    }],
  },
  plugins: ['import'],
  settings: {
    'import/resolver': {
      exports: {},
    },
  },
};
