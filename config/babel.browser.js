const babelConfig = require('./babel');
const browsers = [
	'defaults'
];

/*
Be careful here, since we're modifying this object.
It's not an issue for this repo, but if for some reason
we needed multiple babel configurations, this could cause
a problem
*/
if (babelConfig.presets.length) {
	babelConfig.presets[0][1].targets = {
		browsers
	};
}

module.exports = babelConfig;
