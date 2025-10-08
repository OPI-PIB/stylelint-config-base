import config from './scss.mjs';

/** @type {import('stylelint').Config} */
export default {
	...config,
	rules: {
		...config.rules,
		'custom-property-pattern': null,
		'at-rule-no-unknown': [true, { ignoreAtRules: ['theme', 'source', 'reference'] }]
	}
};
