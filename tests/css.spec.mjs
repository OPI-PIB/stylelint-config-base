import { strictEqual } from 'assert';
import { describe, test } from 'node:test';

import stylelint from 'stylelint';

import config from '../src/css.mjs';

function lintCss(code, customConfig = config) {
	return stylelint.lint({
		code,
		config: customConfig
	});
}

function hasRule(result, rule) {
	return result.results[0].warnings.some((x) => x.rule === rule);
}

describe('Stylelint Rules CSS', () => {
	test('plugin/no-unsupported-browser-features', async () => {
		const customConfig = {
			...config,
			rules: {
				...config.rules,
				'plugin/no-unsupported-browser-features': [
					true,
					{
						severity: 'warning',
						browsers: ['last 5 Safari major versions']
					}
				]
			}
		};
		const validCSS = `a { color: red; }`;
		const invalidCSS = `a { 
			color: red; 
			
			a { color: red; } 
		}`;

		let result = await lintCss(validCSS, customConfig);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS, customConfig);
		strictEqual(hasRule(result, 'plugin/no-unsupported-browser-features'), true);
	});

	test('order/order', async () => {
		const validCSS = `a {
			--height: 10px;

			top: 0;
		}`;
		const invalidCSS = `a {
			top: 0;

			--height: 10px;
		}`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'order/order'), true);
	});

	test('order/properties-alphabetical-order', async () => {
		const validCSS = `.a {
			background: red;
			color: blue;
		}`;
		const invalidCSS = `.a {
			color: blue;
			background: red;
		}`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'order/properties-alphabetical-order'), true);
	});

	test('alpha-value-notation', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color: rgba(255,255,255,0.5); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'alpha-value-notation'), true);
	});

	test('annotation-no-unknown', async () => {
		const validCSS = `a { color: green; }`;
		const invalidCSS = `a { color: green !im; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'annotation-no-unknown'), true);
	});

	test('at-rule-empty-line-before', async () => {
		const validCSS = `
	      @import url("a.css");

	      @media screen { a { color: red; } }
	    `;
		const invalidCSS = `
	      @import url("a.css");
	      @media screen { a { color: red; } }
	    `;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'at-rule-empty-line-before'), true);
	});

	test('at-rule-no-unknown', async () => {
		const validCSS = `
			@charset "UTF-8";

			@import url('a.css');

			@media screen {
				a {
					color: red;
				}
			}

			@layer base {
				a {
					color: red;
				}
			}
		`;
		const invalidCSS = `@unknown-rule { a { color: red; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'at-rule-no-unknown'), true);
	});

	test('at-rule-no-vendor-prefix', async () => {
		const validCSS = `@media screen { a { color: red; } }`;
		const invalidCSS = `@-webkit-keyframes slide { from { opacity: 0; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'at-rule-no-vendor-prefix'), true);
	});

	test('block-no-empty', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'block-no-empty'), true);
	});

	test('color-function-notation', async () => {
		const validCSS = `.a { color: rgb(255 0 0 / 50%); }`;
		const invalidCSS = `.a { color: rgb(255,0,0,0.5); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'color-function-notation'), true);
	});

	test('color-hex-length', async () => {
		const validCSS = `.a { color: #fff; }`;
		const invalidCSS = `.a { color: #ffffff; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'color-hex-length'), true);
	});

	test('color-no-invalid-hex', async () => {
		const validCSS = `.a { color: #abc; }`;
		const invalidCSS = `.a { color: #zzzzzz; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'color-no-invalid-hex'), true);
	});

	test('comment-empty-line-before', async () => {
		const validCSS = `
			/* comment */

			.a { color: red; }
		`;
		const invalidCSS = `
			.a { color: red; }
			/* comment */
		`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'comment-empty-line-before'), true);
	});

	test('comment-no-empty', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `/*  */`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'comment-no-empty'), true);
	});

	test('comment-whitespace-inside', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `/*comment*/`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'comment-whitespace-inside'), true);
	});

	test('custom-media-pattern', async () => {
		const validCSS = `@custom-media --small-screen (max-width: 30em);`;
		const invalidCSS = `@custom-media --bar_a (min-width: 30em);`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'custom-media-pattern'), true);
	});

	test('custom-property-empty-line-before', async () => {
		const validCSS = `
	      :root {
	        --main-color: red;
	        --secondary-color: blue;
	      }
	    `;
		const invalidCSS = `
	      :root {
	        --main-color: red;

	        --secondary-color: blue;
	      }
	    `;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'custom-property-empty-line-before'), true);
	});

	test('custom-property-no-missing-var-function', async () => {
		const validCSS = `:root {
			--main-color: red;

			color: var(--main-color);
		}`;
		const invalidCSS = `:root {
			--main-color: red;

			color: --main-color;
		}`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'custom-property-no-missing-var-function'), true);
	});

	test('custom-property-pattern', async () => {
		const validCSS = `:root { --button--primary-color: red; }`;
		const invalidCSS = `:root { --buttonColor: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'custom-property-pattern'), true);
	});

	test('declaration-block-no-duplicate-custom-properties', async () => {
		const validCSS = `
	      :root {
	        --main-color: red;
	        --secondary-color: blue;
	      }
	    `;
		const invalidCSS = `
	      :root {
	        --main-color: red;
	        --main-color: blue;
	      }
	    `;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-block-no-duplicate-custom-properties'), true);
	});

	test('declaration-block-no-duplicate-properties', async () => {
		const validCSS = `.a {
			background: blue;
			color: red;
		}`;
		const invalidCSS = `.a {
			color: red;
			color: blue;
		}`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-block-no-duplicate-properties'), true);
	});

	test('declaration-block-no-redundant-longhand-properties', async () => {
		const validCSS = `.a { margin: 1px; }`;
		const invalidCSS = `.a {
			margin-top: 1px;
			margin-right: 1px;
			margin-bottom: 1px;
			margin-left: 1px;
		}`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-block-no-redundant-longhand-properties'), true);
	});

	test('declaration-block-no-shorthand-property-overrides', async () => {
		const validCSS = `.a { margin: 1px 2px; }`;
		const invalidCSS = `.a {
			margin-left: 2px;
			margin: 1px;
		}`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-block-no-shorthand-property-overrides'), true);
	});

	test('declaration-block-single-line-max-declarations', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color: red; background: blue; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-block-single-line-max-declarations'), true);
	});

	test('declaration-empty-line-before', async () => {
		const validCSS = `
			.a {
				--foo: pink;

				color: red;
			}
		`;
		const invalidCSS = `
			.a {
				--foo: pink;
				color: red;
			}
		`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-empty-line-before'), true);
	});

	test('font-family-name-quotes', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: "Arial", sans-serif; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'font-family-name-quotes'), true);
	});

	test('font-family-no-duplicate-names', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: Arial, Arial, sans-serif; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'font-family-no-duplicate-names'), true);
	});

	test('font-family-no-missing-generic-family-keyword', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: Arial; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'font-family-no-missing-generic-family-keyword'), true);
	});

	test('function-calc-no-unspaced-operator', async () => {
		const validCSS = `.a { width: calc(100% - 10px); }`;
		const invalidCSS = `.a { width: calc(100%-10px); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-calc-no-unspaced-operator'), true);
	});

	test('function-linear-gradient-no-nonstandard-direction', async () => {
		const validCSS = `.a { background: linear-gradient(to right, red, blue); }`;
		const invalidCSS = `.a { background: linear-gradient(top, red, blue); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-linear-gradient-no-nonstandard-direction'), true);
	});

	test('function-name-case', async () => {
		const validCSS = `.a { color: rgb(0 0 0); }`;
		const invalidCSS = `.a { color: RGB(0 0 0); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-name-case'), true);
	});

	test('function-no-unknown', async () => {
		const validCSS = `.a { color: rgb(0 0 0); }`;
		const invalidCSS = `.a { color: unknownFunc(0); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-no-unknown'), true);
	});

	test('function-url-quotes', async () => {
		const validCSS = `.a { background: url("image.png"); }`;
		const invalidCSS = `.a { background: url(image.png); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-url-quotes'), true);
	});

	test('hue-degree-notation', async () => {
		const validCSS = `.a { color: hsl(198deg 28% 50%); }`;
		const invalidCSS = `.a { color: hsl(198 28% 50%); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'hue-degree-notation'), true);
	});

	test('import-notation', async () => {
		const validCSS = `@import url("a.css");`;
		const invalidCSS = `@import "a.css";`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'import-notation'), true);
	});

	test('keyframe-block-no-duplicate-selectors', async () => {
		const validCSS = `@keyframes slide { from { opacity: 0; } to { opacity: 1; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0; } from { opacity: 1; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'keyframe-block-no-duplicate-selectors'), true);
	});

	test('keyframe-declaration-no-important', async () => {
		const validCSS = `@keyframes slide { from { opacity: 0; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0 !important; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'keyframe-declaration-no-important'), true);
	});

	test('keyframe-selector-notation', async () => {
		const validCSS = `@keyframes slide { 0% { opacity: 0; } 100% { opacity: 1; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0; } 100% { opacity: 1; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'keyframe-selector-notation'), true);
	});

	test('keyframes-name-pattern', async () => {
		const validCSS = `@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`;
		const invalidCSS = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'keyframes-name-pattern'), true);
	});

	test('length-zero-no-unit', async () => {
		const validCSS = `.a {
			--custom: 0px;

			margin: 0;
		}`;
		const invalidCSS = `.a { margin: 0px; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'length-zero-no-unit'), true);
	});

	test('lightness-notation', async () => {
		const validCSS = `.a { color: oklch(85% 0.17 88deg); }`;
		const invalidCSS = `.a { color: oklch(0.85 0.17 88deg); }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'lightness-notation'), true);
	});

	test('media-feature-name-no-unknown', async () => {
		const validCSS = `@media screen { .a { color: red; } }`;
		const invalidCSS = `@media screen and (unknown: 10px) { .a { color: red; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'media-feature-name-no-unknown'), true);
	});

	test('media-feature-name-no-vendor-prefix', async () => {
		const validCSS = `@media (width >= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (-webkit-max-device-pixel-ratio: 2) { .a { color: red; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'media-feature-name-no-vendor-prefix'), true);
	});

	test('media-feature-range-notation', async () => {
		const validCSS = `@media (width <= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (max-width: 100px) { .a { color: red; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'media-feature-range-notation'), true);
	});

	test('media-query-no-invalid', async () => {
		const validCSS = `@media (width <= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (max-width: ) { .a { color: red; } }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'media-query-no-invalid'), true);
	});

	test('named-grid-areas-no-invalid', async () => {
		const validCSS = `
	      .a {
	        display: grid;
	        grid-template-areas: "header header" "main sidebar";
	      }
	    `;
		const invalidCSS = `
	      .a {
	        display: grid;
	        grid-template-areas: "header" "main sidebar";
	      }
	    `;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'named-grid-areas-no-invalid'), true);
	});

	test('no-descending-specificity', async () => {
		const validCSS = `
			a { top: 10px; }
			.b a { top: 10px; }
		`;
		const invalidCSS = `
			.b a { top: 10px; }
			a { top: 10px; }
		`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-descending-specificity'), true);
	});

	test('no-duplicate-at-import-rules', async () => {
		const validCSS = `@import url("a.css");`;
		const invalidCSS = `@import url("a.css"); @import url("a.css");`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-duplicate-at-import-rules'), true);
	});

	test('no-duplicate-selectors', async () => {
		const validCSS = `.a { color: red; } .b { color: blue; }`;
		const invalidCSS = `.a { color: red; } .a { color: blue; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-duplicate-selectors'), true);
	});

	test('no-empty-source', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = ``;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-empty-source'), true);
	});

	test('no-invalid-double-slash-comments', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `a {
			//color: pink;
		}`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-invalid-double-slash-comments'), true);
	});

	test('no-invalid-position-at-import-rule', async () => {
		const validCSS = `@import url("a.css");

		.a { color: red; }`;
		const invalidCSS = `.a { color: red; }

		@import url("a.css");`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-invalid-position-at-import-rule'), true);
	});

	test('no-irregular-whitespace', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color:\u00A0red;}`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-irregular-whitespace'), true);
	});

	test('number-max-precision', async () => {
		const validCSS = `.a { margin: 1.2345px; }`;
		const invalidCSS = `.a { margin: 1.23456px; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'number-max-precision'), true);
	});

	test('property-no-unknown', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { unknown-property: 1; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'property-no-unknown'), true);
	});

	test('property-no-vendor-prefix', async () => {
		const validCSS = `.a { display: flex; }`;
		const invalidCSS = `.a { -moz-columns: 2; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'property-no-vendor-prefix'), true);
	});

	test('rule-empty-line-before', async () => {
		const validCSS = `
			a {
				color: red;
			}

			b {
				color: blue;
			}
		`;
		const invalidCSS = `
			a {
				color: red;
			}
			b {
				color: blue;
			}
		`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'rule-empty-line-before'), true);
	});

	test('selector-anb-no-unmatchable', async () => {
		const validCSS = `a:nth-last-child(1n) { color: red; }`;
		const invalidCSS = `a:nth-child(0) { color: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-anb-no-unmatchable'), true);
	});

	test('selector-attribute-quotes', async () => {
		const validCSS = `[type="text"] { color: red; }`;
		const invalidCSS = `[type=text] { color: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-attribute-quotes'), true);
	});

	test('selector-class-pattern', async () => {
		const validCSS = `.button__primary--icon { color: red; }`;
		const invalidCSS = `.ButtonPrimaryIcon { color: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-class-pattern'), true);
	});

	test('selector-no-vendor-prefix', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `input::-moz-placeholder { color: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-no-vendor-prefix'), true);
	});

	test('selector-not-notation', async () => {
		const validCSS = `:not(.a) { color: red; }`;
		const invalidCSS = `:not(a):not(div) { color: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-not-notation'), true);
	});

	test('selector-pseudo-class-no-unknown', async () => {
		const validCSS = `:hover { color: red; }`;
		const invalidCSS = `:unknown { color: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-pseudo-class-no-unknown'), true);
	});

	test('selector-pseudo-element-colon-notation', async () => {
		const validCSS = `p::before { content: ''; }`;
		const invalidCSS = `p:before { content: ''; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-pseudo-element-colon-notation'), true);
	});

	test('selector-pseudo-element-no-unknown', async () => {
		const validCSS = `
			p::before { content: ''; }
			:host { color: red; }
			:host-context { color: red; }
			::ng-deep { color: red; }
		`;
		const invalidCSS = `p::unknown { content: ''; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-pseudo-element-no-unknown'), true);
	});

	test('selector-type-case', async () => {
		const validCSS = `div { color: red; }`;
		const invalidCSS = `DIV { color: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-type-case'), true);
	});

	test('selector-type-no-unknown', async () => {
		const validCSS = `div { color: red; }`;
		const invalidCSS = `unknown { color: red; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-type-no-unknown'), true);
	});

	test('shorthand-property-no-redundant-values', async () => {
		const validCSS = `.a { margin: 1px 2px; }`;
		const invalidCSS = `.a { margin: 1px 1px 1px 1px; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'shorthand-property-no-redundant-values'), true);
	});

	test('string-no-newline', async () => {
		const validCSS = `.a { content: "Hello"; }`;
		const invalidCSS = `.a { content: "Hello\nWorld"; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'string-no-newline'), true);
	});

	test('unit-no-unknown', async () => {
		const validCSS = `.a { margin: 10px; }`;
		const invalidCSS = `.a { margin: 10unknown; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'unit-no-unknown'), true);
	});

	test('value-keyword-case', async () => {
		const validCSS = `.a { display: block; }`;
		const invalidCSS = `.a { display: Block; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'value-keyword-case'), true);
	});

	test('value-no-vendor-prefix', async () => {
		const validCSS = `.a { display: flex; }`;
		const invalidCSS = `.a { display: -webkit-flex; }`;

		let result = await lintCss(validCSS);
		strictEqual(result.errored, false);

		result = await lintCss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'value-no-vendor-prefix'), true);
	});
});
