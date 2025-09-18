'use strict';

const postcssScss = require('postcss-scss');

module.exports = {
	extends: ['stylelint-config-recommended-scss'],
	plugins: ['stylelint-no-unsupported-browser-features', 'stylelint-order'],
	customSyntax: postcssScss,
	rules: {
		'at-rule-no-unknown': null,
		'scss/at-rule-no-unknown': null,
		'plugin/no-unsupported-browser-features': [
			true,
			{
				severity: 'warning',
			},
		],
		'selector-pseudo-element-no-unknown': [
			true,
			{
				ignorePseudoElements: ['host', 'host-context', 'ng-deep'],
			},
		],
		'alpha-value-notation': [
			'percentage',
			{
				exceptProperties: [
					'opacity',
					'fill-opacity',
					'flood-opacity',
					'stop-opacity',
					'stroke-opacity',
				],
			},
		],
		'at-rule-empty-line-before': [
			'always',
			{
				except: ['blockless-after-same-name-blockless', 'first-nested'],
				ignore: ['after-comment'],
			},
		],
		'at-rule-no-vendor-prefix': true,
		'color-function-notation': 'modern',
		'color-hex-length': 'short',
		'comment-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: ['stylelint-commands'],
			},
		],
		'comment-whitespace-inside': 'always',
		'custom-media-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: (name) =>
					`Expected custom media query name "${name}" to be kebab-case`,
			},
		],
		'custom-property-empty-line-before': [
			'always',
			{
				except: ['after-custom-property', 'first-nested'],
				ignore: ['after-comment', 'inside-single-line-block'],
			},
		],
		'custom-property-pattern': [
			'^(--)?([a-z][a-z0-9]*)(-[a-z0-9]+)*(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$',
			{
				message: (name) =>
					`Nazwa właściwości "${name}" powinna być w formacie BEM`,
			},
		],
		'declaration-block-no-redundant-longhand-properties': true,
		'declaration-block-single-line-max-declarations': 1,
		'declaration-empty-line-before': [
			'always',
			{
				except: ['after-declaration', 'first-nested'],
				ignore: ['after-comment', 'inside-single-line-block'],
			},
		],
		'font-family-name-quotes': 'always-where-recommended',
		'function-name-case': 'lower',
		'function-no-unknown': true,
		'function-url-quotes': 'always',
		'hue-degree-notation': 'angle',
		'import-notation': 'url',
		'keyframe-selector-notation':
			'percentage-unless-within-keyword-only-block',
		'keyframes-name-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: (name) =>
					`Expected keyframe name "${name}" to be kebab-case`,
			},
		],
		'length-zero-no-unit': [
			true,
			{
				ignore: ['custom-properties'],
			},
		],
		'lightness-notation': 'percentage',
		'media-feature-range-notation': 'context',
		'no-empty-source': true,
		'number-max-precision': 4,
		'order/order': ['at-rules', 'custom-properties', 'declarations'],
		'order/properties-alphabetical-order': true,
		'property-no-vendor-prefix': true,
		'rule-empty-line-before': [
			'always-multi-line',
			{
				except: ['first-nested'],
				ignore: ['after-comment'],
			},
		],
		'selector-attribute-quotes': 'always',
		'selector-class-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$',
			{
				message: (selector) =>
					`Nazwa klasy "${selector}" powinna być w formacie BEM`,
			},
		],
		'selector-no-vendor-prefix': true,
		'selector-not-notation': 'complex',
		'selector-pseudo-element-colon-notation': 'double',
		'selector-type-case': 'lower',
		'shorthand-property-no-redundant-values': true,
		'value-keyword-case': 'lower',
		'value-no-vendor-prefix': [
			true,
			{
				// `-webkit-box` is allowed as standard. See https://www.w3.org/TR/css-overflow-3/#webkit-line-clamp
				ignoreValues: ['box', 'inline-box'],
			},
		],
	},
};
