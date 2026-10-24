/**
 * Repository-wide JavaScript correctness rules.
 *
 * Naming and stylistic consistency remain Prettier's responsibility so ESLint
 * can focus on defects without competing with the formatter.
 */
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
	{
		ignores: [
			"dist/**",
			"node_modules/**",
			"data/**",
			"public/**",
			"github-imgs/**",
			".tmp-gen1.js",
		],
	},
	js.configs.recommended,
	{
		files: ["**/*.{js,jsx,mjs}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			react,
			"react-hooks": reactHooks,
		},
		settings: {
			react: { version: "detect" },
		},
		rules: {
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			// Legacy modules still expose hooks and optional callbacks by assignment.
			// Enable unused-symbol enforcement directory by directory as ownership moves to ES modules.
			"no-unused-vars": "off",
			"no-control-regex": "off",
			"no-empty": "off",
			"no-useless-escape": "off",
			"react/prop-types": "off",
			"react/no-unescaped-entities": "off",
		},
	},
	{
		files: [
			"api/**/*.js",
			"scripts/**/*.mjs",
			"test/**/*.js",
			"vite.config.js",
		],
		languageOptions: {
			globals: globals.node,
		},
	},
];
