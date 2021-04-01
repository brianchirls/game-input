const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const { getExamples, examplesDirectory } = require('./util/getExamples');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const LoadExternalScriptsPlugin = require('./util/LoadExternalScriptsPlugin');

const common = require('./webpack-common');

const htmlMinify = {
	removeComments: true,
	removeCommentsFromCDATA: true,
	removeCDATASectionsFromCDATA: true,
	collapseWhitespace: true,
	collapseBooleanAttributes: true,
	removeAttributeQuotes: true,
	removeRedundantAttributes: true,
	useShortDoctype: true,
	removeEmptyAttributes: true,
	removeScriptTypeAttributes: true,
	// lint: true,
	caseSensitive: true,
	minifyJS: true,
	minifyCSS: true
};

const PLUGINS = [
	new CaseSensitivePathsPlugin(),
	new webpack.DefinePlugin({
		DEBUG: false
	}),
	new OptimizeCssAssetsPlugin({}),
	new MiniCssExtractPlugin({
		// Options similar to the same options in webpackOptions.output
		// both options are optional
		filename: '[name]-[chunkhash].css',
		chunkFilename: '[name]-[id]-[chunkhash].chunk.css'
	}),
	// new webpack.ProvidePlugin({
	// 	THREE: 'three'
	// }),
	new HtmlWebpackPlugin({
		inject: true,
		cache: true,
		template: path.resolve(examplesDirectory, 'index.html'),
		chunks: ['examples/index'],
		filename: `examples/index.html`,
		minify: htmlMinify,
		title: 'Game Input: Examples'
	})
];

const projectName = require('../package.json').name;

const examplesManifest = require('../examples/manifest.json');

module.exports = (env, options) => merge(common(env, options), {
	output: {
		path: path.join(__dirname, '../build/site'),
		filename: (chunkData) => {
			return chunkData.chunk.name === 'index' ? `${projectName}.min.js` : '[name]-[chunkhash].js';
		},
		publicPath: '/game-input/'
	},
	plugins: PLUGINS.concat(getExamples(options.mode).map(name => {
		const def = examplesManifest.examples.find(d => d.entry === name);
		const title = def && def.title || name;
		const catName = def && def.catName || '';
		const category = examplesManifest.categories[catName] || 'Misc.';

		return new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(examplesDirectory, 'template.html'),
			chunks: ['all-examples', 'examples/' + name],
			filename: `examples/${name}.html`,
			minify: htmlMinify,
			title: `${category} - ${title}`
		});
	}), [

		// new LoadExternalScriptsPlugin({
		// 	three: `https://unpkg.com/three@^0.${require('three').REVISION}/build/three.min.js`
		// }),

		new BundleAnalyzerPlugin({
			openAnalyzer: false,
			analyzerMode: 'static',
			reportFilename: '../../reports/bundle.html'
		})
	]),
	// externals: {
	// 	three: 'THREE'
	// },
	devtool: 'source-map'
});
