import pkg from 'jison';
const { Parser } = pkg;

import { createFilter, dataToEsm } from '@rollup/pluginutils';

const UMD_EXTRA = `if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}`;

export default function jison(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'jison',

    transform(code, id) {
      if (id.slice(-6) !== '.jison' || !filter(id)) return null;

			try  {
				const parser = new Parser(code);
				const generated = parser.generate();
				return {
					code: generated.slice(0,-UMD_EXTRA.length) + "export default parser",
					map: { mappings: '' }
				}
			}catch (err){
				console.log(err);
        const message = 'Could not parse JISON file';
        this.error({ message, id, cause: err });
        return null;
      }
    }
  };
}
