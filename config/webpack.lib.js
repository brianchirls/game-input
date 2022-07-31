const path = require('path');
const projectDirectory = path.resolve(__dirname, '..');

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	entry: path.resolve(projectDirectory, 'src/browser.ts'),
	output: {
		path: path.join(__dirname, '../dist'),
		filename: 'browser.js',
		library: {
			name: 'GameInput',
			type: 'umd2'
		}
	},
	resolve: {
		// Add `.ts` as a resolvable extension.
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			// all files with a `.ts` extension will be handled by `ts-loader`
			{ test: /\.ts$/, loader: 'ts-loader' }
		]
	}
};