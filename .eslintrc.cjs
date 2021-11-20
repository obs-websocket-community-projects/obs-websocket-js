/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
const xoTypescript = require('eslint-config-xo-typescript');

/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		'xo',
		'xo-typescript',
	],
	parserOptions: {
		project: './tsconfig.eslint.json',
		extraFileExtensions: ['.cjs'],
	},
	rules: {
		'@typescript-eslint/naming-convention': [
			// Allow for OBS in class/interface name
			...xoTypescript.rules['@typescript-eslint/naming-convention'].map(
				options => {
					console.log({options});
					if (options.selector === 'typeLike' || options.selector === 'interface') {
						return {
							...options,
							format: ['PascalCase'],
						};
					}

					return options;
				},
			),
		],
	},
	overrides: [
		{
			files: ['test/**/*.{js,ts}'],
			extends: [
				'plugin:ava/recommended',
			],
		},
	],
};
