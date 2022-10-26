const prettierConfig = require('./prettierrc.config')
module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierConfig],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
