const path = require('path');

const BABEL_ENV = process.env.BABEL_ENV || 'esm';

const productionTransformRuntime = [
	'@babel/plugin-transform-runtime',
	{
		helpers: false,
		regenerator: true,
		useESModules: true
	}
];

// use this later for various packages, maybe?
const defaultAlias = {};

module.exports = {
	// We release a ES version
	// It's something that matches the latest official supported features of JavaScript.
	// Nothing more (stage-1, etc), nothing less (require, etc).
	presets: BABEL_ENV === 'es' || BABEL_ENV === 'test' ? ['@babel/preset-typescript', { allowDeclareFields: true }] : [
		['@babel/preset-typescript', { allowDeclareFields: true }],
		[
			'@babel/env',
			{
				exclude: [
					'transform-regenerator',
					'transform-async-to-generator'
				],
				useBuiltIns: false,
				modules: ['esm', 'production-umd'].includes(BABEL_ENV) ? false : 'commonjs'
			}
		]
	],

	plugins: [
		['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
		'@babel/plugin-proposal-class-properties',
		['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
		['@babel/plugin-transform-runtime', {
			helpers: false,
			regenerator: true
		}],
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-transform-object-assign',
		'module:fast-async'
	],
	env: {
		cjs: {
			// plugins: productionPlugins
		},
		development: {
			plugins: [
				[
					'babel-plugin-module-resolver',
					{
						alias: {
							modules: './modules'
						}
					}
				]
			]
		},
		esm: {
			plugins: [productionTransformRuntime]
		},
		es: {
			plugins: [productionTransformRuntime]
		},
		production: {
			plugins: [productionTransformRuntime]
		},
		'production-umd': {
			plugins: [productionTransformRuntime]
		},
		test: {
			sourceMaps: 'both',

			plugins: [
				['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
				[
					'babel-plugin-module-resolver',
					{
						root: [path.resolve(__dirname, '../src')],
						alias: defaultAlias
					}
				]
			]
		},
		benchmark: {
			plugins: [
				[
					'babel-plugin-module-resolver',
					{
						root: [path.resolve(__dirname, '../src')],
						alias: defaultAlias
					}
				]
			]
		}
	}
};
