module.exports = {
	presets: [
		['@babel/preset-typescript', { allowDeclareFields: true }],
		[
			'@babel/env',
			{
				targets: process.env.WEBPACK_SERVE ? {
					esmodules: true
				} : null
			}
		]
	],
	plugins: [
		['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
		['@babel/plugin-proposal-class-properties'],
		['@babel/plugin-transform-runtime']
	]
};