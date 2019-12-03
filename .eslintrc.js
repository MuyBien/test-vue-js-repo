module.exports = {
    root: true,
    extends: [
        "plugin:vue/essential",
        "eslint:recommended",
    ],
    env: {
        node: true,
    },
    rules: {
        indent: ["error", 4, ],
        quotes: ["error", "double", ],
        semi: ["error", "always", ],
        "comma-dangle": ["error", "always", ],
        curly: "error",
        "no-multi-spaces": "error",
        "quote-props": ["error", "as-needed", ],
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    },
    parserOptions: {
        parser: "babel-eslint",
    },
    overrides: [
        {
            files: [
                "**/__tests__/*.{j,t}s?(x)",
            ],
            env: {
                mocha: true,
            },
        },
    ],
};
