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
	overrides: [
		{
			files: ['test/**/*.{js,ts}'],
			extends: [
				'plugin:ava/recommended',
			],
		},
	],
};
