/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "airbnb-base",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  plugins: ["@typescript-eslint", "vue", "simple-import-sort"],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".js", ".jsx", ".json", ".vue"],
      },
    },
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["**vite**", "**@vitejs**"],
        optionalDependencies: false,
      },
    ],
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          [
            "^vue",
            "^@?\\w",
            "^@(/.*|$)",
            "^\\.\\.(?!/?$)",
            "^\\.\\./?$",
            "^\\./(?=.*/)(?!/?$)",
            "^\\.(?!/?$)",
            "^\\./?$",
            "^.+\\.?(css|less|scss)$",
            "^\\u0000",
          ],
        ],
      },
    ],
  },
};
