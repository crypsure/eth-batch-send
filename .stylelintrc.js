module.exports = {
  root: true,
  extends: 'stylelint-config-standard',
  rules: {
    'at-rule-empty-line-before': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['include', 'mixin'],
      },
    ],
    'declaration-empty-line-before': null,
    'at-rule-semicolon-space-before': 'never',
    'rule-empty-line-before': null,
    'selector-list-comma-newline-after': null,
  },
}
