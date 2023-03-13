module.exports = {
	extends: [
		'stylelint-config-standard-scss',
	],
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
	},
};
