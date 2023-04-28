module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', 'simple-import-sort'],
    rules: {
        'react/prop-types': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
