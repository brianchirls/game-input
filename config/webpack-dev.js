const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const { getExamples, examplesDirectory } = require('./util/getExamples');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack-common');
const examplesManifest = require('../examples/manifest.json');

const PLUGINS = [
	new CaseSensitivePathsPlugin(),
	new webpack.DefinePlugin({
		DEBUG: true
	}),
	new MiniCssExtractPlugin({
		// Options similar to the same options in webpackOptions.output
		// both options are optional
		filename: '[name].css',
		chunkFilename: '[id].css'
	}),
	new HtmlWebpackPlugin({
		inject: true,
		cache: true,
		template: path.resolve(examplesDirectory, 'index.html'),
		chunks: ['examples/index'],
		filename: `examples/index.html`,
		title: 'Game Input: Examples'
	})
];

const host = '0.0.0.0';
const port = 1000;
const devServerUrl = `webpack-dev-server/client?http://${host}:${port}/`;

module.exports = (env, options) => merge(common(env, options), {
	entry: () => {
		const e = {
			// index: path.resolve(__dirname, '../src/index.js')
		};

		const examples = getExamples(options.mode);
		examples.forEach(({ file, name }) => {
			e[`examples/${name}`] = [
				path.resolve(examplesDirectory, file),
				devServerUrl
			];
		});

		return e;
	},
	devServer: {
		// allowedHosts: [
		// 	'.github.com'
		// ],
		static: {
			directory: path.resolve(__dirname, '../build')
		},
		host,
		port
	},
	output: {
		path: path.resolve(__dirname, '../build'),
		publicPath: '/'
	},
	plugins: PLUGINS.concat(getExamples(options.mode).map(({ name }) => {
		const def = examplesManifest.examples.find(d => d.entry === name);
		const title = def && def.title || name;
		const catId = def && def.category || '';
		const category = examplesManifest.categories[catId] || 'Misc.';

		return new HtmlWebpackPlugin({
			inject: true,
			cache: true,
			template: path.resolve(examplesDirectory, 'template.html'),
			chunks: ['all-examples', 'examples/' + name],
			filename: `examples/${name}.html`,
			title: `${category} - ${title}`
		});
	})),
	devtool: 'cheap-module-source-map'
});
