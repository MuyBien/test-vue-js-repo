module.exports = {
  root: true,
  env: { node: true },
  parserOptions: { ecmaVersion: 13 },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:vue/vue3-strongly-recommended", // This option imposes formatting rules on your code to improve readability
    "eslint:recommended",
    "plugin:vitest/recommended",
  ],
  plugins: ["vitest"],
  rules: {
    // General
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-alert": "error",
    "prefer-const": ["warn"],
    curly: "error",
    eqeqeq: ["error", "smart"],
    "no-var": "error",
    "no-else-return": "error",
    "no-useless-return": "error",
    "no-restricted-syntax": ["error", {
      selector: "MemberExpression[object.property.name=\"constructor\"][property.name=\"name\"]",
      message: "constructor.name is not reliable (can become A, B and etc.) after production build (minification and uglyfy).",
    }],
    // Spacing
    indent: ["warn", 2],
    "no-multi-spaces": "warn",
    "no-multiple-empty-lines": ["warn", {
      max: 1,
      maxEOF: 0,
      maxBOF: 0,
    }],
    "no-trailing-spaces": "warn",
    "no-whitespace-before-property": "warn",
    "comma-spacing": ["warn", {
      before: false,
      after: true,
    }],
    "space-before-blocks": "warn",
    "space-before-function-paren": ["warn", "always"],
    "space-in-parens": ["warn", "never"],
    "space-infix-ops": "warn",
    "space-unary-ops": ["warn", {
      words: true,
      nonwords: true,
    }],
    "key-spacing": ["warn", {
      beforeColon: false,
      afterColon: true,
    }],
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
    // VueJS
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "vue/html-closing-bracket-newline": ["warn", {
      singleline: "never",
      multiline: "always",
    }],
    "vue/max-attributes-per-line": ["warn", {
      singleline: { max: 3 },
      multiline: { max: 1 },
    }],
    "vue/first-attribute-linebreak": ["error", {
      singleline: "ignore",
      multiline: "below",
    }],
    "vue/no-mutating-props": [1],
    "vue/multi-word-component-names": [1],
    "vue/no-useless-template-attributes": [1],
    "vue/valid-v-slot": [1],
    "vue/no-v-text-v-html-on-component": [1],
    "vue/no-unused-vars": ["error"],
    // Functions
    "func-call-spacing": ["warn", "never"],
    // Objects & Arrays
    "comma-dangle": ["error", "always-multiline"],
    "quote-props": ["error", "as-needed"],
    "brace-style": "warn",
    "object-curly-newline": ["warn", { multiline: true }],
    "object-property-newline": "warn",
    "array-bracket-spacing": ["warn", "never"],
    "object-curly-spacing": ["warn", "always"],
    "eol-last": ["warn", "never"],
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: { jest: true },
    },
  ],
};