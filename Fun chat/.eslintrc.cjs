module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    // "eslint:recommended",
    //   "plugin:@typescript-eslint/recommended",
    'airbnb',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],

  ignorePatterns: ['src/vite.config.ts'],
   
  rules: {
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-console': 'off',
     "@typescript-eslint/indent": "off",
  },
  "settings": {
    "import/resolver": {
      "typescript": {}
    }
  }
};
