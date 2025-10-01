import postcssScss from 'postcss-scss';
import recommendedScss from 'stylelint-config-recommended-scss';

import cssConfig from './css.mjs';

/** @type {import('stylelint').Config} */
export default {
	...cssConfig,
	extends: 'stylelint-config-recommended',
	files: ['**/*.scss'],
	customSyntax: postcssScss,
	plugins: [...cssConfig.plugins, 'stylelint-order', 'stylelint-scss'],
	rules: {
		...cssConfig.rules,
		...recommendedScss.rules,
		'annotation-no-unknown': null,
		'at-rule-no-unknown': null,
		'comment-no-empty': null,
		'function-no-unknown': null,
		'import-notation': 'string',
		'media-query-no-invalid': null,
		'no-invalid-position-at-import-rule': [
			true,
			{
				ignoreAtRules: ['config', 'use', 'forward']
			}
		],
		'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-else-closing-brace-space-after': 'always-intermediate',
		'scss/at-else-empty-line-before': 'never',
		'scss/at-else-if-parentheses-space-before': 'always',
		'scss/at-extend-no-missing-placeholder': true,
		'scss/at-function-parentheses-space-before': 'never',
		'scss/at-function-pattern': [
			'^(-?[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: 'Expected function name to be kebab-case'
			}
		],
		'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-if-closing-brace-space-after': 'always-intermediate',
		'scss/at-if-no-null': true,
		'scss/at-mixin-argumentless-call-parentheses': 'never',
		'scss/at-mixin-parentheses-space-before': 'never',
		'scss/at-mixin-pattern': [
			'^_?([a-z][a-z0-9]*)(-[a-z0-9]+)*(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$',
			{
				message: 'Nazwa mixina powinna być w formacie BEM'
			}
		],
		'scss/at-rule-conditional-no-parentheses': true,
		'scss/at-rule-no-unknown': true,
		'scss/comment-no-empty': null,
		'scss/declaration-nested-properties-no-divided-groups': true,
		'scss/dollar-variable-colon-space-after': 'always-single-line',
		'scss/dollar-variable-colon-space-before': 'never',
		'scss/dollar-variable-empty-line-before': [
			'always',
			{
				except: ['after-dollar-variable', 'first-nested'],
				ignore: ['after-comment', 'inside-single-line-block']
			}
		],
		'scss/dollar-variable-no-missing-interpolation': true,
		'scss/dollar-variable-pattern': [
			'^(-?[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: 'Expected variable to be kebab-case'
			}
		],
		'scss/double-slash-comment-empty-line-before': null,
		'scss/double-slash-comment-whitespace-inside': null,
		'scss/function-quote-no-quoted-strings-inside': true,
		'scss/function-unquote-no-unquoted-strings-inside': true,
		'scss/load-no-partial-leading-underscore': true,
		'scss/load-partial-extension': 'never',
		'scss/no-duplicate-mixins': true,
		'scss/no-global-function-names': true,
		'scss/operator-no-newline-after': true,
		'scss/operator-no-newline-before': true,
		'scss/operator-no-unspaced': true,
		'scss/percent-placeholder-pattern': [
			'^_?([a-z][a-z0-9]*)(-[a-z0-9]+)*(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$',
			{
				message: 'Nazwa placeholdera powinna byc w formacie BEM'
			}
		]
	}
};
