import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

import config from '../src/css.mjs';

async function lintCss(code, customConfig = config) {
	const result = await stylelint.lint({
		code,
		config: customConfig
	});
	return result;
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
						browsers: [
							'> 5%',
							'last 1 Chrome version',
							'last 1 Firefox version',
							'last 2 Edge major versions',
							'last 5 Safari major versions',
							'last 5 iOS major versions'
						]
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

	// it('alpha-value-notation', async () => {
	// 	const validCSS = `.a { opacity: 0.5; color: rgba(255,255,255,50%); }`;
	// 	const invalidCSS = `.a { color: rgba(255,255,255,0.5); }`;

	// 	let result = await lintCss(validCSS);
	// 	expect(result.errored).toBe(false);

	// 	result = await lintCss(invalidCSS);
	// 	expect(result.errored).toBe(true);
	// 	expect(result.results[0].warnings[0].rule).toBe('alpha-value-notation');
	// });

	// it('annotation-no-unknown', async () => {
	// 	const validCSS = `/* stylelint-disable */`;
	// 	const invalidCSS = `/* unknown-annotation */`;

	// 	let result = await lintCss(validCSS);
	// 	expect(result.errored).toBe(false);

	// 	result = await lintCss(invalidCSS);
	// 	console.log(result);
	// 	expect(result.errored).toBe(true);
	// 	expect(result.results[0].warnings[0].rule).toBe('annotation-no-unknown');
	// });

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

	// it('at-rule-no-unknown', async () => {
	// 	const validCSS = `
	// 	@use 'variables';

	// 	@apply 'block';

	// 	@media screen { a { color: red; } }

	// 	@layer tailwind {
	// 		@tailwind base;
	// 		@tailwind components;
	// 		@tailwind utilities;
	// 	}
	// 	`;
	// 	const invalidCSS = `@unknown-rule { a { color: red; } }`;

	// 	let result = await lintCss(validCSS);
	// 	expect(result.errored).toBe(false);

	// 	result = await lintCss(invalidCSS);
	// 	expect(result.errored).toBe(true);
	// 	expect(result.results[0].warnings.some((x) => x.rule === 'at-rule-no-unknown')).toBe(true);
	// });

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

	//   it('color-function-notation', async () => {
	//     const validCSS = `.a { color: rgb(255 0 0 / 50%); }`;
	//     const invalidCSS = `.a { color: rgb(255,0,0,0.5); }`;

	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);

	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('color-function-notation');
	//   });

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

	//   it('comment-empty-line-before', async () => {
	//     const validCSS = `
	//       /* comment */

	//       .a { color: red; }
	//     `;
	//     const invalidCSS = `
	//       .a { color: red; }
	//       /* comment */
	//     `;

	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);

	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('comment-empty-line-before');
	//   });

	//   it('comment-no-empty', async () => {
	//     const validCSS = `/* comment */`;
	//     const invalidCSS = `/*  */`;

	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);

	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('comment-no-empty');
	//   });

	//   it('comment-whitespace-inside', async () => {
	//     const validCSS = `/* comment */`;
	//     const invalidCSS = `/*comment*/`;

	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);

	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('comment-whitespace-inside');
	//   });

	//   it('custom-media-pattern', async () => {
	//     const validCSS = `@custom-media --small-screen (max-width: 30em);`;
	//     const invalidCSS = `@custom-media smallScreen (max-width: 30em);`;

	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);

	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('custom-media-pattern');
	//   });

	//   it('custom-property-empty-line-before', async () => {
	//     const validCSS = `
	//       :root {
	//         --main-color: red;

	//         --secondary-color: blue;
	//       }
	//     `;
	//     const invalidCSS = `
	//       :root {
	//         --main-color: red;
	//         --secondary-color: blue;
	//       }
	//     `;

	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);

	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('custom-property-empty-line-before');
	//   });

	//   it('custom-property-no-missing-var-function', async () => {
	//     const validCSS = `:root { --main-color: red; color: var(--main-color); }`;
	//     const invalidCSS = `:root { --main-color: red; color: --main-color; }`;

	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);

	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('custom-property-no-missing-var-function');
	//   });

	//   it('custom-property-pattern', async () => {
	//     const validCSS = `:root { --button--primary-color: red; }`;
	//     const invalidCSS = `:root { --buttonColor: red; }`;

	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);

	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('custom-property-pattern');
	//   });

	// it('declaration-block-no-duplicate-custom-properties', async () => {
	//     const validCSS = `
	//       :root {
	//         --main-color: red;
	//         --secondary-color: blue;
	//       }
	//     `;
	//     const invalidCSS = `
	//       :root {
	//         --main-color: red;
	//         --main-color: blue;
	//       }
	//     `;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('declaration-block-no-duplicate-custom-properties');
	//   });

	//   it('declaration-block-no-duplicate-properties', async () => {
	//     const validCSS = `.a { color: red; background: blue; }`;
	//     const invalidCSS = `.a { color: red; color: blue; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('declaration-block-no-duplicate-properties');
	//   });

	//   it('declaration-block-no-redundant-longhand-properties', async () => {
	//     const validCSS = `.a { margin: 1px; }`;
	//     const invalidCSS = `.a { margin-top: 1px; margin-right: 1px; margin-bottom: 1px; margin-left: 1px; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('declaration-block-no-redundant-longhand-properties');
	//   });

	//   it('declaration-block-no-shorthand-property-overrides', async () => {
	//     const validCSS = `.a { margin: 1px 2px; }`;
	//     const invalidCSS = `.a { margin: 1px; margin-left: 2px; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('declaration-block-no-shorthand-property-overrides');
	//   });

	//   it('declaration-block-single-line-max-declarations', async () => {
	//     const validCSS = `.a { color: red; }`;
	//     const invalidCSS = `.a { color: red; background: blue; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('declaration-block-single-line-max-declarations');
	//   });

	//   it('declaration-empty-line-before', async () => {
	//     const validCSS = `
	//       .a {
	//         color: red;

	//         background: blue;
	//       }
	//     `;
	//     const invalidCSS = `
	//       .a {
	//         color: red;
	//         background: blue;
	//       }
	//     `;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('declaration-empty-line-before');
	//   });

	//   it('font-family-name-quotes', async () => {
	//     const validCSS = `.a { font-family: "Arial", sans-serif; }`;
	//     const invalidCSS = `.a { font-family: Arial, sans-serif; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('font-family-name-quotes');
	//   });

	//   it('font-family-no-duplicate-names', async () => {
	//     const validCSS = `.a { font-family: Arial, sans-serif; }`;
	//     const invalidCSS = `.a { font-family: Arial, Arial, sans-serif; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('font-family-no-duplicate-names');
	//   });

	//   it('font-family-no-missing-generic-family-keyword', async () => {
	//     const validCSS = `.a { font-family: Arial, sans-serif; }`;
	//     const invalidCSS = `.a { font-family: Arial; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('font-family-no-missing-generic-family-keyword');
	//   });

	//   it('function-calc-no-unspaced-operator', async () => {
	//     const validCSS = `.a { width: calc(100% - 10px); }`;
	//     const invalidCSS = `.a { width: calc(100%-10px); }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('function-calc-no-unspaced-operator');
	//   });

	//   it('function-linear-gradient-no-nonstandard-direction', async () => {
	//     const validCSS = `.a { background: linear-gradient(to right, red, blue); }`;
	//     const invalidCSS = `.a { background: linear-gradient(top, red, blue); }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('function-linear-gradient-no-nonstandard-direction');
	//   });

	//   it('function-name-case', async () => {
	//     const validCSS = `.a { color: rgb(0 0 0); }`;
	//     const invalidCSS = `.a { color: RGB(0 0 0); }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('function-name-case');
	//   });

	//   it('function-no-unknown', async () => {
	//     const validCSS = `.a { color: rgb(0 0 0); }`;
	//     const invalidCSS = `.a { color: unknownFunc(0); }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('function-no-unknown');
	//   });

	//   it('function-url-quotes', async () => {
	//     const validCSS = `.a { background: url("image.png"); }`;
	//     const invalidCSS = `.a { background: url(image.png); }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('function-url-quotes');
	//   });

	//   it('hue-degree-notation', async () => {
	//     const validCSS = `.a { color: hsl(180deg, 50%, 50%); }`;
	//     const invalidCSS = `.a { color: hsl(180, 50%, 50%); }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('hue-degree-notation');
	//   });

	//   it('import-notation', async () => {
	//     const validCSS = `@import url("a.css");`;
	//     const invalidCSS = `@import "a.css";`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('import-notation');
	//   });

	// 	it('keyframe-block-no-duplicate-selectors', async () => {
	//     const validCSS = `@keyframes slide { from { opacity: 0; } to { opacity: 1; } }`;
	//     const invalidCSS = `@keyframes slide { from { opacity: 0; } from { opacity: 1; } }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('keyframe-block-no-duplicate-selectors');
	//   });

	//   it('keyframe-declaration-no-important', async () => {
	//     const validCSS = `@keyframes slide { from { opacity: 0; } }`;
	//     const invalidCSS = `@keyframes slide { from { opacity: 0 !important; } }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('keyframe-declaration-no-important');
	//   });

	//   it('keyframe-selector-notation', async () => {
	//     const validCSS = `@keyframes slide { 0% { opacity: 0; } 100% { opacity: 1; } }`;
	//     const invalidCSS = `@keyframes slide { from { opacity: 0; } 100% { opacity: 1; } }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('keyframe-selector-notation');
	//   });

	//   it('keyframes-name-pattern', async () => {
	//     const validCSS = `@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`;
	//     const invalidCSS = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('keyframes-name-pattern');
	//   });

	//   it('length-zero-no-unit', async () => {
	//     const validCSS = `.a { margin: 0; --custom: 0px; }`;
	//     const invalidCSS = `.a { margin: 0px; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('length-zero-no-unit');
	//   });

	//   it('lightness-notation', async () => {
	//     const validCSS = `.a { color: hsl(0, 0%, 50%); }`;
	//     const invalidCSS = `.a { color: hsl(0, 0%, 0.5); }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('lightness-notation');
	//   });

	//   it('media-feature-name-no-unknown', async () => {
	//     const validCSS = `@media (max-width: 100px) { .a { color: red; } }`;
	//     const invalidCSS = `@media (unknown-feature: 100px) { .a { color: red; } }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('media-feature-name-no-unknown');
	//   });

	//   it('media-feature-name-no-vendor-prefix', async () => {
	//     const validCSS = `@media (max-width: 100px) { .a { color: red; } }`;
	//     const invalidCSS = `@media (-webkit-max-device-pixel-ratio: 2) { .a { color: red; } }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('media-feature-name-no-vendor-prefix');
	//   });

	//   it('media-feature-range-notation', async () => {
	//     const validCSS = `@media (width <= 100px) { .a { color: red; } }`;
	//     const invalidCSS = `@media (max-width: 100px) { .a { color: red; } }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('media-feature-range-notation');
	//   });

	//   it('media-query-no-invalid', async () => {
	//     const validCSS = `@media (max-width: 100px) { .a { color: red; } }`;
	//     const invalidCSS = `@media (max-width: ) { .a { color: red; } }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('media-query-no-invalid');
	//   });

	//   it('named-grid-areas-no-invalid', async () => {
	//     const validCSS = `
	//       .a {
	//         display: grid;
	//         grid-template-areas: "header header" "main sidebar";
	//       }
	//     `;
	//     const invalidCSS = `
	//       .a {
	//         display: grid;
	//         grid-template-areas: "header" "main sidebar";
	//       }
	//     `;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('named-grid-areas-no-invalid');
	//   });

	//   it('no-descending-specificity', async () => {
	//     const validCSS = `
	//       .a { color: red; }
	//       .a.b { color: blue; }
	//     `;
	//     const invalidCSS = `
	//       .a.b { color: blue; }
	//       .a { color: red; }
	//     `;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('no-descending-specificity');
	//   });

	//   it('no-duplicate-at-import-rules', async () => {
	//     const validCSS = `@import url("a.css");`;
	//     const invalidCSS = `@import url("a.css"); @import url("a.css");`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('no-duplicate-at-import-rules');
	//   });

	//   it('no-duplicate-selectors', async () => {
	//     const validCSS = `.a { color: red; } .b { color: blue; }`;
	//     const invalidCSS = `.a { color: red; } .a { color: blue; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('no-duplicate-selectors');
	//   });

	//   it('no-empty-source', async () => {
	//     const validCSS = `.a { color: red; }`;
	//     const invalidCSS = ``;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('no-empty-source');
	//   });

	//   it('no-invalid-double-slash-comments', async () => {
	//     const validCSS = `/* comment */`;
	//     const invalidCSS = `// comment`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('no-invalid-double-slash-comments');
	//   });

	//   it('no-invalid-position-at-import-rule', async () => {
	//     const validCSS = `@import url("a.css"); .a { color: red; }`;
	//     const invalidCSS = `.a { color: red; } @import url("a.css");`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('no-invalid-position-at-import-rule');
	//   });

	//   it('no-irregular-whitespace', async () => {
	//     const validCSS = `.a { color: red; }`;
	//     const invalidCSS = `.a { color: red;\u00A0}`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('no-irregular-whitespace');
	//   });

	//   it('number-max-precision', async () => {
	//     const validCSS = `.a { margin: 1.2345px; }`;
	//     const invalidCSS = `.a { margin: 1.23456px; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('number-max-precision');
	//   });

	//

	//   it('property-no-unknown', async () => {
	//     const validCSS = `.a { color: red; }`;
	//     const invalidCSS = `.a { unknown-property: 1; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('property-no-unknown');
	//   });

	//   it('property-no-vendor-prefix', async () => {
	//     const validCSS = `.a { display: flex; }`;
	//     const invalidCSS = `.a { -webkit-box-flex: 1; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('property-no-vendor-prefix');
	//   });

	//   it('rule-empty-line-before', async () => {
	//     const validCSS = `
	//       .a { color: red; }

	//       .b { color: blue; }
	//     `;
	//     const invalidCSS = `
	//       .a { color: red; }
	//       .b { color: blue; }
	//     `;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('rule-empty-line-before');
	//   });

	//   it('selector-anb-no-unmatchable', async () => {
	//     const validCSS = `.a .b { color: red; }`;
	//     const invalidCSS = `.a > ~ .b { color: red; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-anb-no-unmatchable');
	//   });

	//   it('selector-attribute-quotes', async () => {
	//     const validCSS = `[type="text"] { color: red; }`;
	//     const invalidCSS = `[type=text] { color: red; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-attribute-quotes');
	//   });

	//   it('selector-class-pattern', async () => {
	//     const validCSS = `.button--primary__icon { color: red; }`;
	//     const invalidCSS = `.ButtonPrimaryIcon { color: red; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-class-pattern');
	//   });

	//   it('selector-no-vendor-prefix', async () => {
	//     const validCSS = `.a { color: red; }`;
	//     const invalidCSS = `.-webkit-input-placeholder { color: red; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-no-vendor-prefix');
	//   });

	//   it('selector-not-notation', async () => {
	//     const validCSS = `:not(.a) { color: red; }`;
	//     const invalidCSS = `:not(.a, .b) { color: red; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-not-notation');
	//   });

	//   it('selector-pseudo-class-no-unknown', async () => {
	//     const validCSS = `:hover { color: red; }`;
	//     const invalidCSS = `:unknown { color: red; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-pseudo-class-no-unknown');
	//   });

	//   it('selector-pseudo-element-colon-notation', async () => {
	//     const validCSS = `p::before { content: ''; }`;
	//     const invalidCSS = `p:before { content: ''; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-pseudo-element-colon-notation');
	//   });

	// it('selector-pseudo-element-no-unknown', async () => {
	// 	const validCSS = `
	// 		p::before { content: ''; }
	// 		:host { color: red; }
	// 		:host-context { color: red; }
	// 		::ng-deep { color: red; }
	// 		`;
	// 	const invalidCSS = `p::unknown { content: ''; }`;
	// 	let result = await lintCss(validCSS);
	// 	expect(result.errored).toBe(false);
	// 	result = await lintCss(invalidCSS);
	// 	expect(result.errored).toBe(true);
	// 	expect(result.results[0].warnings[0].rule).toBe('selector-pseudo-element-no-unknown');
	// });

	//   it('selector-type-case', async () => {
	//     const validCSS = `div { color: red; }`;
	//     const invalidCSS = `DIV { color: red; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-type-case');
	//   });

	//   it('selector-type-no-unknown', async () => {
	//     const validCSS = `div { color: red; }`;
	//     const invalidCSS = `unknown-tag { color: red; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('selector-type-no-unknown');
	//   });

	//   it('shorthand-property-no-redundant-values', async () => {
	//     const validCSS = `.a { margin: 1px 2px; }`;
	//     const invalidCSS = `.a { margin: 1px 1px 1px 1px; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('shorthand-property-no-redundant-values');
	//   });

	//   it('string-no-newline', async () => {
	//     const validCSS = `.a { content: "Hello"; }`;
	//     const invalidCSS = `.a { content: "Hello\nWorld"; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('string-no-newline');
	//   });

	//   it('unit-no-unknown', async () => {
	//     const validCSS = `.a { margin: 10px; }`;
	//     const invalidCSS = `.a { margin: 10unknown; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('unit-no-unknown');
	//   });

	//   it('value-keyword-case', async () => {
	//     const validCSS = `.a { display: block; }`;
	//     const invalidCSS = `.a { display: Block; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('value-keyword-case');
	//   });

	//   it('value-no-vendor-prefix', async () => {
	//     const validCSS = `.a { display: box; }`;
	//     const invalidCSS = `.a { display: -webkit-flex; }`;
	//     let result = await lintCss(validCSS);
	//     expect(result.errored).toBe(false);
	//     result = await lintCss(invalidCSS);
	//     expect(result.errored).toBe(true);
	//     expect(result.results[0].warnings[0].rule).toBe('value-no-vendor-prefix');
	//   });
});
