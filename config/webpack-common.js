const path = require('path');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const projectDirectory = path.resolve(__dirname, '..');
const { getExamples, examplesDirectory } = require('./util/getExamples');

process.traceDeprecation = true;

module.exports = (env, options) => ({
	context: projectDirectory,
	entry: () => {
		const entries = {
			// index: path.resolve(projectDirectory, 'src/index.js')
			'examples/index': path.resolve(examplesDirectory, 'index.js'),
			'all-examples': path.resolve(examplesDirectory, 'util/all-examples.js')
		};
		const examples = getExamples(options.mode);
		examples.forEach(({ file, name }) => {
			entries['examples/' + name] = path.resolve(examplesDirectory, file);
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
				test: /\.(m|j|t)s$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true
				}
			},

			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 1,
							sourceMap: true
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
							plugins: [
								{
									name: 'preset-default',
									params: {
										overrides: {
											removeViewBox: false
										}
									}
								}
							]
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
	resolve: {
		extensions: ['.ts', '.js', '.json']
	},
	plugins: [
		new StyleLintPlugin({
			context: 'examples',
			files: '**/*.css',
			configFile: path.resolve(projectDirectory, 'stylelint.config.js'),
			failOnError: false,
			emitErrors: false
		}),
		new ESLintPlugin({
			formatter: eslintFormatter,
			// failOnHint: env === 'production',
			emitWarning: true,
			extensions: [`js`, `ts`],
			exclude: [
				`/node_modules/`
			]
		})
	],
	optimization: {
		splitChunks: {
			// include all types of chunks
			chunks: 'all',
			usedExports: false
		}
	}
});
