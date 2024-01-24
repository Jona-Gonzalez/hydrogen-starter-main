/**
 * @type {import("@types/eslint").Linter.BaseConfig}
 */
module.exports = {
  extends: ['plugin:hydrogen/recommended', 'plugin:hydrogen/typescript'],
  rules: {
    'no-console': 'off',
    'no-inline-styles': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/forbid-prop-types': 'off',
    'react/no-array-index-key': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
  },
  globals: {
    document: true,
    window: true,
  },
};
