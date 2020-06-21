/* eslint-env node */
const eslintConfig = require('datavized-code-style');
const jestConfig = require('eslint-plugin-jest');

module.exports = Object.assign({}, eslintConfig, {
	env: {
		browser: false,
		es6: true,
		commonjs: true
	},
	overrides: [
		{
			files: ['**/*.test.js', '**/jest.*.js'],
			plugins: [
				'jest'
			],

			/*
			jest-eslint-runner still uses eslint 5.x
			so it doesn't allow `extends` in `overrides` section
			*/

			// extends: [
			// 	'plugin:jest/recommended'
			// ]

			rules: Object.assign({},
				jestConfig.configs.recommended.rules,
				jestConfig.configs.style.rules
			),
			globals: jestConfig.environments.globals.globals
		}
	]
});
