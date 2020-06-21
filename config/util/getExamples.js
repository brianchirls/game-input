const fs = require('fs');
const path = require('path');
const examplesDirectory = path.resolve(__dirname, '../../examples');
const examplesManifest = require(path.resolve(examplesDirectory, 'manifest.json'));

function getExamples(mode = 'development') {
	if (mode === 'production') {
		return examplesManifest.examples.map(ex => ex.entry);
	}

	return fs.readdirSync(examplesDirectory)
		.filter(n => /\.js$/.test(n) && n[0] !== '.' && n !== 'index.js')
		.map(n => n.substr(0, n.length - 3));
}

module.exports = { examplesDirectory, getExamples };
