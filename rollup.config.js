
/**
 * @description: rollup config
 * @return {*}
 */
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtin = require('rollup-plugin-node-builtins');
const terser = require('rollup-plugin-terser').terser;

/**
 * @description: rollup config 
 * @param {*} minimize
 * @return {*}
 */
function genConfig(minimize = false) {

	return {
		input: './esm/main.js',
		output: {
			name: 'jc-request-adapter',
			file: minimize ? './dist/jc-request-adapter.min.js' : './dist/jc-request-adapter.js',
			format: 'umd',
			sourcemap: false,
		},
		external: ['axios'],
		plugins: [
			resolve(),
			commonjs(),
			builtin(),
			minimize ? terser() : void 0,
		],
	};
}

module.exports = [
	genConfig(),
	genConfig(true),
];
