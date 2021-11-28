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
			// Allow for OBS in class/interface name, UPPER_CASE const
			'error',
			{
				// selector: ['variableLike', 'memberLike', 'property', 'method'],
				// Note: Leaving out `parameter` and `typeProperty` because of the mentioned known issues.
				// Note: We are intentionally leaving out `enumMember` as it's usually pascal-case or upper-snake-case.
				selector: ['function', 'classProperty', 'objectLiteralProperty', 'parameterProperty', 'classMethod', 'objectLiteralMethod', 'typeMethod', 'accessor'],
				format: [
					'strictCamelCase',
				],
				// We allow double underscope because of GraphQL type names and some React names.
				leadingUnderscore: 'allowSingleOrDouble',
				trailingUnderscore: 'allow',
				// Ignore `{'Retry-After': retryAfter}` type properties.
				filter: {
					regex: '[- ]',
					match: false,
				},
			},
			// MOD: Variable separately to allow for UPPER_CASE const
			{
				selector: ['variable'],
				modifiers: ['const'],
				format: ['strictCamelCase', 'UPPER_CASE'],
			},
			{
				selector: ['variable'],
				format: [
					'strictCamelCase',
				],
				// We allow double underscope because of GraphQL type names and some React names.
				leadingUnderscore: 'allowSingleOrDouble',
				trailingUnderscore: 'allow',
			},
			{
				selector: 'typeLike',
				format: [
					// MOD: Allow for OBS
					'PascalCase',
				],
			},
			{
				selector: 'variable',
				types: [
					'boolean',
				],
				format: [
					'StrictPascalCase',
				],
				prefix: [
					'is',
					'has',
					'can',
					'should',
					'will',
					'did',
				],
			},
			{
				// Interface name should not be prefixed with `I`.
				selector: 'interface',
				filter: /^(?!I)[A-Z]/.source,
				format: [
					// MOD: Allow for OBS
					'PascalCase',
				],
			},
			{
				// Type parameter name should either be `T` or a descriptive name.
				selector: 'typeParameter',
				filter: /^T$|^[A-Z][a-zA-Z]+$/.source,
				format: [
					'StrictPascalCase',
				],
			},
			// Allow these in non-camel-case when quoted.
			{
				selector: [
					'classProperty',
					'objectLiteralProperty',
				],
				format: null,
				modifiers: [
					'requiresQuotes',
				],
			},
		],
		'capitalized-comments': 'off',
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
