module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        // Indent with 4 spaces
        indent: ['error', 4],
        semi: ['error', 'always'],
    },
};
