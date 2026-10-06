import reactConfig from 'eslint-config-opencollective/eslint-react.config.cjs';
import globals from 'globals';

export default [
  ...reactConfig,
  {
    settings: {
      // The TypeScript resolver follows the `exports` field of package.json, like Node: needed for
      // ESM-only packages without a root index.js
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  {
    files: ['**/__tests__/**', 'test/**'],
    languageOptions: { globals: globals.jest },
  },
  {
    rules: {
      'no-console': 'warn',
      'require-await': 'warn',
      'no-constant-condition': ['warn', { checkLoops: false }],
      'require-atomic-updates': 'warn',
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
    },
  },
  {
    // Build and tooling configuration, tests and scripts: devDependencies are available
    files: [
      '*.config.js',
      '*.config.mjs',
      '**/__tests__/**',
      'test/**',
      'scripts/**',
    ],
    rules: {
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off',
    },
  },
  {
    ignores: ['dist/**', '.next/**', 'coverage/**', 'next-env.d.ts'],
  },
];
