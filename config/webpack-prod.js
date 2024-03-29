const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const { getExamples, examplesDirectory } = require('./util/getExamples');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
	new CleanWebpackPlugin(),
	new CaseSensitivePathsPlugin(),
	new webpack.DefinePlugin({
		DEBUG: false
	}),
	new MiniCssExtractPlugin({
		// Options similar to the same options in webpackOptions.output
		// both options are optional
		filename: '[name]-[chunkhash].css',
		chunkFilename: '[name]-[id]-[chunkhash].chunk.css'
	}),
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
		path: path.join(__dirname, '../build'),
		filename: (chunkData) => {
			return chunkData.chunk.name === 'index' ? `${projectName}.min.js` : '[name]-[chunkhash].js';
		},
		publicPath: '/game-input/'
	},
	plugins: PLUGINS.concat(getExamples(options.mode).map(({ name }) => {
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

		new BundleAnalyzerPlugin({
			openAnalyzer: false,
			analyzerMode: 'static',
			reportFilename: '../reports/bundle.html'
		})
	]),
	// externals: {
	// 	three: 'THREE'
	// },
	devtool: 'source-map',
	optimization: {
		minimize: true,
		minimizer: [
			`...`,
			new CssMinimizerPlugin()
		],

		// https://github.com/webpack-contrib/webpack-bundle-analyzer/issues/409#issuecomment-762156443
		runtimeChunk: {
			name: 'js/runtime'
		}
	}
});
