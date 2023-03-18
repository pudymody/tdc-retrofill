import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import jison from "./rollup-plugin-jison.mjs";
export default {
	input: {"tdc": 'element.js', "test": "test.mjs" },
	output: {
		dir: 'dist',
		format: 'es'
	},
  plugins: [jison(),commonjs(), nodeResolve()]
};
