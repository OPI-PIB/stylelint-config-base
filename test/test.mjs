import path from 'node:path';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
	try {
		const result = await stylelint.lint({
			files: [
				path.join(__dirname, 'files/bad.css'),
				path.join(__dirname, 'files/bad.scss'),
				path.join(__dirname, 'files/good.css'),
				path.join(__dirname, 'files/good.scss'),
			],
			formatter: 'json',
			config: {
				rules: {},
				overrides: [
					{
						files: ['./test/files/*.css', './test/files/*.scss'],
						extends: ['./index.js'],
					},
				],
			},
		});

		let output;
		try {
			output = JSON.parse(result.report || '[]');
		} catch (e) {
			console.error(
				'❌ Could not parse stylelint output as JSON:',
				e.message
			);
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

		const expectedBadCount = 54;
		const actualBadCountCSS = badCSS.warnings.length;
		const actualBadCountSCSS = badSCSS.warnings.length;

		if (
			actualBadCountCSS === expectedBadCount &&
			actualBadCountSCSS === expectedBadCount
		) {
			console.log('✅ Test passed - stylelint failed as expected.');
			process.exit(0);
		}

		console.error(
			`❌ Expected ${expectedBadCount} bad file warning(s), but got ${actualBadCountCSS} for bad.css file.`
		);
		console.error(
			`❌ Expected ${expectedBadCount} bad file warning(s), but got ${actualBadCountSCSS} for bad.scss file.`
		);
		process.exit(1);
	} catch (err) {
		console.error('❌ Stylelint failed:', err);
		process.exit(1);
	}
})();
