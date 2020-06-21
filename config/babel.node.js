const babelConfig = require('./babel');

/*
Be careful here, since we're modifying this object.
It's not an issue for this repo, but if for some reason
we needed multiple babel configurations, this could cause
a problem
*/
babelConfig.presets[0][1].targets = {
	node: 'current'
};
babelConfig.presets[0][1].modules = 'commonjs';

module.exports = {
	...babelConfig
};