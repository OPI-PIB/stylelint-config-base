import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

import config from '../src/css.mjs';

function lintCss(code, customConfig = config) {
	return stylelint.lint({
		code,
		config: customConfig
	});
}

describe('Stylelint Rules', () => {
	it('plugin/no-unsupported-browser-features', async () => {
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
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS, customConfig);
		expect(result.results[0].warnings.some((x) => x.rule === 'plugin/no-unsupported-browser-features')).toBe(true);
	});

	it('order/order', async () => {
		const validCSS = `a {
			--height: 10px;

			top: 0;
		}`;
		const invalidCSS = `a {
			top: 0;

			--height: 10px;
		}`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'order/order')).toBe(true);
	});

	it('order/properties-alphabetical-order', async () => {
		const validCSS = `.a { 
		background: red; 
		color: blue; 
		}`;
		const invalidCSS = `.a { 
		color: blue; 
		background: red; 
		}`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'order/properties-alphabetical-order')).toBe(true);
	});

	it('alpha-value-notation', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color: rgba(255,255,255,0.5); }`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'alpha-value-notation')).toBe(true);
	});

	it('annotation-no-unknown', async () => {
		const validCSS = `a { color: green; }`;
		const invalidCSS = `a { color: green !im; }`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'annotation-no-unknown')).toBe(true);
	});

	it('at-rule-empty-line-before', async () => {
		const validCSS = `
	      @import url("a.css");

	      @media screen { a { color: red; } }
	    `;
		const invalidCSS = `
	      @import url("a.css");
	      @media screen { a { color: red; } }
	    `;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'at-rule-empty-line-before')).toBe(true);
	});

	it('at-rule-no-unknown', async () => {
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
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'at-rule-no-unknown')).toBe(true);
	});

	it('at-rule-no-vendor-prefix', async () => {
		const validCSS = `@media screen { a { color: red; } }`;
		const invalidCSS = `@-webkit-keyframes slide { from { opacity: 0; } }`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'at-rule-no-vendor-prefix')).toBe(true);
	});

	it('block-no-empty', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { }`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'block-no-empty')).toBe(true);
	});

	it('color-function-notation', async () => {
		const validCSS = `.a { color: rgb(255 0 0 / 50%); }`;
		const invalidCSS = `.a { color: rgb(255,0,0,0.5); }`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'color-function-notation')).toBe(true);
	});

	it('color-hex-length', async () => {
		const validCSS = `.a { color: #fff; }`;
		const invalidCSS = `.a { color: #ffffff; }`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'color-hex-length')).toBe(true);
	});

	it('color-no-invalid-hex', async () => {
		const validCSS = `.a { color: #abc; }`;
		const invalidCSS = `.a { color: #zzzzzz; }`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'color-no-invalid-hex')).toBe(true);
	});

	it('comment-empty-line-before', async () => {
		const validCSS = `
			/* comment */

			.a { color: red; }
		`;
		const invalidCSS = `
			.a { color: red; }
			/* comment */
		`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'comment-empty-line-before')).toBe(true);
	});

	it('comment-no-empty', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `/*  */`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'comment-no-empty')).toBe(true);
	});

	it('comment-whitespace-inside', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `/*comment*/`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'comment-whitespace-inside')).toBe(true);
	});

	it('custom-media-pattern', async () => {
		const validCSS = `@custom-media --small-screen (max-width: 30em);`;
		const invalidCSS = `@custom-media --bar_a (min-width: 30em);`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'custom-media-pattern')).toBe(true);
	});

	it('custom-property-empty-line-before', async () => {
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
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'custom-property-empty-line-before')).toBe(true);
	});

	it('custom-property-no-missing-var-function', async () => {
		const validCSS = `:root { 
			--main-color: red; 

			color: var(--main-color); 
		}`;
		const invalidCSS = `:root { 
			--main-color: red; 

			color: --main-color; 
		}`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'custom-property-no-missing-var-function')).toBe(true);
	});

	it('custom-property-pattern', async () => {
		const validCSS = `:root { --button--primary-color: red; }`;
		const invalidCSS = `:root { --buttonColor: red; }`;

		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);

		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'custom-property-pattern')).toBe(true);
	});

	it('declaration-block-no-duplicate-custom-properties', async () => {
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
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'declaration-block-no-duplicate-custom-properties')).toBe(
			true
		);
	});

	it('declaration-block-no-duplicate-properties', async () => {
		const validCSS = `.a { 
			background: blue;
			color: red; 
		}`;
		const invalidCSS = `.a { 
			color: red; 
			color: blue; 
		}`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'declaration-block-no-duplicate-properties')).toBe(true);
	});

	it('declaration-block-no-redundant-longhand-properties', async () => {
		const validCSS = `.a { margin: 1px; }`;
		const invalidCSS = `.a { 
			margin-top: 1px; 
			margin-right: 1px; 
			margin-bottom: 1px; 
			margin-left: 1px; 
		}`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(
			result.results[0].warnings.some((x) => x.rule === 'declaration-block-no-redundant-longhand-properties')
		).toBe(true);
	});

	it('declaration-block-no-shorthand-property-overrides', async () => {
		const validCSS = `.a { margin: 1px 2px; }`;
		const invalidCSS = `.a { 
			margin-left: 2px;
			margin: 1px;
		}`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'declaration-block-no-shorthand-property-overrides')).toBe(
			true
		);
	});

	it('declaration-block-single-line-max-declarations', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color: red; background: blue; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'declaration-block-single-line-max-declarations')).toBe(
			true
		);
	});

	it('declaration-empty-line-before', async () => {
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
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'declaration-empty-line-before')).toBe(true);
	});

	it('font-family-name-quotes', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: "Arial", sans-serif; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'font-family-name-quotes')).toBe(true);
	});

	it('font-family-no-duplicate-names', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: Arial, Arial, sans-serif; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'font-family-no-duplicate-names')).toBe(true);
	});

	it('font-family-no-missing-generic-family-keyword', async () => {
		const validCSS = `.a { font-family: Arial, sans-serif; }`;
		const invalidCSS = `.a { font-family: Arial; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'font-family-no-missing-generic-family-keyword')).toBe(
			true
		);
	});

	it('function-calc-no-unspaced-operator', async () => {
		const validCSS = `.a { width: calc(100% - 10px); }`;
		const invalidCSS = `.a { width: calc(100%-10px); }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'function-calc-no-unspaced-operator')).toBe(true);
	});

	it('function-linear-gradient-no-nonstandard-direction', async () => {
		const validCSS = `.a { background: linear-gradient(to right, red, blue); }`;
		const invalidCSS = `.a { background: linear-gradient(top, red, blue); }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'function-linear-gradient-no-nonstandard-direction')).toBe(
			true
		);
	});

	it('function-name-case', async () => {
		const validCSS = `.a { color: rgb(0 0 0); }`;
		const invalidCSS = `.a { color: RGB(0 0 0); }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'function-name-case')).toBe(true);
	});

	it('function-no-unknown', async () => {
		const validCSS = `.a { color: rgb(0 0 0); }`;
		const invalidCSS = `.a { color: unknownFunc(0); }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'function-no-unknown')).toBe(true);
	});

	it('function-url-quotes', async () => {
		const validCSS = `.a { background: url("image.png"); }`;
		const invalidCSS = `.a { background: url(image.png); }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'function-url-quotes')).toBe(true);
	});

	it('hue-degree-notation', async () => {
		const validCSS = `.a { color: hsl(198deg 28% 50%); }`;
		const invalidCSS = `.a { color: hsl(198 28% 50%); }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'hue-degree-notation')).toBe(true);
	});

	it('import-notation', async () => {
		const validCSS = `@import url("a.css");`;
		const invalidCSS = `@import "a.css";`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'import-notation')).toBe(true);
	});

	it('keyframe-block-no-duplicate-selectors', async () => {
		const validCSS = `@keyframes slide { from { opacity: 0; } to { opacity: 1; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0; } from { opacity: 1; } }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'keyframe-block-no-duplicate-selectors')).toBe(true);
	});

	it('keyframe-declaration-no-important', async () => {
		const validCSS = `@keyframes slide { from { opacity: 0; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0 !important; } }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'keyframe-declaration-no-important')).toBe(true);
	});

	it('keyframe-selector-notation', async () => {
		const validCSS = `@keyframes slide { 0% { opacity: 0; } 100% { opacity: 1; } }`;
		const invalidCSS = `@keyframes slide { from { opacity: 0; } 100% { opacity: 1; } }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'keyframe-selector-notation')).toBe(true);
	});

	it('keyframes-name-pattern', async () => {
		const validCSS = `@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`;
		const invalidCSS = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'keyframes-name-pattern')).toBe(true);
	});

	it('length-zero-no-unit', async () => {
		const validCSS = `.a { 
			--custom: 0px;

			margin: 0;
		}`;
		const invalidCSS = `.a { margin: 0px; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'length-zero-no-unit')).toBe(true);
	});

	it('lightness-notation', async () => {
		const validCSS = `.a { color: oklch(85% 0.17 88deg); }`;
		const invalidCSS = `.a { color: oklch(0.85 0.17 88deg); }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'lightness-notation')).toBe(true);
	});

	it('media-feature-name-no-unknown', async () => {
		const validCSS = `@media screen { .a { color: red; } }`;
		const invalidCSS = `@media screen and (unknown: 10px) { .a { color: red; } }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'media-feature-name-no-unknown')).toBe(true);
	});

	it('media-feature-name-no-vendor-prefix', async () => {
		const validCSS = `@media (width >= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (-webkit-max-device-pixel-ratio: 2) { .a { color: red; } }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'media-feature-name-no-vendor-prefix')).toBe(true);
	});

	it('media-feature-range-notation', async () => {
		const validCSS = `@media (width <= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (max-width: 100px) { .a { color: red; } }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'media-feature-range-notation')).toBe(true);
	});

	it('media-query-no-invalid', async () => {
		const validCSS = `@media (width <= 100px) { .a { color: red; } }`;
		const invalidCSS = `@media (max-width: ) { .a { color: red; } }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'media-query-no-invalid')).toBe(true);
	});

	it('named-grid-areas-no-invalid', async () => {
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
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'named-grid-areas-no-invalid')).toBe(true);
	});

	it('no-descending-specificity', async () => {
		const validCSS = `
			a { top: 10px; }
			.b a { top: 10px; }
		`;
		const invalidCSS = `
			.b a { top: 10px; }
			a { top: 10px; }
		`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'no-descending-specificity')).toBe(true);
	});

	it('no-duplicate-at-import-rules', async () => {
		const validCSS = `@import url("a.css");`;
		const invalidCSS = `@import url("a.css"); @import url("a.css");`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'no-duplicate-at-import-rules')).toBe(true);
	});

	it('no-duplicate-selectors', async () => {
		const validCSS = `.a { color: red; } .b { color: blue; }`;
		const invalidCSS = `.a { color: red; } .a { color: blue; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'no-duplicate-selectors')).toBe(true);
	});

	it('no-empty-source', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = ``;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'no-empty-source')).toBe(true);
	});

	it('no-invalid-double-slash-comments', async () => {
		const validCSS = `/* comment */`;
		const invalidCSS = `a {
			//color: pink;
		}`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'no-invalid-double-slash-comments')).toBe(true);
	});

	it('no-invalid-position-at-import-rule', async () => {
		const validCSS = `@import url("a.css"); 
		
		.a { color: red; }`;
		const invalidCSS = `.a { color: red; } 
		
		@import url("a.css");`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'no-invalid-position-at-import-rule')).toBe(true);
	});

	it('no-irregular-whitespace', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { color:\u00A0red;}`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'no-irregular-whitespace')).toBe(true);
	});

	it('number-max-precision', async () => {
		const validCSS = `.a { margin: 1.2345px; }`;
		const invalidCSS = `.a { margin: 1.23456px; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'number-max-precision')).toBe(true);
	});

	it('property-no-unknown', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `.a { unknown-property: 1; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'property-no-unknown')).toBe(true);
	});

	it('property-no-vendor-prefix', async () => {
		const validCSS = `.a { display: flex; }`;
		const invalidCSS = `.a { -moz-columns: 2; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'property-no-vendor-prefix')).toBe(true);
	});

	it('rule-empty-line-before', async () => {
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
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'rule-empty-line-before')).toBe(true);
	});

	it('selector-anb-no-unmatchable', async () => {
		const validCSS = `a:nth-last-child(1n) { color: red; }`;
		const invalidCSS = `a:nth-child(0) { color: red; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-anb-no-unmatchable')).toBe(true);
	});

	it('selector-attribute-quotes', async () => {
		const validCSS = `[type="text"] { color: red; }`;
		const invalidCSS = `[type=text] { color: red; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-attribute-quotes')).toBe(true);
	});

	it('selector-class-pattern', async () => {
		const validCSS = `.button__primary--icon { color: red; }`;
		const invalidCSS = `.ButtonPrimaryIcon { color: red; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-class-pattern')).toBe(true);
	});

	it('selector-no-vendor-prefix', async () => {
		const validCSS = `.a { color: red; }`;
		const invalidCSS = `input::-moz-placeholder { color: red; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-no-vendor-prefix')).toBe(true);
	});

	it('selector-not-notation', async () => {
		const validCSS = `:not(.a) { color: red; }`;
		const invalidCSS = `:not(a):not(div) { color: red; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-not-notation')).toBe(true);
	});

	it('selector-pseudo-class-no-unknown', async () => {
		const validCSS = `:hover { color: red; }`;
		const invalidCSS = `:unknown { color: red; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-pseudo-class-no-unknown')).toBe(true);
	});

	it('selector-pseudo-element-colon-notation', async () => {
		const validCSS = `p::before { content: ''; }`;
		const invalidCSS = `p:before { content: ''; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-pseudo-element-colon-notation')).toBe(true);
	});

	it('selector-pseudo-element-no-unknown', async () => {
		const validCSS = `
			p::before { content: ''; }
			:host { color: red; }
			:host-context { color: red; }
			::ng-deep { color: red; }
		`;
		const invalidCSS = `p::unknown { content: ''; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-pseudo-element-no-unknown')).toBe(true);
	});

	it('selector-type-case', async () => {
		const validCSS = `div { color: red; }`;
		const invalidCSS = `DIV { color: red; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-type-case')).toBe(true);
	});

	it('selector-type-no-unknown', async () => {
		const validCSS = `div { color: red; }`;
		const invalidCSS = `unknown { color: red; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'selector-type-no-unknown')).toBe(true);
	});

	it('shorthand-property-no-redundant-values', async () => {
		const validCSS = `.a { margin: 1px 2px; }`;
		const invalidCSS = `.a { margin: 1px 1px 1px 1px; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'shorthand-property-no-redundant-values')).toBe(true);
	});

	it('string-no-newline', async () => {
		const validCSS = `.a { content: "Hello"; }`;
		const invalidCSS = `.a { content: "Hello\nWorld"; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'string-no-newline')).toBe(true);
	});

	it('unit-no-unknown', async () => {
		const validCSS = `.a { margin: 10px; }`;
		const invalidCSS = `.a { margin: 10unknown; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'unit-no-unknown')).toBe(true);
	});

	it('value-keyword-case', async () => {
		const validCSS = `.a { display: block; }`;
		const invalidCSS = `.a { display: Block; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'value-keyword-case')).toBe(true);
	});

	it('value-no-vendor-prefix', async () => {
		const validCSS = `.a { display: flex; }`;
		const invalidCSS = `.a { display: -webkit-flex; }`;
		let result = await lintCss(validCSS);
		expect(result.errored).toBe(false);
		result = await lintCss(invalidCSS);
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings.some((x) => x.rule === 'value-no-vendor-prefix')).toBe(true);
	});
});
