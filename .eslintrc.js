/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint. 
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        createDefaultProgram: true,
    },
    plugins: [
        'eslint-plugin-import',
        'eslint-plugin-jsdoc',
        'eslint-plugin-prefer-arrow',
        '@typescript-eslint',
    ],
    rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'off',
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/ban-types': [
            'off',
            {
                types: {
                    Object: {
                        message: 'Avoid using the `Object` type. Did you mean `object`?',
                    },
                    Function: {
                        message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
                    },
                    Boolean: {
                        message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
                    },
                    Number: {
                        message: 'Avoid using the `Number` type. Did you mean `number`?',
                    },
                    String: {
                        message: 'Avoid using the `String` type. Did you mean `string`?',
                    },
                    Symbol: {
                        message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
                    },
                },
            },
        ],
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
            'off',
            {
                accessibility: 'explicit',
            },
        ],
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-new': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-shadow': [
            'off',
            {
                hoist: 'all',
            },
        ],
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/prefer-for-of': 'off',
        '@typescript-eslint/prefer-function-type': 'off',
        '@typescript-eslint/prefer-namespace-keyword': 'off',
        '@typescript-eslint/quotes': ['off', 'single'],
        '@typescript-eslint/triple-slash-reference': [
            'off',
            {
                path: 'always',
                types: 'prefer-import',
                lib: 'always',
            },
        ],
        '@typescript-eslint/unified-signatures': 'off',
        'arrow-parens': ['off', 'always'],
        'brace-style': ['off', 'off'],
        complexity: 'off',
        'constructor-super': 'off',
        curly: 'off',
        'eol-last': 'off',
        eqeqeq: ['off', 'smart'],
        'guard-for-in': 'off',
        'id-blacklist': 'off',
        'id-match': 'off',
        'import/order': 'off',
        'jsdoc/check-alignment': 'off',
        'jsdoc/check-indentation': 'off',
        'jsdoc/newline-after-description': 'off',
        'max-classes-per-file': 'off',
        'max-len': [
            'off',
            {
                code: 350,
            },
        ],
        'new-parens': 'off',
        'no-bitwise': 'off',
        'no-caller': 'off',
        'no-cond-assign': 'off',
        'no-console': 'off',
        'no-debugger': 'warn',
        'no-empty': 'off',
        'no-eval': 'off',
        'no-fallthrough': 'off',
        'no-invalid-this': 'off',
        'no-new-wrappers': 'off',
        'no-throw-literal': 'off',
        'no-trailing-spaces': 'off',
        'no-undef-init': 'off',
        'no-underscore-dangle': 'off',
        'no-unsafe-finally': 'off',
        'no-unused-labels': 'off',
        'no-var': 'warn',
        'object-shorthand': 'off',
        'one-var': ['off', 'never'],
        'prefer-arrow/prefer-arrow-functions': 'off',
        'prefer-const': 'off',
        radix: 'off',
        'spaced-comment': [
            'off',
            'always',
            {
                markers: ['/'],
            },
        ],
        'use-isnan': 'off',
        'valid-typeof': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/class-name-casing': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/ban-ts-comment': 'off'
    },
};