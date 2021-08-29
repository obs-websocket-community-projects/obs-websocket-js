/** @type {import('eslint').Linter.Config} */
module.exports = {
	"extends": [
		"xo",
		"xo-typescript"
	],
	parserOptions: {
		project: './tsconfig.eslint.json'
	}
}
