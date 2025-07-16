import globals from 'globals';
import eslintPluginVue from 'eslint-plugin-vue';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ["dev-dist/*", "dist/*", "node_modules/*", "minify-json.js", ".git/*", ".vscode/*"],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        'console': 'readonly',
      }
    },
    plugins: {
      vue: eslintPluginVue,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintPluginVue.configs['flat/recommended'].rules,
      ...prettierConfig.rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'warn'
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        'console': 'readonly',
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      'no-unused-vars': 'warn',
      'no-undef': 'warn'
    }
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      }
    }
  }
];
