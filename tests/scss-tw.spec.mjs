import { strictEqual } from 'assert';
import { describe, test } from 'node:test';

import stylelint from 'stylelint';

import config from '../src/scss-tw.mjs';

function lintScss(code, customConfig = config) {
	return stylelint.lint({
		code,
		config: customConfig
	});
}

function hasRule(result, rule) {
	return result.results[0].warnings.some((x) => x.rule === rule);
}

describe('Stylelint Rules SCSS Tailwind', () => {
	test('alpha-value-notation', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color: rgba(255,255,255,0.5); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'alpha-value-notation'), true);
	});

	test('annotation-no-unknown', async () => {
		const validCSS = `a { color: green; }`;
		const invalidCSS = `a { color: green !im; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('at-rule-descriptor-no-unknown', async () => {
		const validCSS = `@property --foo {
  syntax: "<color>";
}`;
		const invalidCSS = `@property --foo {
  unknown-descriptor: "<color>";
}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('at-rule-descriptor-value-no-unknown', async () => {
		const validCSS = `@property --foo {
  syntax: "<color>";
}`;
		const invalidCSS = `@property --foo {
  syntax: unknown;
}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('at-rule-empty-line-before', async () => {
		const validCSS = `
			@charset "UTF-8";
			@import 'a';
			@use 'a';
			@forward 'a';

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
		const invalidCSS = `
			@import "x.css";

			@import "y.css";

			@media print {
				a { color: red; }
			}
		`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'at-rule-empty-line-before'), true);
	});

	test('at-rule-no-unknown', async () => {
		const validCSS = `
			@use 'a';
			@forward 'a';
		`;
		const invalidCSS = `@unknown-rule { a { color: red; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'at-rule-no-unknown'), false);
		strictEqual(hasRule(result, 'scss/at-rule-no-unknown'), true);
	});

	test('at-rule-no-vendor-prefix', async () => {
		const validCSS = `@media screen { a { color: red; } }`;
		const invalidCSS = `@-webkit-keyframes slide { from { opacity: 0; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'at-rule-no-vendor-prefix'), true);
	});

	test('at-rule-prelude-no-invalid', async () => {
		const validCSS = `@property --foo {
			syntax: "<color>";
		}`;
		const invalidCSS = `@property foo {
			syntax: "<color>";
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('block-no-empty', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'block-no-empty'), true);
	});

	test('color-function-notation', async () => {
		const validCSS = `.a { color: rgb(255 0 0 / 50%); }`;
		const invalidCSS = `.a { color: rgb(255,0,0,0.5); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'color-function-notation'), true);
	});

	test('color-hex-length', async () => {
		const validCSS = `.a { color: #fff; }`;
		const invalidCSS = `.a { color: #ffffff; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'color-hex-length'), true);
	});

	test('color-no-invalid-hex', async () => {
		const validCSS = `.a { color: #abc; }`;
		const invalidCSS = `.a { color: #zzzzzz; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'comment-empty-line-before'), true);
	});

	test('comment-no-empty', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `/*  */`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('comment-whitespace-inside', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `/*comment*/`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'comment-whitespace-inside'), true);
	});

	test('custom-media-pattern', async () => {
		const validCSS = `@custom-media --small-screen (max-width: 30em);`;
		const invalidCSS = `@custom-media --bar_a (min-width: 30em);`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'custom-property-no-missing-var-function'), true);
	});

	test('custom-property-pattern', async () => {
		const validCSS = `:root { --button--primary-color: red; }`;
		const invalidCSS = `:root { --buttonColor: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
		strictEqual(hasRule(result, 'custom-property-pattern'), false);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-block-no-redundant-longhand-properties'), true);
	});

	test('declaration-block-no-shorthand-property-overrides', async () => {
		const validCSS = `.a { margin: 1px 2px; }`;
		const invalidCSS = `.a {
			margin-left: 2px;
			margin: 1px;
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-block-no-shorthand-property-overrides'), true);
	});

	test('declaration-block-single-line-max-declarations', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color: red; background: blue; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'declaration-empty-line-before'), true);
	});

	test('declaration-property-value-no-unknown', async () => {
		const validCSS = `a { top: 0; }`;
		const invalidCSS = `a { top: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('font-family-name-quotes', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: "Arial", sans-serif; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'font-family-name-quotes'), true);
	});

	test('font-family-no-duplicate-names', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: Arial, Arial, sans-serif; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'font-family-no-duplicate-names'), true);
	});

	test('font-family-no-missing-generic-family-keyword', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: Arial; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'font-family-no-missing-generic-family-keyword'), true);
	});

	test('function-calc-no-unspaced-operator', async () => {
		const validCSS = `.a { width: calc(100% - 10px); }`;
		const invalidCSS = `.a { width: calc(100%-10px); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-calc-no-unspaced-operator'), true);
	});

	test('function-linear-gradient-no-nonstandard-direction', async () => {
		const validCSS = `.a { background: linear-gradient(to right, red, blue); }`;
		const invalidCSS = `.a { background: linear-gradient(top, red, blue); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-linear-gradient-no-nonstandard-direction'), true);
	});

	test('function-name-case', async () => {
		const validCSS = `.a { color: rgb(0 0 0); }`;
		const invalidCSS = `.a { color: RGB(0 0 0); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-name-case'), true);
	});

	test('function-no-unknown', async () => {
		const validCSS = `.a { color: rgb(0 0 0); }`;
		const invalidCSS = `.a { color: foo(0); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('function-url-quotes', async () => {
		const validCSS = `.a { background: url("image.png"); }`;
		const invalidCSS = `.a { background: url(image.png); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'function-url-quotes'), true);
	});

	test('hue-degree-notation', async () => {
		const validCSS = `.a { color: hsl(198deg 28% 50%); }`;
		const invalidCSS = `.a { color: hsl(198 28% 50%); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'hue-degree-notation'), true);
	});

	test('import-notation', async () => {
		const validCSS = `@import "a.css";`;
		const invalidCSS = `@import url("a.css");`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'import-notation'), true);
	});

	test('keyframe-block-no-duplicate-selectors', async () => {
		const validCSS = `@keyframes slide { from { opacity: 0; } to { opacity: 1; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0; } from { opacity: 1; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'keyframe-block-no-duplicate-selectors'), true);
	});

	test('keyframe-declaration-no-important', async () => {
		const validCSS = `@keyframes slide { from { opacity: 0; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0 !important; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'keyframe-declaration-no-important'), true);
	});

	test('keyframe-selector-notation', async () => {
		const validCSS = `@keyframes slide { 0% { opacity: 0; } 100% { opacity: 1; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0; } 100% { opacity: 1; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'keyframe-selector-notation'), true);
	});

	test('keyframes-name-pattern', async () => {
		const validCSS = `@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`;
		const invalidCSS = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'keyframes-name-pattern'), true);
	});

	test('length-zero-no-unit', async () => {
		const validCSS = `.a {
			--custom: 0px;

			margin: 0;
		}`;
		const invalidCSS = `.a { margin: 0px; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'length-zero-no-unit'), true);
	});

	test('lightness-notation', async () => {
		const validCSS = `.a { color: oklch(85% 0.17 88deg); }`;
		const invalidCSS = `.a { color: oklch(0.85 0.17 88deg); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'lightness-notation'), true);
	});

	test('media-feature-name-no-unknown', async () => {
		const validCSS = `@media screen { .a { color: red; } }`;
		const invalidCSS = `@media screen and (unknown: 10px) { .a { color: red; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'media-feature-name-no-unknown'), true);
	});

	test('media-feature-name-no-vendor-prefix', async () => {
		const validCSS = `@media (width >= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (-webkit-max-device-pixel-ratio: 2) { .a { color: red; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'media-feature-name-no-vendor-prefix'), true);
	});

	test('media-feature-name-value-no-unknown', async () => {
		const validCSS = `@media (width >= 100px) { 
			a {
				top: 1px;
			}
		}`;
		const invalidCSS = `@media (width: auto) { 
			a {
				top: 1px;
			}
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'media-feature-name-value-no-unknown'), false);
	});

	test('media-feature-range-notation', async () => {
		const validCSS = `@media (width <= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (max-width: 100px) { .a { color: red; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'media-feature-range-notation'), true);
	});

	test('media-query-no-invalid', async () => {
		const validCSS = `@media (width <= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (max-width: ) { .a { color: red; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'named-grid-areas-no-invalid'), true);
	});

	test('nesting-selector-no-missing-scoping-root', async () => {
		const validCSS = `a {
			@media all {
				& {
					color: red;
				}
			}
		}`;
		const invalidCSS = `@media all {
			& {
				color: red;
			}
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'nesting-selector-no-missing-scoping-root'), true);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-descending-specificity'), true);
	});

	test('no-duplicate-at-import-rules', async () => {
		const validCSS = `@import "a";`;
		const invalidCSS = `@import "a"; @import "a";`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-duplicate-at-import-rules'), true);
	});

	test('no-duplicate-selectors', async () => {
		const validCSS = `.a { color: red; } .b { color: blue; }`;
		const invalidCSS = `.a { color: red; } .a { color: blue; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-duplicate-selectors'), true);
	});

	test('no-empty-source', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = ``;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-empty-source'), true);
	});

	test('no-invalid-double-slash-comments', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `a {
			//color: pink;
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('no-invalid-position-at-import-rule', async () => {
		const validCSS = `@import "a.css";

		.a { color: red; }`;
		const invalidCSS = `.a { color: red; }

		@import "a.css";`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-invalid-position-at-import-rule'), true);
	});

	test('no-irregular-whitespace', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color:\u00A0red;}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'no-irregular-whitespace'), true);
	});

	test('number-max-precision', async () => {
		const validCSS = `.a { margin: 1.2345px; }`;
		const invalidCSS = `.a { margin: 1.23456px; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'number-max-precision'), true);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'order/properties-alphabetical-order'), true);
	});

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

		let result = await lintScss(validCSS, customConfig);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS, customConfig);
		strictEqual(hasRule(result, 'plugin/no-unsupported-browser-features'), true);
	});

	test('property-no-unknown', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { unknown-property: 1; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'property-no-unknown'), true);
	});

	test('property-no-vendor-prefix', async () => {
		const validCSS = `.a { display: flex; }`;
		const invalidCSS = `.a { -moz-columns: 2; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'rule-empty-line-before'), true);
	});

	test('selector-anb-no-unmatchable', async () => {
		const validCSS = `a:nth-last-child(1n) { color: red; }`;
		const invalidCSS = `a:nth-child(0) { color: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-anb-no-unmatchable'), true);
	});

	test('selector-attribute-quotes', async () => {
		const validCSS = `[type="text"] { color: red; }`;
		const invalidCSS = `[type=text] { color: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-attribute-quotes'), true);
	});

	test('selector-class-pattern', async () => {
		const validCSS = `.button__primary--icon { color: red; }`;
		const invalidCSS = `.ButtonPrimaryIcon { color: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-class-pattern'), true);
	});

	test('selector-no-vendor-prefix', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `input::-moz-placeholder { color: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-no-vendor-prefix'), true);
	});

	test('selector-not-notation', async () => {
		const validCSS = `:not(.a) { color: red; }`;
		const invalidCSS = `:not(a):not(div) { color: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-not-notation'), true);
	});

	test('selector-pseudo-class-no-unknown', async () => {
		const validCSS = `:hover { color: red; }`;
		const invalidCSS = `:unknown { color: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-pseudo-class-no-unknown'), true);
	});

	test('selector-pseudo-element-colon-notation', async () => {
		const validCSS = `p::before { content: ''; }`;
		const invalidCSS = `p:before { content: ''; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
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

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-pseudo-element-no-unknown'), true);
	});

	test('selector-type-case', async () => {
		const validCSS = `div { color: red; }`;
		const invalidCSS = `DIV { color: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-type-case'), true);
	});

	test('selector-type-no-unknown', async () => {
		const validCSS = `div { color: red; }`;
		const invalidCSS = `unknown { color: red; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'selector-type-no-unknown'), true);
	});

	test('shorthand-property-no-redundant-values', async () => {
		const validCSS = `.a { margin: 1px 2px; }`;
		const invalidCSS = `.a { margin: 1px 1px 1px 1px; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'shorthand-property-no-redundant-values'), true);
	});

	test('string-no-newline', async () => {
		const validCSS = `.a { content: "Hello"; }`;
		const invalidCSS = `.a { content: "Hello\nWorld"; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'string-no-newline'), true);
	});

	test('unit-no-unknown', async () => {
		const validCSS = `.a { margin: 10px; }`;
		const invalidCSS = `.a { margin: 10unknown; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'unit-no-unknown'), true);
	});

	test('value-keyword-case', async () => {
		const validCSS = `.a { display: block; }`;
		const invalidCSS = `.a { display: Block; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'value-keyword-case'), true);
	});

	test('value-no-vendor-prefix', async () => {
		const validCSS = `.a { display: flex; }`;
		const invalidCSS = `.a { display: -webkit-flex; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'value-no-vendor-prefix'), true);
	});

	test('scss/at-else-closing-brace-newline-after', async () => {
		const validCSS = `@if true {
				color: red;
			} @else {
				color: blue;
			}`;
		const invalidCSS = `@if true {
				color: red;
			} @else {
				color: blue;
			} .a { color: green; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-else-closing-brace-newline-after'), true);
	});

	test('scss/at-else-closing-brace-space-after', async () => {
		const validCSS = `a {
			@if $x == 1 {
				color: red;
			} @else ($x ==2) {
				color: blue;
			} @else {
				color: green;
			}
		}`;
		const invalidCSS = `a {
			@if $x == 1 {
				color: red;
			} @else ($x ==2) {
				color: blue;
			}@else {
				color: green;
			}
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-else-closing-brace-space-after'), false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-else-closing-brace-space-after'), true);
	});

	test('scss/at-else-empty-line-before', async () => {
		const validCSS = `@if true {
				color: red;
			} @else {
				color: blue;
			}`;
		const invalidCSS = `@if true {
				color: red;
			}

			@else {
				color: blue;
			}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-else-empty-line-before'), true);
	});

	test('scss/at-else-if-parentheses-space-before', async () => {
		const validCSS = `a {
			@if $x == 1 {
				color: red;
			}

			width: 10px;
		}`;
		const invalidCSS = `@else if($foo){
			color: red;
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-else-if-parentheses-space-before'), true);
	});

	test('scss/at-extend-no-missing-placeholder', async () => {
		const validCSS = `%placeholder {
				color: red;
			}

			.a {
				@extend %placeholder;
			}`;
		const invalidCSS = `.a {
				@extend .b;
			}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-extend-no-missing-placeholder'), true);
	});

	test('scss/at-function-parentheses-space-before', async () => {
		const validCSS = `@function my-func() {
				@return 1;
			}`;
		const invalidCSS = `@function my-func () {
				@return 1;
			}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-function-parentheses-space-before'), true);
	});

	test('scss/at-function-pattern', async () => {
		const validCSS = `@function my-func() {
				@return 1;
			}`;
		const invalidCSS = `@function myFunc() {
				@return 1;
			}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-function-pattern'), true);
	});

	test('scss/at-if-closing-brace-newline-after', async () => {
		const validCSS = `@if true {
				color: red;
			}`;
		const invalidCSS = `@if true {
				color: red;
			} .a { color: green; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-if-closing-brace-newline-after'), true);
	});

	test('scss/at-if-closing-brace-space-after', async () => {
		const validCSS = `@if true {
				color: red;
			} @else {
				color: blue;
			}`;
		const invalidCSS = `@if true {
				color: red;
			}@else {
				color: blue;
			}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-if-closing-brace-space-after'), true);
	});

	test('scss/at-if-no-null', async () => {
		const validCSS = `a {
			@if $x {
				color: red;
			}
		}`;
		const invalidCSS = `a {
			@if $x == null {
				color: red;
			}
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-if-no-null'), true);
	});

	test('scss/at-import-partial-extension', async () => {
		const validCSS = `@import "variables";`;
		const invalidCSS = `@import "fff"`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/at-import-partial-extension-blacklist', async () => {
		const validCSS = `@import 'variables.sass';`;
		const invalidCSS = `@import 'variables.scssy';`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/at-import-partial-extension-whitelist', async () => {
		const validCSS = `@import 'variables.sass';`;
		const invalidCSS = `@import "fff.scssy"`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/at-mixin-argumentless-call-parentheses', async () => {
		const validCSS = `@include mixin;`;
		const invalidCSS = `@include mixin();`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-mixin-argumentless-call-parentheses'), true);
	});

	test('scss/at-mixin-parentheses-space-before', async () => {
		const validCSS = `@mixin foo() {
			a {
				color: red;
			}
		}`;
		const invalidCSS = `@mixin foo () {
			a {
				color: red;
			}
		}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-mixin-parentheses-space-before'), true);
	});

	test('scss/at-mixin-pattern', async () => {
		const validCSS = `@mixin my-mixin() {
				color: red;
			}`;
		const invalidCSS = `@mixin myMixin() {
				color: red;
			}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-mixin-pattern'), true);
	});

	test('scss/at-rule-conditional-no-parentheses', async () => {
		const validCSS = `@if $var {
				color: red;
			}`;
		const invalidCSS = `@if ($var) {
				color: red;
			}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-rule-conditional-no-parentheses'), true);
	});

	test('scss/at-root-no-redundant', async () => {
		const validCSS = `
			.a {
				@at-root .b {
					c: d;
				}
			}
		`;
		const invalidCSS = `
			.a {
				@at-root .b {
					c: d;
				}
			}

			@at-root .a {
				b: c;
			}
		`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/at-rule-no-unknown', async () => {
		const validCSS = `@charset 'UTF-8';`;
		const invalidCSS = ` @While ($i == 1) {}`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/at-rule-no-unknown'), true);
	});

	test('scss/at-use-no-unnamespaced', async () => {
		const validCSS = `@use 'a' as *;`;
		const invalidCSS = `@use 'a';`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/at-use-no-redundant-alias', async () => {
		const validCSS = `@use 'a' as b;`;
		const invalidCSS = `@use 'a' as a;`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/comment-no-empty', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `/* */`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/comment-no-loud', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `/*!
				comment
			*/`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/declaration-nested-properties', async () => {
		const validCSS = `.a { font-size: 1px; }`;
		const invalidCSS = `.a { font: { size: 1px; } }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/declaration-nested-properties-no-divided-groups', async () => {
		const validCSS = `
			.a {
				font: {
					size: 1px;
					weight: bold;
				}
			}
		`;
		const invalidCSS = `
			.a {
				font: {
					size: 1px;
				}
				font: {
					weight: bold;
				}
			}
		`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/declaration-nested-properties-no-divided-groups'), true);
	});

	test('scss/dimension-no-non-numeric-values', async () => {
		const validCSS = `.a { width: 10px; }`;
		const invalidCSS = `.a { width: auto; }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/dollar-variable-colon-space-after', async () => {
		const validCSS = `$var: 1px;`;
		const invalidCSS = `$var:1px;`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/dollar-variable-colon-space-after'), true);
	});

	test('scss/dollar-variable-colon-space-before', async () => {
		const validCSS = `$var: 1px;`;
		const invalidCSS = `$var : 1px;`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/dollar-variable-colon-space-before'), true);
	});

	test('scss/dollar-variable-default', async () => {
		const validCSS = `$var: 1px !default;`;
		const invalidCSS = `$var: 1px;`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/dollar-variable-empty-line-before', async () => {
		const validCSS = `a {
      width: 100px;

      $var1: 100px;
      $var2: 100px;
    }`;
		const invalidCSS = `a {
			width: 100px;
      $var1: 100px;
      $var2: 100px;
    }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/dollar-variable-empty-line-before'), true);
	});

	test('scss/dollar-variable-empty-line-after', async () => {
		const validCSS = `a {
      $var1: 100px;

    }`;
		const invalidCSS = `a {
      $var1: 100px;
    }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/dollar-variable-no-missing-interpolation', async () => {
		const validCSS = `
			.class {
				$var: "my-anim";

				animation-name: "#{$var}";
			}
		`;
		const invalidCSS = `
			.class {
				$var: "my-anim";
				
				animation-name: $var;
			}
		`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/dollar-variable-no-missing-interpolation'), true);
	});

	test('scss/dollar-variable-pattern', async () => {
		const validCSS = `$var: 1px;`;
		const invalidCSS = `$Var: 1px;`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/dollar-variable-pattern'), true);
	});

	test('scss/double-slash-comment-empty-line-before', async () => {
		const validCSS = `.a { color: red; }

	// comment`;
		const invalidCSS = `.a { color: red; }
	// comment`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/double-slash-comment-inline', async () => {
		const validCSS = `.a { color: red; }

			// comment`;
		const invalidCSS = `.a { color: red; } // comment`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/double-slash-comment-whitespace-inside', async () => {
		const validCSS = `// comment`;
		const invalidCSS = `//comment`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/function-calculation-no-interpolation', async () => {
		const validCSS = `.a { width: calc(100% - 10px); }`;
		const invalidCSS = `.a { width: calc(100% - #{$var}); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/function-color-relative', async () => {
		const validCSS = `.a { color: color.scale(blue, $alpha: -40%); }`;
		const invalidCSS = `.a { color: saturate(blue, 20%); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/function-no-unknown', async () => {
		const validCSS = `.a { color: rgb(0 0 0); }`;
		const invalidCSS = `.a { color: foo(0); }`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/function-quote-no-quoted-strings-inside', async () => {
		const validCSS = `
			@use 'sass:string';

			.a { content: string.quote(hello);
		}`;
		const invalidCSS = `
			@use 'sass:string';

			.a { content: string.quote("hello"); }
		`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/function-unquote-no-unquoted-strings-inside', async () => {
		const validCSS = `
			@use 'sass:string';

			a {
				content: string.unquote('hello');
			}
		`;
		const invalidCSS = `
			@use 'sass:string';

			a {
				content: string.unquote(hello);
			}
		`;

		let result = await lintScss(validCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidCSS);
		strictEqual(result.errored, false);
	});

	test('scss/load-no-partial-leading-underscore', async () => {
		const validSCSS = `@import 'variables';`;
		const invalidSCSS = `@import '_variables';`;

		let result = await lintScss(validSCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidSCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/load-no-partial-leading-underscore'), true);
	});

	test('scss/load-partial-extension', async () => {
		const validSCSS = `@import 'variables';`;
		const invalidSCSS = `@import 'variables.scss';`;

		let result = await lintScss(validSCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidSCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/load-partial-extension'), true);
	});

	test('scss/no-duplicate-mixins', async () => {
		const validSCSS = `
			@mixin my-mixin() {
				color: red;
			}

			@include my-mixin;
		`;
		const invalidSCSS = `
			@mixin my-mixin() {
				color: red;
			}

			@mixin my-mixin() {
				color: blue;
			}
		`;

		let result = await lintScss(validSCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidSCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/no-duplicate-mixins'), true);
	});

	test('scss/no-global-function-names', async () => {
		const validSCSS = `
			@function my-func() {
				@return 1;
			}

			a {
				color: my-func();
			}
		`;
		const invalidSCSS = `
			a {
				color: red(#6b717f);
			}
		`;

		let result = await lintScss(validSCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidSCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/no-global-function-names'), true);
	});

	test('scss/operator-no-newline-after', async () => {
		const validSCSS = `
			$a: 1 + 2;
		`;
		const invalidSCSS = `
			$a: 1 +
			2;
		`;

		let result = await lintScss(validSCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidSCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/operator-no-newline-after'), true);
	});

	test('scss/operator-no-newline-before', async () => {
		const validSCSS = `
			$a: 1 + 2;
		`;
		const invalidSCSS = `
			$a: 1
			+ 2;
		`;

		let result = await lintScss(validSCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidSCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/operator-no-newline-before'), true);
	});

	test('scss/operator-no-unspaced', async () => {
		const validSCSS = `
			$a: 1 + 2;
		`;
		const invalidSCSS = `
			$a: 1+2;
		`;

		let result = await lintScss(validSCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidSCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/operator-no-unspaced'), true);
	});

	test('scss/percent-placeholder-pattern', async () => {
		const validSCSS = `
			%block__element--modifier {
				color: red;
			}
		`;
		const invalidSCSS = `
			%InvalidPlaceholder {
				color: blue;
			}
		`;

		let result = await lintScss(validSCSS);
		strictEqual(result.errored, false);

		result = await lintScss(invalidSCSS);
		strictEqual(result.errored, true);
		strictEqual(hasRule(result, 'scss/percent-placeholder-pattern'), true);
	});
});
