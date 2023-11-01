module.exports = {
    root: true,
    parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaFeatures: {
            ecmaVersion: 6,
            'sourceType': 'module',
            ecmaFeature: {
                jsx: true
            }
            // experimentalObjectRestSpread: true,
            // jsx: true
        }
    },
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    extends: [
        './lang-js.eslintrc.js',
        './lang-vue.eslintrc.js'
    ],
    plugins: ['html']
}
