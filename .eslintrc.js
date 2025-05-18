module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	rules: {
		"quotes": ["error", "double"],
		"semi": ["error", "always"]
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	]
};