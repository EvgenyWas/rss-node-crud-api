import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'none',
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
        },
      ],
    },
  },
  { ignores: ['node_modules', 'dist/*'] },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
];
