module.exports = {
	extends: ['stylelint-config-recommended-scss'],
	plugins: ['stylelint-no-unsupported-browser-features'],
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
