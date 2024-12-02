import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

export default ts.config(
  {
    files: [
      '**/src/**/*.ts',
    ],
  },
  {
    ignores: [
      '**/dist/**/*',
      '**/rollup.config.mjs',
      'rollup.config.mjs',
      '**/eslint.config.mjs',
      'eslint.config.mjs',
    ],
  },
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  ...ts.configs.stylisticTypeChecked,
  stylistic.configs.customize({
    arrowParens: true,
    semi: true,
    flat: true,
  }),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
