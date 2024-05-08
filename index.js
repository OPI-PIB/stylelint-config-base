'use strict';

const postcssScss = require('postcss-scss');

module.exports = {
	extends: ['stylelint-config-recommended-scss'],
	plugins: ['stylelint-no-unsupported-browser-features'],
	customSyntax: postcssScss,
	rules: {
		'no-empty-source': null,
		'scss/at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
				],
			},
		],
		'plugin/no-unsupported-browser-features': [
			true,
			{
				severity: 'warning',
			},
		],
	},
};
