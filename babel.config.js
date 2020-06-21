/* eslint-env node */
const babelConfig = process.env.NODE_ENV === 'test' ?
	require('./config/babel.node') :
	require('./config/babel.browser');

module.exports = babelConfig;