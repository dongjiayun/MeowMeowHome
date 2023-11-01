/** @type {Partial<import('stylelint').Configuration>} */
module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-recess-order',
        'stylelint-config-editorconfig'
    ],
    ignoreFiles: [
        '/node_modules',
        '/coverage',
        '/dist'
    ],
    rules: {
        'font-family-no-missing-generic-family-keyword': null,
        'no-descending-specificity': null,
        'color-hex-case': 'upper',
        'rule-empty-line-before': 'never',
        'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
        'selector-pseudo-element-no-unknown': [true, {
            ignorePseudoElements: ['v-deep']
        }]
    }
}
