module.exports = {
	extends: [
		'stylelint-config-standard-scss',
		'stylelint-prettier/recommended',
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
