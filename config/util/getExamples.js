const fs = require('fs');
const path = require('path');
const examplesDirectory = path.resolve(__dirname, '../../examples');
const examplesManifest = require(path.resolve(examplesDirectory, 'manifest.json'));

const extensionRegex = /\.(m|j|t)s$/;
const indexRegex = /index\.(m|j|t)s$/;

function getExamples(mode = 'development') {
	if (mode === 'production') {
		return examplesManifest.examples.map(ex => ({
			name: ex.entry,
			file: ex.file || ex.entry + '.ts'
		}));
	}

	return fs.readdirSync(examplesDirectory)
		.filter(n => extensionRegex.test(n) && n[0] !== '.' && !indexRegex.test(n))
		.map(n => ({
			name: n.replace(extensionRegex, ''),
			file: n
		}));
}

module.exports = { examplesDirectory, getExamples };
