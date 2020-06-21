module.exports = {
	extends: 'stylelint-config-standard',
	rules: {
		indentation: 'tab',
		'string-quotes': 'single',
		'declaration-no-important': true,
		'no-unknown-animations': true,
		'value-keyword-case': 'lower',
		'declaration-empty-line-before': null,
		'comment-empty-line-before': null,

		// disallow vendor prefixes because we use autoprefixer
		'at-rule-no-vendor-prefix': true,
		'media-feature-name-no-vendor-prefix': true,
		'property-no-vendor-prefix': true,
		'selector-no-vendor-prefix': true,
		'value-no-vendor-prefix': true
	}
};
