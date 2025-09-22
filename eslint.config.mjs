// eslint.config.js (ESLint v9+)
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
	js.configs.recommended,
	{
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': 'error',
			'no-underscore-dangle': ['error', { allow: ['_id'] }],
			'no-console': 'off',
			'class-methods-use-this': 'off',
			'no-loop-func': 'off',
			camelcase: 'warn',
			'func-names': 'off',
			'no-use-before-define': ['error', { functions: true, classes: true }],
			'no-param-reassign': [2, { props: false }],
			'prefer-destructuring': ['error', { object: true, array: false }],
			'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
			'no-prototype-builtins': 'off',
			'no-shadow': 'off',
			curly: ['error', 'all'],
			'no-trailing-spaces': 'error',
		},
		settings: {
			'import/resolver': {
				node: {
					extensions: ['.js', '.mjs', '.cjs'],
				},
			},
		},
	},
];
