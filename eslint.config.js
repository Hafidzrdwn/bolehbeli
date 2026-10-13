import js from '@eslint/js'
import configPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

export default ts.config(
  {
    ignores: ['dist/**', 'node_modules/**', '.vscode/**', 'public/**', 'docs/**'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    rules: {
      'no-undef': 'off',
      'vue/no-v-html': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'warn',
      'max-lines': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 40, skipBlankLines: true, skipComments: true }],
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,vue}'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'vue/require-default-prop': 'off',
    },
  },
  configPrettier,
)
