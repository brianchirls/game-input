const path = require('path');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const projectDirectory = path.resolve(__dirname, '..');
const { getExamples, examplesDirectory } = require('./util/getExamples');
const { extendDefaultPlugins: svgoExtendDefaultPlugins } = require('svgo');

module.exports = (env, options) => ({
	context: projectDirectory,
	entry: () => {
		const entries = {
			// index: path.resolve(projectDirectory, 'src/index.js')
			'examples/index': path.resolve(examplesDirectory, 'index.js'),
			'all-examples': path.resolve(examplesDirectory, 'util/all-examples.js')
		};
		const examples = getExamples(options.mode);
		examples.forEach(name => {
			entries['examples/' + name] = path.resolve(examplesDirectory, name + '.js');
		});
		return entries;
	},
	output: {
		globalObject: 'this'
	},
	stats: {
		all: false,
		errors: true,
		warnings: true,
		logging: 'info'
	},
	module: {
		rules: [
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				enforce: 'pre',
				loader: 'eslint-loader',
				options: {
					formatter: eslintFormatter,
					// failOnHint: env === 'production',
					emitWarning: true
				}
			},
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true
				}
			},

			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 1
						}
					},
					{
						loader: require.resolve('postcss-loader'),
						options: {
							postcssOptions: {
								plugins: [
									require('postcss-flexbugs-fixes'),
									require('postcss-input-range'),
									autoprefixer({
										grid: true,
										flexbox: 'no-2009'
									})
								]
							}
						}
					}
				]
			},

			{
				test: [/\.svg$/i],
				// include: [
				// 	/node_modules/
				// ],
				use: [
					'raw-loader',
					{
						loader: 'svgo-loader',
						options: {
							plugins: svgoExtendDefaultPlugins([
								{
									name: 'removeViewBox',
									active: false
								}
							])
						}
					}
				]
			},

			{
				test: [/\.gif$/i, /\.jpe?g$/i, /\.png$/i, /.glb$/i],
				exclude: [
					/node_modules/
				],
				loader: 'url-loader',
				options: {
					limit: 8192//,
					// name: 'static/media/[name].[hash:8].[ext]'
				}
			}

		]
	},
	plugins: [
		new StyleLintPlugin({
			context: 'examples',
			files: '**/*.css',
			configFile: path.resolve(projectDirectory, 'stylelint.config.js'),
			failOnError: false,
			emitErrors: false
		})
	],
	optimization: {
		splitChunks: 'serveIndex' in options ? {} : {
			name: options.mode !== 'production',
			cacheGroups: {
				common: {
					minChunks: 3,
					name: 'common',
					chunks: 'initial',
					filename: '[name]-[chunkhash].chunk.js'
				},
				cannon: {
					name: 'cannon',
					test: /[\\/]node_modules[\\/]cannon[\\/]/,
					filename: '[name]-[chunkhash].chunk.js'
				}
			}
		}
	}
});
