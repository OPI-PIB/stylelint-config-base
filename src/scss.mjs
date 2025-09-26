import pkg from 'stylelint-config-recommended-scss';

import cssConfig from './css.mjs';
import postcssScss from 'postcss-scss';

const { rules } = pkg;

/** @type {import('stylelint').Config} */
export default {
	...cssConfig,
	files: ['**/*.scss'],
	customSyntax: postcssScss,
	rules: {
		...cssConfig.rules,
		...rules,
		'plugin/no-unsupported-browser-features': [
			true,
			{
				severity: 'warning'
			}
		],
		'alpha-value-notation': [
			'percentage',
			{
				exceptProperties: ['opacity', 'fill-opacity', 'flood-opacity', 'stop-opacity', 'stroke-opacity']
			}
		],
		'at-rule-empty-line-before': [
			'always',
			{
				except: ['blockless-after-same-name-blockless', 'first-nested'],
				ignore: ['after-comment'],
				ignoreAtRules: ['else']
			}
		],
		'at-rule-no-vendor-prefix': true,
		'color-function-notation': 'modern',
		'color-hex-length': 'short',
		'comment-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: ['stylelint-commands']
			}
		],
		'comment-whitespace-inside': 'always',
		'custom-media-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: (name) => `Expected custom media query name "${name}" to be kebab-case`
			}
		],
		'custom-property-empty-line-before': [
			'always',
			{
				except: ['after-custom-property', 'first-nested'],
				ignore: ['after-comment', 'inside-single-line-block']
			}
		],
		'custom-property-pattern': [
			'^(--)?([a-z][a-z0-9]*)(-[a-z0-9]+)*(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$',
			{
				message: (name) => `Nazwa właściwości "${name}" powinna być w formacie BEM`
			}
		],
		'declaration-block-no-redundant-longhand-properties': true,
		'declaration-block-single-line-max-declarations': 1,
		'declaration-empty-line-before': [
			'always',
			{
				except: ['after-declaration', 'first-nested'],
				ignore: ['after-comment', 'inside-single-line-block']
			}
		],
		'font-family-name-quotes': 'always-where-recommended',
		'function-name-case': 'lower',
		'function-no-unknown': true,
		'function-url-quotes': 'always',
		'hue-degree-notation': 'angle',
		'import-notation': 'string',
		'keyframe-selector-notation': 'percentage-unless-within-keyword-only-block',
		'keyframes-name-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: (name) => `Expected keyframe name "${name}" to be kebab-case`
			}
		],
		'length-zero-no-unit': [
			true,
			{
				ignore: ['custom-properties']
			}
		],
		'lightness-notation': 'percentage',
		'media-feature-range-notation': 'context',
		'no-invalid-position-at-import-rule': [true, { ignoreAtRules: ['config'] }],
		'number-max-precision': 4,
		'order/order': ['at-rules', 'custom-properties', 'declarations'],
		'order/properties-alphabetical-order': true,
		'property-no-vendor-prefix': true,
		'rule-empty-line-before': [
			'always-multi-line',
			{
				except: ['first-nested'],
				ignore: ['after-comment']
			}
		],
		'selector-attribute-quotes': 'always',
		'selector-class-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$',
			{
				message: (selector) => `Nazwa klasy "${selector}" powinna być w formacie BEM`
			}
		],
		'selector-no-vendor-prefix': true,
		'selector-not-notation': 'complex',
		'selector-pseudo-element-colon-notation': 'double',
		'selector-pseudo-element-no-unknown': [
			true,
			{
				ignorePseudoElements: ['custom-elements', 'ng-deep']
			}
		],
		'selector-type-case': 'lower',
		'shorthand-property-no-redundant-values': true,
		'value-keyword-case': 'lower',
		'value-no-vendor-prefix': [
			true,
			{
				// `-webkit-box` is allowed as standard. See https://www.w3.org/TR/css-overflow-3/#webkit-line-clamp
				ignoreValues: ['box', 'inline-box']
			}
		],
		'scss/at-rule-no-unknown': null,
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
