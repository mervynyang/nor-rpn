module.exports = {
  extends: [
    'eslint-config-tencent',
    'eslint-config-tencent/ts',
  ],
  overrides: [
    {
      files: [
        '**/*.test.ts',
      ],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'descriptor',
        ],
      },
    ],
  },
};
