import postcssScss from 'postcss-scss';
import recommendedScss from 'stylelint-config-recommended-scss';

import cssConfig from './css.mjs';

/** @type {import('stylelint').Config} */
export default {
	...cssConfig,
	files: ['**/*.scss'],
	customSyntax: postcssScss,
	plugins: [...cssConfig.plugins, 'stylelint-scss'],
	rules: {
		...cssConfig.rules,
		...recommendedScss.rules,
		'at-rule-empty-line-before': [
			'always',
			{
				except: ['blockless-after-blockless', 'first-nested'],
				ignore: ['after-comment'],
				ignoreAtRules: ['else']
			}
		],
		'import-notation': 'string',
		'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-else-closing-brace-space-after': 'always-intermediate',
		'scss/at-else-empty-line-before': 'never',
		'scss/at-else-if-parentheses-space-before': 'always',
		'scss/at-function-parentheses-space-before': 'never',
		'scss/at-function-pattern': [
			'^(-?[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: 'Expected function name to be kebab-case'
			}
		],
		'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-if-closing-brace-space-after': 'always-intermediate',
		'scss/at-mixin-argumentless-call-parentheses': 'never',
		'scss/at-mixin-parentheses-space-before': 'never',
		'scss/at-mixin-pattern': [
			'^_?([a-z][a-z0-9]*)(-[a-z0-9]+)*(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$',
			{
				message: 'Nazwa mixina powinna być w formacie BEM'
			}
		],
		'scss/at-rule-conditional-no-parentheses': true,
		'scss/comment-no-empty': null,
		'scss/dollar-variable-colon-space-after': 'always-single-line',
		'scss/dollar-variable-colon-space-before': 'never',
		'scss/dollar-variable-empty-line-before': [
			'always',
			{
				except: ['after-dollar-variable', 'first-nested'],
				ignore: ['after-comment', 'inside-single-line-block']
			}
		],
		'scss/dollar-variable-pattern': [
			'^(-?[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: 'Expected variable to be kebab-case'
			}
		],
		'scss/double-slash-comment-empty-line-before': null,
		'scss/double-slash-comment-whitespace-inside': null,
		'scss/percent-placeholder-pattern': [
			'^_?([a-z][a-z0-9]*)(-[a-z0-9]+)*(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$',
			{
				message: 'Nazwa placeholdera powinna byc w formacie BEM'
			}
		]
	}
};
