import path from 'node:path';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expectedBadCount = 50;

const rulesToTest = new Set([
	'order/order',
	'order/properties-alphabetical-order',
	'block-no-empty',
	'color-function-notation',
	'color-hex-length',
	'comment-empty-line-before',
	'comment-whitespace-inside',
	'custom-media-pattern',
	'custom-property-pattern',
	'declaration-block-no-redundant-longhand-properties',
	'declaration-empty-line-before',
	'font-family-name-quotes',
	'function-name-case',
	'function-no-unknown',
	'function-url-quotes',
	'hue-degree-notation',
	'import-notation',
	'keyframe-selector-notation',
	'keyframes-name-pattern',
	'length-zero-no-unit',
	'media-feature-range-notation',
	'number-max-precision',
	'property-no-vendor-prefix',
	'rule-empty-line-before',
	'selector-class-pattern',
	'selector-no-vendor-prefix',
	'selector-not-notation',
	'selector-pseudo-element-colon-notation',
	'selector-pseudo-element-no-unknown',
	'selector-type-case',
	'selector-type-no-unknown',
	'shorthand-property-no-redundant-values',
	'value-keyword-case',
	'value-no-vendor-prefix'
]);

(async () => {
	try {
		const result = await stylelint.lint({
			files: [
				path.join(__dirname, 'files/bad.css'),
				path.join(__dirname, 'files/bad.scss'),
				path.join(__dirname, 'files/good.css'),
				path.join(__dirname, 'files/good.scss')
			],
			formatter: 'json',
			config: {
				rules: {},
				overrides: [
					{
						files: ['./test/files/*.css', './test/files/*.scss'],
						extends: ['./index.js']
					}
				]
			}
		});

		let output;
		try {
			output = JSON.parse(result.report || '[]');
		} catch (e) {
			console.error('❌ Could not parse stylelint output as JSON:', e.message);
			console.error('Raw output was:', result.output);
			process.exit(1);
		}

		const [badCSS, badSCSS, goodCSS, goodSCSS] = output;

		if (output.length !== 4) {
			console.error('❌ Expected 4 results , got:', output.length);
			process.exit(1);
		}

		if (goodCSS.warnings.length > 0) {
			console.error('❌ Errors during formatting good.css file.');
			process.exit(1);
		}

		if (goodSCSS.warnings.length > 0) {
			console.error('❌ Errors during formatting good.scss file.');
			process.exit(1);
		}

		console.log(`Testing ${rulesToTest.size} rules.`);
		testFile('bad.css', badCSS.warnings, expectedBadCount);
		testFile('bad.scss', badSCSS.warnings, expectedBadCount);
		process.exit(1);
	} catch (err) {
		console.error('❌ Stylelint failed:', err);
		process.exit(1);
	}
})();

function testFile(filename, warnings, expectedBadCount) {
	const uniqueRules = new Set(warnings.map((x) => x.rule));
	let rulesTestedCount = 0;

	for (const r of uniqueRules) {
		if (!rulesToTest.has(r)) {
			console.warn(
				`👉 Rule ${r} has been tested, but is not present in rulesToTest array. Please update test.mjs file.`
			);
		}
	}

	for (const r of rulesToTest) {
		if (!uniqueRules.has(r)) {
			console.warn(`👉 Rule ${r} has not been tested.`);
		} else {
			rulesTestedCount += 1;
		}
	}

	if (rulesTestedCount === rulesToTest.size) {
		console.error(`All rules have been tested for ${filename} file.`);
	}

	if (warnings.length === expectedBadCount) {
		console.log('✅ Test passed - stylelint failed as expected.');
		return;
	}

	console.error(
		`❌ Expected ${expectedBadCount} bad file warning(s), but got ${warnings.length} for ${filename} file.`
	);
}
