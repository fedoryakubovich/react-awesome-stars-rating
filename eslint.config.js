import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint
  .config(
    { ignores: ['dist', 'node_modules'] },
    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ['src/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx,json}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        import: importPlugin,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'react-refresh/only-export-components': 'off',
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'unknown'],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
        '@typescript-eslint/no-unused-vars': 'error',
      },
      settings: { 'import/resolver': { typescript: true, node: true } },
    },
  )
  .concat(eslintPluginPrettier);
