module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "react",
        "react-hooks",
        "react-refresh",
        "no-restricted-imports",
    ],
    rules: {
        "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
        ],
        "react/prop-types": "off",
        "no-unused-vars": "off", // Base rule disabled to avoid conflict w. TS specifics
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                args: "all",
                argsIgnorePattern: "^_",
                caughtErrors: "all",
                caughtErrorsIgnorePattern: "^_",
                vars: "all",
                varsIgnorePattern: "^_",
            },
        ],
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: ["../data/**"],
                        message:
                            "Imports from the /src/data directory are not allowed in production code.",
                    },
                ],
            },
        ],
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
